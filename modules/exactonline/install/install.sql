-- --------------------------------------------------------


--
-- Tabelstructuur voor tabel `exact_project_templates`
--

CREATE TABLE IF NOT EXISTS `exact_addressbook_addressbook` (
  `addressbook_id` int(11) NOT NULL,
  `division_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `exact_addressbook_companys` (
  `company_id` int(11) NOT NULL,
  `account_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `exact_project2_income` (
  `income_id` int(11) NOT NULL,
  `invoice_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_fee` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `exact_project_templates` (
  `template_id` int(11) NOT NULL,
  `division_number` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `exact_addressbook_addressbook`
  ADD PRIMARY KEY (`addressbook_id`),
  ADD UNIQUE KEY `addressbook_id` (`addressbook_id`);


ALTER TABLE `exact_addressbook_companys`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `company_id` (`company_id`);


ALTER TABLE `exact_project_templates`
  ADD PRIMARY KEY (`template_id`);