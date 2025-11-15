import os
import time
import logging
from datetime import datetime, timezone
import psycopg2
import redis
from zoneinfo import ZoneInfo 

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

PG_DSN = os.getenv("PG_DSN")
REDIS_DSN = os.getenv("REDIS_DSN")
INTERVAL_SEC = int(os.getenv("INTERVAL_SEC", "300")) # increment => chaque 5 min
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "1000"))
CURSOR_FILE = os.getenv("CURSOR_FILE", "/data/last_cursor.txt")  # on note l'heure de syncro en cursor
FULL_RESET_ON_FIRST_RUN = os.getenv("FULL_RESET_ON_FIRST_RUN", "1") == "1"
# full refresh ==> une fois par jour à 4h du mat
LOCAL_TZ = ZoneInfo(os.getenv("LOCAL_TZ", "Europe/Paris"))
FULL_REFRESH_TIME = os.getenv("FULL_REFRESH_TIME", "04:00")    
LAST_FULL_FILE = os.getenv("LAST_FULL_FILE", "/data/last_full_refresh.txt")

r = redis.from_url(REDIS_DSN, decode_responses=True)

def get_pg_conn():
    return psycopg2.connect(PG_DSN)

# lecture de cursor
def read_cursor():
    try:
        with open(CURSOR_FILE, "r") as f:
            return datetime.fromisoformat(f.read().strip())
    except Exception:
        return datetime.fromtimestamp(0, tz=timezone.utc)

def write_cursor(dt: datetime):
    #on note l'heure de l'incrément traité
    os.makedirs(os.path.dirname(CURSOR_FILE), exist_ok=True)
    with open(CURSOR_FILE, "w") as f:
        f.write(dt.isoformat())

# DB
def fetch_badges(conn, limit: int):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT badge_id FROM people WHERE badge_id IS NOT NULL LIMIT %s",
            (limit,),
        )
        rows = [r[0] for r in cur.fetchall()]
    return rows
def fetch_changed_badges(conn, since: datetime):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT badge_id, last_update
            FROM people
            WHERE badge_id IS NOT NULL
              AND last_update > %s
            ORDER BY last_update ASC
        """, (since,))
        return cur.fetchall()

#Redis
def sadd_badges(badges):
    if not badges:
        return 0
    pipe = r.pipeline()
    for badge_id, _ in badges:
        pipe.sadd("badges:active", badge_id)
    pipe.execute()
    return len(badges)

def full_warmup():
    if FULL_RESET_ON_FIRST_RUN:
        try:
            r.delete("badges:active")
            logging.info("reset badges:active")
        except Exception:
            logging.exception("failed to reset badges:active (ignored)")

    conn = get_pg_conn()
    try:
        badges = fetch_badges(conn, BATCH_SIZE)
        if badges:
            r.sadd("badges:active", *badges)
            logging.info(f"Loaded {len(badges)} badge_ids into Redis")
        else:
            logging.info("No badges found in DB")
    finally:
        conn.close()
# increment
def incremental_loop():
    logging.info("=======start incremental loop========")
    while True:
        since = read_cursor()
        conn = get_pg_conn()
        try:
            rows = fetch_changed_badges(conn, since)
            if rows:
                count = sadd_badges(rows)
                latest = max(ts for _, ts in rows if ts is not None)
                write_cursor(latest)
                logging.info(f"updated {count} badges; cursor={latest.isoformat()}")
            else:
                logging.info(f"no changes since {since.isoformat()}")
        finally:
            conn.close()
        time.sleep(INTERVAL_SEC)
if __name__ == "__main__":
    logging.info("starting cache-loader, full warm up + incremental")
    full_warmup()
    incremental_loop()
    logging.info("done.")