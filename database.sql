-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 08, 2025 at 02:13 PM
-- Server version: 11.8.2-MariaDB
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bf_arabe1`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddParticipant` (IN `p_nom_prenom` VARCHAR(200), IN `p_cin` VARCHAR(50), IN `p_entreprise` VARCHAR(200), IN `p_tel_fix` VARCHAR(20), IN `p_fax` VARCHAR(20), IN `p_tel_port` VARCHAR(20), IN `p_mail` VARCHAR(200), IN `p_theme_part` VARCHAR(500), IN `p_num_salle` INT, IN `p_date_debut` DATE)   BEGIN
    INSERT INTO participant (nom_prenom, cin, entreprise, tel_fix, fax, tel_port, mail, theme_part, num_salle, date_debut)
    VALUES (p_nom_prenom, p_cin, p_entreprise, p_tel_fix, p_fax, p_tel_port, p_mail, p_theme_part, p_num_salle, p_date_debut);
    
    SELECT 'Participant added successfully' as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddTrainingCycle` (IN `p_num_act` VARCHAR(50), IN `p_theme` VARCHAR(500), IN `p_date_deb` DATE, IN `p_date_fin` DATE, IN `p_for1` VARCHAR(200), IN `p_for2` VARCHAR(200), IN `p_for3` VARCHAR(200), IN `p_num_salle` INT)   BEGIN
    INSERT INTO cycle (num_act, theme, date_deb, date_fin, for1, for2, for3, num_salle)
    VALUES (p_num_act, p_theme, p_date_deb, p_date_fin, p_for1, p_for2, p_for3, p_num_salle);
    
    SELECT 'Training cycle added successfully' as message;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetParticipantsByTheme` (IN `p_theme` VARCHAR(500))   BEGIN
    SELECT 
        nom_prenom,
        cin,
        entreprise,
        tel_fix,
        tel_port,
        mail,
        date_debut
    FROM participant 
    WHERE theme_part = p_theme
    ORDER BY nom_prenom;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL COMMENT 'Username',
  `pass` varchar(255) NOT NULL COMMENT 'Password',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `nom`, `pass`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$12$9yRWkkdhm8GhkUclzw.F8eUPkvZlJz31wF2XEr8eE.GVGVppygNO6', '2025-08-01 11:45:54', '2025-08-07 13:50:43'),
(2, 'manager', '$2b$12$A.6k67x7KJNSK7CKgTp0QOE89OJNSC43VkY9Slq4d0UeCY3Ale44W', '2025-08-01 11:45:54', '2025-08-07 13:50:43');

--
-- Triggers `admin`
--
DELIMITER $$
CREATE TRIGGER `after_admin_login` AFTER UPDATE ON `admin` FOR EACH ROW BEGIN
    -- This could be extended to log login attempts in a separate table
    -- For now, it just updates the updated_at timestamp
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cycle`
--

CREATE TABLE `cycle` (
  `id` int(11) NOT NULL,
  `num_act` varchar(50) NOT NULL COMMENT 'Operation Number',
  `theme` varchar(500) NOT NULL COMMENT 'Training Course Theme',
  `date_deb` date NOT NULL COMMENT 'Start Date',
  `date_fin` date NOT NULL COMMENT 'End Date',
  `for1` varchar(200) DEFAULT NULL COMMENT 'Trainer 1',
  `for2` varchar(200) DEFAULT NULL COMMENT 'Trainer 2',
  `for3` varchar(200) DEFAULT NULL COMMENT 'Trainer 3',
  `num_salle` int(11) NOT NULL COMMENT 'Room Number',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `cycle`
--

INSERT INTO `cycle` (`id`, `num_act`, `theme`, `date_deb`, `date_fin`, `for1`, `for2`, `for3`, `num_salle`, `created_at`, `updated_at`) VALUES
(1, 'OP001', 'تطوير تطبيقات الويب الحديثة', '2024-01-15', '2024-01-20', 'أحمد محمد علي', 'فاطمة الزهراء بنت محمد', NULL, 1, '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(2, 'OP002', 'إدارة قواعد البيانات المتقدمة', '2024-01-22', '2024-01-27', 'محمد عبد الله حسن', 'عائشة بنت عمر', 'علي بن أحمد', 2, '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(3, 'OP003', 'أمن الشبكات والحماية', '2024-02-01', '2024-02-06', 'عائشة بنت عمر', 'محمد عبد الله حسن', NULL, 3, '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(4, 'OP004', 'الذكاء الاصطناعي وتعلم الآلة', '2024-02-10', '2024-02-15', 'علي بن أحمد', 'أحمد محمد علي', 'فاطمة الزهراء بنت محمد', 4, '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(5, 'OP005', 'تحليل البيانات الضخمة', '2024-03-05', '2024-03-10', 'ليلى بنت عبد الرحمن', 'ياسر بن إبراهيم', NULL, 5, '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(6, 'OP006', 'تطوير تطبيقات الهاتف', '2024-03-15', '2024-03-20', 'نورا بنت خالد', 'محمود بن علي', 'سامي بن عبد الكريم', 6, '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(7, 'OP007', 'إدارة المشاريع التقنية', '2024-04-01', '2024-04-06', 'هناء بنت محمد', 'عمر بن حسن', NULL, 7, '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(8, 'OP008', 'الحوسبة السحابية', '2024-04-10', '2024-04-15', 'رامي بن عبد الله', 'سارة بنت وليد', 'خالد بن مصطفى', 8, '2025-08-07 22:00:00', '2025-08-07 22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `formateur`
--

CREATE TABLE `formateur` (
  `id` int(11) NOT NULL,
  `nom_prenom` varchar(200) NOT NULL COMMENT 'Full Name',
  `specialite` varchar(200) NOT NULL COMMENT 'Specialty/Expertise',
  `direction` varchar(200) NOT NULL COMMENT 'Department/Unit',
  `entreprise` varchar(200) NOT NULL COMMENT 'Institution/Company',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `formateur`
--

INSERT INTO `formateur` (`id`, `nom_prenom`, `specialite`, `direction`, `entreprise`, `created_at`, `updated_at`) VALUES
(1, 'أحمد  علي', 'تطوير البرمجيات', 'وحدة التطوير', 'المركز الوطني للإعلامية', '2025-08-01 11:45:54', '2025-08-08 14:00:28'),
(2, 'فاطمة الزهراء بنت محمد', 'قواعد البيانات', 'وحدة النظم', 'المركز الوطني للإعلامية', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(3, 'محمد عبد الله حسن', 'شبكات الحاسوب', 'وحدة الشبكات', 'المركز الوطني للإعلامية', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(4, 'عائشة بنت عمر', 'الأمن السيبراني', 'وحدة الأمن', 'المركز الوطني للإعلامية', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(5, 'علي بن أحمد', 'الذكاء الاصطناعي', 'وحدة البحث', 'المركز الوطني للإعلامية', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(6, 'ليلى بنت عبد الرحمن', 'تحليل البيانات', 'وحدة التحليل', 'شركة التقنية المتقدمة', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(7, 'ياسر بن إبراهيم', 'البيانات الضخمة', 'وحدة البيانات', 'شركة التقنية المتقدمة', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(8, 'نورا بنت خالد', 'تطوير التطبيقات', 'وحدة التطوير', 'معهد التكنولوجيا', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(9, 'محمود بن علي', 'الهواتف الذكية', 'وحدة المحمول', 'معهد التكنولوجيا', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(10, 'سامي بن عبد الكريم', 'واجهات المستخدم', 'وحدة التصميم', 'معهد التكنولوجيا', '2025-08-07 22:00:00', '2025-08-07 22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `participant`
--

CREATE TABLE `participant` (
  `id` int(11) NOT NULL,
  `nom_prenom` varchar(200) NOT NULL COMMENT 'Full Name',
  `cin` varchar(50) NOT NULL COMMENT 'National ID',
  `entreprise` varchar(200) NOT NULL COMMENT 'Institution/Company',
  `tel_fix` varchar(20) DEFAULT NULL COMMENT 'Landline Phone',
  `fax` varchar(20) DEFAULT NULL COMMENT 'Fax Number',
  `tel_port` varchar(20) DEFAULT NULL COMMENT 'Mobile Phone',
  `mail` varchar(200) DEFAULT NULL COMMENT 'Email Address',
  `theme_part` varchar(500) DEFAULT NULL COMMENT 'Training Theme',
  `num_salle` int(11) DEFAULT NULL COMMENT 'Room Number',
  `date_debut` date DEFAULT NULL COMMENT 'Start Date',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `participant`
--

INSERT INTO `participant` (`id`, `nom_prenom`, `cin`, `entreprise`, `tel_fix`, `fax`, `tel_port`, `mail`, `theme_part`, `num_salle`, `date_debut`, `created_at`, `updated_at`) VALUES
(1, 'خالد بن محمد', '1234567890', 'وزارة التربية', '0123456789', '0123456790', '0612345678', 'khalid@example.com', 'تطوير تطبيقات الويب الحديثة', 1, '2024-01-15', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(2, 'سارة بنت أحمد', '0987654321', 'وزارة الصحة', '0987654321', '0987654322', '0698765432', 'sara@example.com', 'إدارة قواعد البيانات المتقدمة', 2, '2024-01-22', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(3, 'عمر بن علي', '1122334455', 'وزارة الداخلية', '1122334455', '1122334456', '0611223344', 'omar@example.com', 'أمن الشبكات والحماية', 3, '2024-02-01', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(4, 'فاطمة بنت حسن', '5566778899', 'وزارة المالية', '5566778899', '5566778900', '0655667788', 'fatima@example.com', 'الذكاء الاصطناعي وتعلم الآلة', 4, '2024-02-10', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(5, 'يوسف بن عبد الله', '2233445566', 'وزارة النقل', '2233445566', '2233445567', '0622334455', 'youssef@example.com', 'تطوير تطبيقات الويب الحديثة', 1, '2024-01-15', '2025-08-01 11:45:54', '2025-08-01 11:45:54'),
(6, 'عبد الرحمن بن يوسف', '3344556677', 'وزارة التعليم', '0334455667', '0334455668', '0633445566', 'abderrahman@example.com', 'تطوير تطبيقات الويب الحديثة', 1, '2024-01-15', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(7, 'منى بنت خالد', '4455667788', 'وزارة الصحة', '0445566778', '0445566779', '0644556677', 'mona@example.com', 'إدارة قواعد البيانات المتقدمة', 2, '2024-01-22', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(8, 'بسام بن عبد العزيز', '5566778899', 'وزارة المالية', '0556677889', '0556677890', '0655667788', 'bassam@example.com', 'أمن الشبكات والحماية', 3, '2024-02-01', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(9, 'هند بنت محمد', '6677889900', 'وزارة النقل', '0667788990', '0667788991', '0666778899', 'hind@example.com', 'الذكاء الاصطناعي وتعلم الآلة', 4, '2024-02-10', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(10, 'وليد بن أحمد', '7788990011', 'وزارة التربية', '0778899001', '0778899002', '0677889900', 'waleed@example.com', 'تحليل البيانات الضخمة', 5, '2024-03-05', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(11, 'سلمى بنت عبد الله', '8899001122', 'وزارة الصحة', '0889900112', '0889900113', '0688990011', 'salma@example.com', 'تطوير تطبيقات الهاتف', 6, '2024-03-15', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(12, 'طارق بن مصطفى', '9900112233', 'وزارة الداخلية', '0990011223', '0990011224', '0699001122', 'tariq@example.com', 'إدارة المشاريع التقنية', 7, '2024-04-01', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(13, 'نادية بنت علي', '0011223344', 'وزارة المالية', '0001122334', '0001122335', '0600112233', 'nadia@example.com', 'الحوسبة السحابية', 8, '2024-04-10', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(14, 'رامي بن عبد الحميد', '1122334455', 'وزارة التعليم', '0112233445', '0112233446', '0611223344', 'rami@example.com', 'تطوير تطبيقات الويب الحديثة', 1, '2024-01-15', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(15, 'إيمان بنت محمد', '2233445566', 'وزارة الصحة', '0223344556', '0223344557', '0622334455', 'iman@example.com', 'إدارة قواعد البيانات المتقدمة', 2, '2024-01-22', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(16, 'مازن بن خالد', '3344556677', 'وزارة الداخلية', '0334455667', '0334455668', '0633445566', 'mazen@example.com', 'أمن الشبكات والحماية', 3, '2024-02-01', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(17, 'لمياء بنت عبد الرحمن', '4455667788', 'وزارة المالية', '0445566778', '0445566779', '0644556677', 'lamia@example.com', 'الذكاء الاصطناعي وتعلم الآلة', 4, '2024-02-10', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(18, 'زياد بن محمد', '5566778899', 'وزارة النقل', '0556677889', '0556677890', '0655667788', 'ziad@example.com', 'تحليل البيانات الضخمة', 5, '2024-03-05', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(19, 'هبة بنت أحمد', '6677889900', 'وزارة التربية', '0667788990', '0667788991', '0666778899', 'heba@example.com', 'تطوير تطبيقات الهاتف', 6, '2024-03-15', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(20, 'عبد الله بن علي', '7788990011', 'وزارة الصحة', '0778899001', '0778899002', '0677889900', 'abdullah@example.com', 'إدارة المشاريع التقنية', 7, '2024-04-01', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(21, 'نور بنت خالد', '8899001122', 'وزارة الداخلية', '0889900112', '0889900113', '0688990011', 'nour@example.com', 'الحوسبة السحابية', 8, '2024-04-10', '2025-08-07 22:00:00', '2025-08-07 22:00:00'),
(22, 'ياسين محمد', '9900112235', 'وزارة المالية', '0990011223', '0990011224', '0699001122', 'medhianaffeti@gmail.com', 'تطوير تطبيقات الويب الحديثة', 4, '2024-01-15', '2025-08-07 22:00:00', '2025-08-08 13:10:05'),
(26, 'خالد بن محمد', '12121212', 'وزارة الصحة', NULL, NULL, NULL, NULL, 'أمن الشبكات والحماية', NULL, NULL, '2025-08-08 13:50:08', '2025-08-08 13:50:08'),
(27, 'خالد محمد', '121214545', 'وزارة الداخلية', NULL, NULL, NULL, NULL, 'تطوير تطبيقات الويب الحديثة', NULL, NULL, '2025-08-08 13:58:10', '2025-08-08 13:58:32');

--
-- Triggers `participant`
--
DELIMITER $$
CREATE TRIGGER `before_participant_insert` BEFORE INSERT ON `participant` FOR EACH ROW BEGIN
    -- Validate CIN format (basic validation)
    IF NEW.cin IS NULL OR LENGTH(NEW.cin) < 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'CIN must be at least 5 characters long';
    END IF;
    
    -- Validate email format (basic validation)
    IF NEW.mail IS NOT NULL AND NEW.mail NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_active_cycles`
-- (See below for the actual view)
--
CREATE TABLE `v_active_cycles` (
`id` int(11)
,`num_act` varchar(50)
,`theme` varchar(500)
,`date_deb` date
,`date_fin` date
,`for1` varchar(200)
,`for2` varchar(200)
,`for3` varchar(200)
,`num_salle` int(11)
,`days_remaining` int(8)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_participants_with_training`
-- (See below for the actual view)
--
CREATE TABLE `v_participants_with_training` (
`id` int(11)
,`nom_prenom` varchar(200)
,`cin` varchar(50)
,`entreprise` varchar(200)
,`tel_fix` varchar(20)
,`tel_port` varchar(20)
,`mail` varchar(200)
,`theme_part` varchar(500)
,`num_salle` int(11)
,`date_debut` date
,`cycle_start` date
,`cycle_end` date
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_nom` (`nom`);

--
-- Indexes for table `cycle`
--
ALTER TABLE `cycle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cycle_num_act` (`num_act`),
  ADD KEY `idx_cycle_date_deb` (`date_deb`),
  ADD KEY `idx_cycle_date_fin` (`date_fin`),
  ADD KEY `idx_cycle_theme` (`theme`);

--
-- Indexes for table `formateur`
--
ALTER TABLE `formateur`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_formateur_nom_prenom` (`nom_prenom`),
  ADD KEY `idx_formateur_specialite` (`specialite`);

--
-- Indexes for table `participant`
--
ALTER TABLE `participant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_participant_nom_prenom` (`nom_prenom`),
  ADD KEY `idx_participant_cin` (`cin`),
  ADD KEY `idx_participant_entreprise` (`entreprise`),
  ADD KEY `idx_participant_theme_part` (`theme_part`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cycle`
--
ALTER TABLE `cycle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `formateur`
--
ALTER TABLE `formateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `participant`
--
ALTER TABLE `participant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

-- --------------------------------------------------------

--
-- Structure for view `v_active_cycles`
--
DROP TABLE IF EXISTS `v_active_cycles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_active_cycles`  AS SELECT `c`.`id` AS `id`, `c`.`num_act` AS `num_act`, `c`.`theme` AS `theme`, `c`.`date_deb` AS `date_deb`, `c`.`date_fin` AS `date_fin`, `c`.`for1` AS `for1`, `c`.`for2` AS `for2`, `c`.`for3` AS `for3`, `c`.`num_salle` AS `num_salle`, to_days(`c`.`date_fin`) - to_days(curdate()) AS `days_remaining` FROM `cycle` AS `c` WHERE `c`.`date_fin` >= curdate() ORDER BY `c`.`date_deb` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_participants_with_training`
--
DROP TABLE IF EXISTS `v_participants_with_training`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_participants_with_training`  AS SELECT `p`.`id` AS `id`, `p`.`nom_prenom` AS `nom_prenom`, `p`.`cin` AS `cin`, `p`.`entreprise` AS `entreprise`, `p`.`tel_fix` AS `tel_fix`, `p`.`tel_port` AS `tel_port`, `p`.`mail` AS `mail`, `p`.`theme_part` AS `theme_part`, `p`.`num_salle` AS `num_salle`, `p`.`date_debut` AS `date_debut`, `c`.`date_deb` AS `cycle_start`, `c`.`date_fin` AS `cycle_end` FROM (`participant` `p` left join `cycle` `c` on(`p`.`theme_part` = `c`.`theme` and `p`.`num_salle` = `c`.`num_salle`)) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
