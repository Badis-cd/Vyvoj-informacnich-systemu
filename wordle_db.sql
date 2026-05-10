-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Ned 10. kvě 2026, 18:33
-- Verze serveru: 10.4.32-MariaDB
-- Verze PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `wordle_db`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `historie_her`
--

CREATE TABLE `historie_her` (
  `id` int(11) NOT NULL,
  `uzivatel_id` int(11) NOT NULL,
  `prvni_slovo` varchar(5) NOT NULL,
  `pocet_pokusu` int(11) NOT NULL,
  `vysledek` varchar(10) NOT NULL,
  `body` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `historie_her`
--

INSERT INTO `historie_her` (`id`, `uzivatel_id`, `prvni_slovo`, `pocet_pokusu`, `vysledek`, `body`) VALUES
(1, 2, 'WATER', 6, 'prohra', 0),
(2, 2, 'WATER', 6, 'prohra', 0),
(3, 2, 'WATER', 6, 'prohra', 0),
(4, 2, 'WATER', 6, 'prohra', 0),
(5, 2, 'WATER', 6, 'prohra', 0),
(6, 2, 'WATER', 6, 'prohra', 0),
(7, 2, 'WATER', 6, 'prohra', 0),
(8, 2, 'WATER', 6, 'prohra', 0),
(9, 2, 'WATER', 6, 'prohra', 0),
(10, 2, 'WATER', 6, 'prohra', 0),
(11, 2, 'WATER', 6, 'vyhra', 1);

-- --------------------------------------------------------

--
-- Struktura tabulky `uzivatele`
--

CREATE TABLE `uzivatele` (
  `id` int(11) NOT NULL,
  `jmeno` varchar(50) NOT NULL,
  `heslo` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT 'default.png',
  `odehrane_hry` int(11) DEFAULT 0,
  `vyhry` int(11) DEFAULT 0,
  `prohry` int(11) DEFAULT 0,
  `celkove_body` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vypisuji data pro tabulku `uzivatele`
--

INSERT INTO `uzivatele` (`id`, `jmeno`, `heslo`, `avatar_url`, `odehrane_hry`, `vyhry`, `prohry`, `celkove_body`) VALUES
(1, 'Admin', '123', 'default.png', 0, 0, 0, 0),
(2, 'Badis', '$2y$10$MD/Ua35sh0jorqrFkUQYXeEBEPq1PzvN998dWi1UOVmiOwtbaV1r.', 'default.png', 14, 2, 12, 1),
(3, 'ZICHALA', '$2y$10$wM5LYVSdWzUq7wNRl4pu5eL.ELB6yvEifo/s6KkGWUZv3Os45ywBy', 'default.png', 1, 0, 1, 0);

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `historie_her`
--
ALTER TABLE `historie_her`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uzivatel_id` (`uzivatel_id`);

--
-- Indexy pro tabulku `uzivatele`
--
ALTER TABLE `uzivatele`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `jmeno` (`jmeno`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `historie_her`
--
ALTER TABLE `historie_her`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pro tabulku `uzivatele`
--
ALTER TABLE `uzivatele`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `historie_her`
--
ALTER TABLE `historie_her`
  ADD CONSTRAINT `historie_her_ibfk_1` FOREIGN KEY (`uzivatel_id`) REFERENCES `uzivatele` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
