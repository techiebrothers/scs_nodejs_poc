-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 07, 2022 at 05:08 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_demo`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(55) NOT NULL,
  `role` varchar(55) NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `phone` varchar(55) NOT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `status` enum('active','inactive','deleted') NOT NULL,
  `reset_request` tinyint(4) NOT NULL DEFAULT 1,
  `reset_token` varchar(255) NOT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `login_ipaddress` varchar(55) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `first_name`, `last_name`, `email`, `role`, `password`, `phone`, `profile_picture`, `status`, `reset_request`, `reset_token`, `last_login_date`, `login_ipaddress`, `created_by`, `created_date`, `updated_by`, `updated_date`) VALUES
(1, 'User1 a', 'User1', 'a', 'user1@gmail.com', 'user', '$2b$10$6CBQWXJJsl9.VGcuWAHohOXwLeCQn5Z3xPQamWMc6R30QiI1onI.m', '', '', 'active', 1, '', '2022-06-07 14:58:11', '::1', 0, '2022-06-07 14:58:06', 0, '2022-06-07 14:58:06'),
(2, 'User2 a', 'User2', 'a', 'user2@gmail.com', 'user', '$2b$10$4oxk3cSRUDSaYyUJKcAzk.Cpm6V4HxK0m/diHMWxiOHiYpBXdLN.m', '', '', 'active', 1, '', '2022-06-07 14:58:40', '::1', 0, '2022-06-07 14:58:35', 0, '2022-06-07 14:58:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
