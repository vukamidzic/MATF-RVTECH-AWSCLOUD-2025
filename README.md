# MATF-RVTECH-AWSCLOUD-2025
Projekat koji služi za pronalazak najbližih kafića u okruženju elektricnog punjača, a čija je
svrha demonstracija korišćenja osnovnih AWS servisa (lambde, DynamoDB, S3 bucket) u emuliranom Localstack okruženju

## Neophodno za rad
Pre pokretanja projekta, instalirajte sledeće alate:
- [Docker](https://www.docker.com/) (i Docker Compose)
- [Node](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [AWS Localstack CLI](https://docs.localstack.cloud/aws/)

## Korišćeni servisi i alati
- Lambde (dohvatanje informacija o električnim punjačima i kafićima)
- DynamoDB (čuvanje informacija o električnim punjačima širom Srbije)
- S3 bucket (držanje statičke stranice)
- Svelte framework (generisanje Single Page Application-a)

## AWS servisi
Na početku je potrebno pokrenuti Localstack okruženje za emuliranje preko:
```
sudo docker-compose up 
```
(ukoliko ne želite da pratite logove kontejnera možete dodati opciju `-d` na kraj)

Da bi se pokrenuli servisi (lambde, DynamoDB, S3 bucket), potrebno je pokrenuti sledeću komandu:
```
npm run deploy-backend
```
Za dobijanje gateway endpoint ID-a možete pokrenuti `npm run endpoint-id` i u `frontend/src/routes/+page.svelte` postaviti ga kao vrednost varijable `gatewayID`

## Web stranica
Da bi se videla glavna stranica, potrebno je pokrenuti komandu:
```
npm run deploy-frontend
```
koja će izvršiti build-ovanje i postaviti generisan index.html (kao i dodatne fajlove) u prethodno generisan S3 bucket.
Za dobijanje URL web stranice možete pokrenuti `npm run website-url` 
