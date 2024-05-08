-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2024 at 05:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatapp_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_ADD_CLIENT` (`pUserID` INT, `pClientNo` VARCHAR(50))   BEGIN
	INSERT INTO clients (user_id, client_number) VALUES (pUserID, pClientNo);
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_ADD_MSG` (`pClientID` INT, `pMessage` TEXT, `pUsertype` VARCHAR(45))   BEGIN

	INSERT INTO chats (client_id, message, usertype) VALUES (pClientID, pMessage, pUsertype);

END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_ADD_ROLE` (IN `pRoleName` VARCHAR(100))   BEGIN

    INSERT INTO role (name)
    VALUES (pRoleName);

END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_ADD_USER` (`pRoleID` INT, `pName` VARCHAR(100), `pEmail` VARCHAR(200), `pPassword` VARCHAR(255), `pStatus` TINYINT)   BEGIN

	INSERT INTO users (role_id, name, email, password, status)
    VALUES (pRoleID, pName, pEmail, pPassword, pStatus);
    
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_DELETE_CLIENT` (IN `pid` INT)   BEGIN
    DELETE FROM clients WHERE id = pid;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_DELETE_ROLE` (IN `pRoleId` INT)   BEGIN
    DELETE FROM role WHERE id = pRoleId;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_DELETE_USER` (IN `pUserId` INT)   BEGIN
    DELETE FROM users WHERE id = pUserId;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_EDIT_CLIENT` (IN `pid` INT, IN `pClient_Name` VARCHAR(100), IN `PClient_Email` VARCHAR(100))   BEGIN
    UPDATE clients
    SET client_name = pClient_Name, client_email = pClient_Email
    where id = pid;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_EDIT_ROLE` (IN `pRoleId` INT, IN `pRoleName` VARCHAR(100))   BEGIN
    UPDATE role
    SET name = pRoleName
    WHERE id = pRoleId;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_EDIT_USER` (IN `pid` INT, IN `pRoleID` INT, IN `pName` VARCHAR(100), IN `pEmail` VARCHAR(100), IN `pPassword` VARCHAR(100), IN `pStatus` TINYINT)   BEGIN
	UPDATE users
    SET role_id = pRoleID, name = pName, email = pEmail, password = pPassword, status = pStatus
    WHERE id = pid;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_ADMIN_USER` (`pUserID` INT)   BEGIN
	SELECT * FROM users WHERE id != pUserID;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_ALL_CLIENTS_BY_USERID` (`pUserID` INT)   BEGIN

	SELECT * FROM clients WHERE user_id = pUserID;

END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_CHAT_BY_CLIENT_ID` (`pClientID` INT)   BEGIN
	SELECT * FROM chats WHERE client_id = pClientID;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_CLIENT` ()   BEGIN
	SELECT * FROM clients;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_CLIENT_BY_NUMBER` (`pClientNo` VARCHAR(50))   BEGIN
	SELECT * FROM clients WHERE client_number = pClientNo;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_ROLE` ()   BEGIN
	
    SELECT * FROM role;
 
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_TEAM_LEAD_USER` (`pUserID` INT)   BEGIN
SELECT * FROM users WHERE id != 1 AND id != pUserID;
END$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_USER` ()   SELECT U.*, R.name AS RoleName FROM users AS U
JOIN role AS R ON U.role_id = R.id$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_SELECT_USER_LOGIN` (IN `pEmail` VARCHAR(200))   SELECT * FROM users WHERE email = pEmail AND status = 1$$

CREATE DEFINER=`quadqdov`@`localhost` PROCEDURE `SP_UPDATE_CLIENT_USERID` (`pUserID` INT, `pClientID` INT)   BEGIN

 UPDATE clients SET user_id=pUserID WHERE id = pClientID;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `usertype` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `client_number` varchar(50) NOT NULL,
  `client_name` varchar(100) NOT NULL,
  `client_email` varchar(100) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `created_at`) VALUES
(1, 'admin', '2024-03-05 18:59:44'),
(2, 'Team lead', '2024-03-08 21:12:54'),
(3, 'Agent1', '2024-03-08 21:13:08'),
(4, 'Agent2', '2024-03-08 21:13:28'),
(5, 'Agent3', '2024-03-12 04:15:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(250) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `password`, `status`, `created_at`) VALUES
(1, 1, 'admin', 'admin@gmail.com', '$2b$10$wWIJFe7TMA/bd2/KXm7N/OtfLsMH95rf9a1lr2jF7zcgaWabc4QN.', 1, '2024-03-08 21:16:17'),
(2, 2, 'Team Lead', 'leader@gmail.com', '$2b$10$WZ3j/SN7JNxR8g/mJpwnFunDHu2iZmPktfLL4yAxPzOfkux.ab9Je', 1, '2024-03-08 21:16:59'),
(3, 3, 'Agent1', 'agent1@gmail.com', '$2b$10$LkazchrhO9eDjeyAviCUluo51g9bkYo7F5c2OASDc1GA.XVdQbgV2', 1, '2024-03-23 18:26:21'),
(4, 4, 'Agent2', 'agent2@gmail.com', '$2b$10$.Fd0d1VLxDBgWQrWp/Etlu8VKThRndGuYNub/f7HmkZc/fsbP0l3.', 1, '2024-03-23 18:26:15'),
(5, 5, 'Agent3', 'agent3@gmail.com', '$2b$10$mcRb1oPMzFx9gJQqr/WhJOm0njunLHryLiho8qLkaLb28gjBLtmP6', 1, '2024-03-23 17:58:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
