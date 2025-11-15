import { Kafka } from 'kafkajs'; // import de la classe kafka : permet de creer un "client kafka" qui produit/consomme des messages
import env from '../config/env.js'; // import du module .env ou sont stockées les variables d'nevironnements

// Crée et configure l'instance Kafka (client)

/** la fonction permet de creer une instance de kafka avce des parametre precis**/
export function createKafka() {  // on creer une function exproté afin de l'utiliser plus tard dans d'autre fichiers
    return new Kafka({
        clientId: 'telemetry-service',           // nom du client Kafka
        brokers: [env.KAFKA_BROKER],             // listes des brokers auxquels peut se connecter le client ici 1seul : IP/port du broker
        retry: { retries: 5 },                   // tentatives si échec : on autorise 5 essais
    });
}