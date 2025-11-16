# Core Operational Backend :
Le Core Operational Backend est un microservice Spring Boot chargé de traiter les événements Telemetry provenant des badgeuses.
Il vérifie les badges dans Redis, décide si l’entrée est autorisée ou refusée, et publie les décisions dans Kafka.

## Rôle du service
	1.	Consommer les événements Telemetry depuis Kafka
    → topic d’entrée : attempts 
	2.	Vérifier si le badge existe dans Redis
	3.	Produire une décision
	•	ALLOWED → envoyé dans un topic métier (entrance)
	•	REJECTED → pas envoyé dans le topic métier
	4.	Journaliser toutes les décisions
    → topic logs (ALLOWED + REJECTED)

## Technologies utilisées
	•	Java 21
	•	Spring Boot
	•	Spring Kafka
	•	Spring Data Redis
	•	Docker
	•	Kafka (VM)
	•	Redis (serveur externe)

## Format TelemetryEvent (entrée Kafka)
{
  "badgeID": "123",
  "doorID": "G1",
  "timestamp": "2025-11-15T00:51:02Z"
}

## Format EntranceEvent (sortie Kafka)
{
  "badgeID": "123",
  "doorID": "G1",
  "timestamp": "2025-11-15T00:51:02Z",
  "action": "ALLOWED"   // ou "REJECTED"
}

## Topics Kafka utilisés
    Entrée : attempts -> événements qui proviennent de telemetry
    Sorties: entrance -> pour les badges ALLOWED
    Logs : logs -> badges ALLOWED + REJECTED