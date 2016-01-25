-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	5.7.9-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recept`
--

DROP TABLE IF EXISTS `recept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recept` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `gebruiker_ID` int(11) NOT NULL,
  `titel` varchar(100) NOT NULL,
  `beschrijving_kort` mediumtext NOT NULL,
  `beschrijving_lang` longtext NOT NULL,
  `foto_naam` varchar(100) DEFAULT NULL,
  `keuken_ID` int(11) DEFAULT NULL,
  `land_ID` int(11) DEFAULT NULL,
  `foto_time` varchar(100) DEFAULT NULL,
  `beoordeling` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_recept_gebruiker_idx` (`gebruiker_ID`),
  KEY `fk_recept_keuken1_idx` (`keuken_ID`),
  KEY `fk_recept_land1_idx` (`land_ID`),
  CONSTRAINT `fk_recept_gebruiker` FOREIGN KEY (`gebruiker_ID`) REFERENCES `gebruiker` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_recept_keuken1` FOREIGN KEY (`keuken_ID`) REFERENCES `keuken` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_recept_land1` FOREIGN KEY (`land_ID`) REFERENCES `land` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recept`
--

LOCK TABLES `recept` WRITE;
/*!40000 ALTER TABLE `recept` DISABLE KEYS */;
INSERT INTO `recept` VALUES (4,1,'Ribeye steak à la Café de Paris','Het perfecte recept voor een echte steak.','Het perfecte recept voor een echte steak.\r\n\r\nHaal de steaks ruim 1 uur van tevoren uit de koelkast. Bestrooi het vlees (vlak voor bereiding) naar eigen smaak met peper en zout. Verhit de boter in de royale koekenpan totdat de boter licht bruin gekleurd is èn niet meer bruist (voor een optimale bereiding van een heerlijke ribeye moet de koekenpan flink heet zijn!). Bak de ribeye als een biefstuk, dat wil zeggen: aan iedere kant 2 minuten. Zet daarna de warmtebron op de laagste stand en leg op iedere ribeye een groot stuk kruidenboter. Laat het vlees nog 2 minuten op het lage vuur staan. Ook lekker in combinatie met gebakken kastanje champignons.','seared-foie-for-wine-dinner-600x320.jpg',NULL,NULL,'20160117143013-seared-foie-for-wine-dinner-600x320.jpg',NULL),(5,1,'Hamburger a la Organic Hallo','Een broodje hamburger, maar dan even anders.','Een broodje hamburger, maar dan even anders. De saus van de komkommer maakt het af, het is eigenlijk een raita zoals die in India bij een curry wordt gegeten. Zo zet je een exotische lunch op tafel met weinig extra werk. Je kan het natuurlijk ook als avondeten bereiden met frites en een frisse salade.\r\n\r\nSnij de aubergine in de lengte in dunne plakken, het liefst zo dun mogelijk! Smeer deze plakken in met olijfolie en doe er peper en zout op. Bak of gril de plakken aubergine in een (grill) pan, totdat ze bruin zijn. Leg de gegrilde plakken aubergine op een keukenpapiertje.\r\nVerwarm ondertussen de pitabroodjes in de oven.\r\nSchil de komkommers en verwijder eventueel het zaad (dat hoeft niet, ik vind het onzin). Snij de komkommers in zo klein mogelijke stukjes en meng ze met de yoghurt. Rasp of hak de gember ook zo fijn mogelijk en voeg deze samen met de specerijen bij de yoghurt.\r\nBak ondertussen de hamburgers zoals is aangegeven op de verpakking. Snij als laatste de muntblaadjes en roer deze samen met het limoensap door de yoghurt.\r\nSnij de pitabroodjes open en leg de hamburgers ertussen. Bedek rijkelijk met de “raita” en doe de plakken gegrilde aubergine ertussen.\r\n\r\n“Pikante tip”: Je kan als je van pittig houdt, de hamburgers voordat je ze gaat bakken bestrooien met gemalen chilipepers of cayennepeper.\r\n\r\nDrink hierbij een lekker kruidig/fris biertje van La Trappe','hamburger.jpg',NULL,NULL,'20160118231228-hamburger.jpg',NULL),(6,2,'Waterkers stamppot','Heerlijk stamppotje met chipolata worstjes en verse waterkers','Schil, was en kook de aardappelen. Braad de chipolataworstjes in wat olijfolie met boter totdat ze gaar zijn (dus tot ze een lekker korstje hebben en niet meer roze zijn vanbinnen). Snijd ondertussen de waterkers klein en bak die heel even in wat boter met zout en peper. Stamp de nog warme aardappelen en roer de waterkers erdoor. Voeg de warme room en/of melk toe en eventueel zout, peper en komijn. Roer er nog een beetje boter of olijfolie door. Inmiddels zijn de worstjes gaar. Haal ze uit de pan, voeg wat water toe aan het bakvet en roer dat los om er jus van te maken. Verdeel de stamppot over 4 borden, snij de worstjes in stukjes en serveer bovenop het waterkers stampotje, maak het geheel af met een lepel heerlijke jus!\r\n\r\nEet smakelijk!\r\n\r\nWijntip: drink er een heerlijke zachte rode blauburgunder bij van Hans Diwald','chipo.jpg',NULL,NULL,'20160117152324-chipo.jpg',NULL),(7,1,'Dit is een pizza','Maak het deeg een paar uur','1 Maak het deeg een paar uur voor je wilt gaan eten. Doe de bloem en het zout in een kom en maak een kuiltje in het midden. Los de gist met de suiker op in 600 ml lauw water. Roer tot het begint te schuimen en schenk het in het kuiltje. Meng met je handen tot je een zacht deeg hebt; voeg evt. extra water toe.\r\n\r\n2 Kneed het deeg 5 min. op een met bloem bestoven werkvlak, tot het soepel en elastisch is. Doe terug in de kom, leg er een vochtige theedoek over en laat het in ongeveer 1 uur rijzen tot het dubbele volume.\r\n\r\n3 Verhit voor de tomatensaus wat olie en bak de knoflook met de basilicumsteeltjes goudbruin. Voeg de tomaten toe en verhit ze mee, tot het vocht iets is ingekookt. Laat ze een iets afkoelen en pureer ze tot een saus; gebruik de helft nu en vries de rest in.\r\n\r\n4 Verwarm de oven voor op de hoogste stand. Sla de lucht uit het deeg. Rol de helft uit tot 2 cirkels (Ø 30 cm) en vries de andere helft in. Leg de pizzabodems op 2 lichtjes ingevette bakplaten en smeer er een dunne laag tomatensaus op. Verdeel de toppings erover en besprenkel met wat olie. Bak ze in 10–15 min. krokant. Serveer met de basilicumblaadjes erover en de waterkers met wat olie en azijn erbij.\r\n\r\nPer portie 978 kcal, 43,3 g vet (16,1 g verzadigd), 35,9 g eiwit, 106,6 g koolhydraten, 7,2 g suikers','pizza.jpg',NULL,NULL,'20160118163326-pizza.jpg',NULL),(9,6,'Mandarijnen Tulband','Heerlijke tulband met clementine mandarijnen.','Heerlijke tulband met clementine mandarijnen.\r\n\r\nVerwarm de oven voor op 160 graden.\r\nMeng amandelen (gemalen of meel), bloem, gemberpoeder en mandarijnrasp.\r\nKlop boter en kiristalsuiker licht en schuimig en roer er 1 voor 1 de eidooiers door.\r\nSpatel daarna het amandelmengsel erdoor.\r\nKlop de ricotta los en roer het mandarijnsap erdoor.\r\nKlop de eiwitten stijf met een snufje zout. Spatel eiwitten en ricottamengsel voorzichtig door het amandelmengsel.\r\nSchep het mengsel in een ingevette tulbandvorm en bak de cake in 45-55 minuten gaar en lichtbruin in het midden van de oven.\r\nLaat de cake circa 10 minuten afkoelen in de vorm. Haal hem daarna uit de vorm en laat op een rooster verder afkoelen.\r\nBestrooi dun met poedersuiker.','Mandarijnen-tulband-600x600.jpg',NULL,NULL,'20160118232401-Mandarijnen-tulband-600x600.jpg',NULL);
/*!40000 ALTER TABLE `recept` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-19 22:36:46
