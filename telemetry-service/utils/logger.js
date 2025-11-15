// utils/logger.js
import pino from 'pino';
import fs from 'fs';
import pkg from 'pino-multi-stream';
import pretty from 'pino-pretty';

const { multistream } = pkg;

// 1️⃣ Console pretty (colorisé)
const prettyConsole = pretty({
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
});

// 2️⃣ Fichier JSON brut
const rawFile = fs.createWriteStream('./logs/app.log', { flags: 'a' });

// 3️⃣ Fichier pretty lisible (sans couleurs, pour ouvrir dans un éditeur)
const prettyFile = pretty({
    colorize: false,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
    destination: fs.createWriteStream('./logs/app-pretty.log', { flags: 'a' }),
});

// 4️⃣ Multi-stream Pino
const streams = multistream([
    { stream: prettyConsole }, // Console
    { stream: rawFile },       // logs/app.log (JSON)
    { stream: prettyFile },    // logs/app-pretty.log (lisible)
]);

const logger = pino(
    { level: process.env.LOG_LEVEL || 'info' },
    streams
);

export default logger;