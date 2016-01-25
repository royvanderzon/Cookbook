# Werkcollege 5 huiswerkopdracht


## Overview

In de opdracht van werkcollege 4 werden gegevens uit de database in een view getoond. In deze opdracht ga je het loginsysteem koppelen aan de database zodat alle gebruikers in de database in kunnen loggen. Daarna zorg je ervoor dat je via een registratieformulier nieuwe gebruikers aan de database kunt toevoegen.

### Ter voorbereiding

    -  [MySQL INSERT](http://www.mysqltutorial.org/mysql-insert-statement.aspx)
    -  [MySQL UPDATE](http://www.mysqltutorial.org/mysql-update-data.aspx)
    -  [MySQL DELETE](http://www.mysqltutorial.org/mysql-delete-statement.aspx)

## Opdracht 1

1. upload de map met de huiswerkopdracht naar de server en voer in die map op de server het commando ```npm install``` uit om de afhankelijkheden te installeren.

2. Pas nu de ```[POST] /users/login``` route aan zodat alle gebruikers die in de database staan kunnen inloggen.

## Opdracht 2

1. Maak een registratieformulier met de routes ```[GET] /users/register``` en ```[POST] /users/register``` waarmee gebruikers een nieuw account kunnen aanmaken in de database. Zorg dat lege gebruikersnamen en wachtwoorden worden afgevangen.

2. Voeg de routes ```[GET] /users/remove/:index``` en ```[POST] /users/remove/:index```en de bijbehorende code toe zodat je de specifieke gebruiker waarvan de kunt verwijderen uit de database.

3. Voeg de routes ```[GET] /users/edit/:index``` en ```[POST] /users/edit/:index``` en de bijbehorende code toe zodat een ingelogde gebruiker zijn eigen wachtwoord kan resetten.