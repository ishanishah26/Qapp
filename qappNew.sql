-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 22, 2016 at 09:27 AM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `qappNew`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_qProvider`(IN `id` VARCHAR(255), IN `curLat` FLOAT, IN `curLong` FLOAT, IN `q_fname` VARCHAR(50), IN `q_lname` VARCHAR(50), IN `q_email` VARCHAR(100), IN `q_zip` VARCHAR(50), IN `q_mobile` VARCHAR(50))
    NO SQL
BEGIN
	DECLARE r_id varchar(255);
	DECLARE step INT;
	#DECLARE status varchar(50);
	select UUID() into r_id;
	set step := "1";
	#set status := "submitted"; 
		insert into qProvider(qId,userId,currentLat,currentLong,firstName,lastName,email,zipCode,mobile,registrationStepCompleted) values(r_id,id,curLat,curLong,q_fname,q_lname,q_email,q_zip,q_mobile,step);
		select r_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `qRequest`(IN `id` VARCHAR(255), IN `curLat` FLOAT, IN `curLong` FLOAT, IN `verb` VARCHAR(255), IN `noun` VARCHAR(255), IN `time` VARCHAR(255), IN `price` VARCHAR(255), IN `nStops` INT)
    NO SQL
BEGIN
	DECLARE r_id varchar(255);
	DECLARE tran INT;
	DECLARE status varchar(50);
	select UUID() into r_id;
	set tran := "1";
	set status := "submitted";
	insert into qRequest(qRequestId,userId,currentLat,currentLong,isTransport,requestVerb,requestNoun,qRequiredTime_Hr,qRequiredPayment,numberOfStops,requestStatus,createdDate) values(r_id,id,curLat,curLong,tran,verb,noun,time,price,nStops,status,now());
	select r_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `user_register`(IN `p_email` VARCHAR(255), IN `mobile` VARCHAR(50), IN `password` VARCHAR(50), IN `random` INT, IN `fname` VARCHAR(100), IN `lname` VARCHAR(100), IN `p_image` VARCHAR(255))
    NO SQL
BEGIN
	DECLARE status INT;
	DECLARE id INT;
	SET status = 1;
	IF EXISTS (select userId from user where email = p_email) THEN
		select 'exists' as msg;
	ELSE 
    	insert into user(userId,firstName,lastName,email,mobile,password,createdDate,passcode,userProfile,isActive) values(UUID(),fname,lname,p_email,mobile,password,now(),random,p_image,status);
		select 'insert' as msg;
	END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `qProvider`
--

CREATE TABLE IF NOT EXISTS `qProvider` (
  `qId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `currentLat` float NOT NULL,
  `currentLong` float NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `zipCode` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `isMobileVerified` tinyint(4) NOT NULL,
  `mobileVerificationCode` varchar(100) NOT NULL,
  `nameOnDL` varchar(255) NOT NULL,
  `socialSecurityNo` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `dlNo` varchar(255) NOT NULL,
  `dlState` varchar(255) NOT NULL,
  `dateOfDlExpiration` date NOT NULL,
  `highSchoolName` varchar(255) NOT NULL,
  `highSchoolCity` varchar(255) NOT NULL,
  `highSchoolState` varchar(255) NOT NULL,
  `highSchoolYOGrad` varchar(255) NOT NULL,
  `collegeInfo` varchar(255) NOT NULL,
  `totalYearOfProfExp` int(11) NOT NULL,
  `personalAssistantExp` int(11) NOT NULL,
  `roleOfQ` varchar(255) NOT NULL,
  `isStateDisclouserAcknowledged` tinyint(4) NOT NULL,
  `isBackgroundCheckAuthorized` tinyint(4) NOT NULL,
  `isQVerified` tinyint(4) NOT NULL,
  `registrationDate` datetime NOT NULL,
  `isQOnline` bigint(20) NOT NULL,
  `registrationStepCompleted` int(11) NOT NULL,
  `availableTime` time NOT NULL,
  PRIMARY KEY (`qId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `qRequest`
--

CREATE TABLE IF NOT EXISTS `qRequest` (
  `qRequestId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `currentLat` float(9,2) NOT NULL,
  `currentLong` float(9,2) NOT NULL,
  `isTransport` tinyint(4) NOT NULL,
  `requestVerb` varchar(50) NOT NULL,
  `requestNoun` varchar(50) NOT NULL,
  `qRequiredTime_Hr` varchar(25) NOT NULL,
  `qRequiredPayment` varchar(255) NOT NULL,
  `numberOfStops` int(11) NOT NULL,
  `isRequiredNow` tinyint(4) NOT NULL,
  `qRequiredDate` date NOT NULL,
  `createdDate` date NOT NULL,
  `requestStatus` varchar(25) NOT NULL,
  PRIMARY KEY (`qRequestId`),
  KEY `qrequest_ibfk_1` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qRequest`
--

INSERT INTO `qRequest` (`qRequestId`, `userId`, `currentLat`, `currentLong`, `isTransport`, `requestVerb`, `requestNoun`, `qRequiredTime_Hr`, `qRequiredPayment`, `numberOfStops`, `isRequiredNow`, `qRequiredDate`, `createdDate`, `requestStatus`) VALUES
('1810bf06-ef55-11e5-8e9e-386077c711ee', 'bac3a749-ef42-11e5-8e9e-386077c711ee', 23.46, 23.45, 0, 'arrange123456', 'party123456', '3 hrs', '$12-$20', 0, 0, '2016-03-30', '2016-03-21', 'submitted'),
('5272d389-ef50-11e5-8e9e-386077c711ee', 'bac3a749-ef42-11e5-8e9e-386077c711ee', 23.46, 23.45, 0, 'arrange12345', 'party12345', '3 hrs', '$12-$20', 0, 0, '2016-03-30', '2016-03-21', 'submitted'),
('5ca2d46e-ef51-11e5-8e9e-386077c711ee', '00c92d78-ef1b-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, 'arrange ', 'cricket', '2-3hrs', '>$300', 0, 0, '0000-00-00', '2016-03-21', 'submitted'),
('9ed07e9e-ef50-11e5-8e9e-386077c711ee', '00c92d78-ef1b-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, 'arrange', 'cars', '1-2hrs', '$100-300', 0, 0, '0000-00-00', '2016-03-21', 'submitted'),
('9f747916-ef52-11e5-8e9e-386077c711ee', '00c92d78-ef1b-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, 'test', 'somthing', '1-2hrs', '>$300', 0, 0, '0000-00-00', '2016-03-21', 'submitted'),
('acf83fc0-ef57-11e5-8e9e-386077c711ee', 'bac3a749-ef42-11e5-8e9e-386077c711ee', 23.46, 23.45, 0, '123456', '123456', '3 hrs', '$12-$20', 0, 0, '2016-03-30', '2016-03-21', 'submitted'),
('b7f131ff-ef50-11e5-8e9e-386077c711ee', '00c92d78-ef1b-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, 'arrange', 'cars', '1-2hrs', '$100-300', 0, 0, '0000-00-00', '2016-03-21', 'submitted'),
('d110d991-ef51-11e5-8e9e-386077c711ee', '00c92d78-ef1b-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, 'cleaning', 'house', '1-2hrs', '>$300', 0, 0, '0000-00-00', '2016-03-21', 'submitted');

-- --------------------------------------------------------

--
-- Table structure for table `qRequestAccept`
--

CREATE TABLE IF NOT EXISTS `qRequestAccept` (
  `qId` varchar(255) NOT NULL,
  `qRequestId` varchar(255) NOT NULL,
  `isCompleted` tinyint(4) NOT NULL,
  `isPaymentDone` tinyint(4) NOT NULL,
  `requestCompletionDateTime` datetime NOT NULL,
  `paymentDoneDateTime` datetime NOT NULL,
  `paymentDoneByRequestor` float NOT NULL,
  `paymentReceivedByQ` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reportIssue`
--

CREATE TABLE IF NOT EXISTS `reportIssue` (
  `issueDetail` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reportIssue`
--

INSERT INTO `reportIssue` (`issueDetail`, `userId`) VALUES
('There is some problem in profile update', '31ae7ea7-edb2-11e5-8168-386077c711ee'),
('error in my app', '31ae7ea7-edb2-11e5-8168-386077c711ee'),
('There is some problem in app', '31ae7ea7-edb2-11e5-8168-386077c711ee'),
('There is some psfsfsdroblem in app', '31ae7ea7-edb2-11e5-8168-386077c711ee'),
('Testing123', 'd737d99b-edbb-11e5-8168-386077c711ee'),
('This is demo ', 'c7f71d72-ef61-11e5-8e9e-386077c711ee');

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE IF NOT EXISTS `request` (
  `Qid` varchar(255) NOT NULL,
  `TotalRequestCompleted` int(11) NOT NULL,
  `TotalPaymentReceived` float(9,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stopdetail`
--

CREATE TABLE IF NOT EXISTS `stopdetail` (
  `StopDetailId` varchar(255) NOT NULL,
  `QRequestId` varchar(255) NOT NULL,
  `StopLat` float(9,2) NOT NULL,
  `StopLong` float(9,2) NOT NULL,
  `IsQReachedAtStop` tinyint(4) NOT NULL,
  `ReachedAtTime` time NOT NULL,
  `DistanceTravelled` float(9,2) NOT NULL,
  `TimeTakenForTravel` float(9,2) NOT NULL,
  PRIMARY KEY (`StopDetailId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stopdetail`
--

INSERT INTO `stopdetail` (`StopDetailId`, `QRequestId`, `StopLat`, `StopLong`, `IsQReachedAtStop`, `ReachedAtTime`, `DistanceTravelled`, `TimeTakenForTravel`) VALUES
('01e133fe-ef3c-11e5-8e9e-386077c711ee', '01d0299b-ef3c-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('01e74de7-ef3c-11e5-8e9e-386077c711ee', '01d0299b-ef3c-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('312ab691-ef2e-11e5-8e9e-386077c711ee', '311a2659-ef2e-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('3133f380-ef2e-11e5-8e9e-386077c711ee', '311a2659-ef2e-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('7820242b-ef48-11e5-8e9e-386077c711ee', '781899b6-ef48-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, '00:00:00', 0.00, 0.00),
('7825fc25-ef48-11e5-8e9e-386077c711ee', '781899b6-ef48-11e5-8e9e-386077c711ee', 21.16, 72.77, 0, '00:00:00', 0.00, 0.00),
('782c4ea3-ef48-11e5-8e9e-386077c711ee', '781899b6-ef48-11e5-8e9e-386077c711ee', 21.16, 72.79, 0, '00:00:00', 0.00, 0.00),
('8a689dc6-ef27-11e5-8e9e-386077c711ee', '8a5af9c1-ef27-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('8a6ef12d-ef27-11e5-8e9e-386077c711ee', '8a5af9c1-ef27-11e5-8e9e-386077c711ee', 23.40, 23.23, 0, '00:00:00', 0.00, 0.00),
('c1df17ec-ef47-11e5-8e9e-386077c711ee', 'c1d02449-ef47-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, '00:00:00', 0.00, 0.00),
('c1e55036-ef47-11e5-8e9e-386077c711ee', 'c1d02449-ef47-11e5-8e9e-386077c711ee', 21.19, 72.83, 0, '00:00:00', 0.00, 0.00),
('c1eba32d-ef47-11e5-8e9e-386077c711ee', 'c1d02449-ef47-11e5-8e9e-386077c711ee', 21.20, 72.84, 0, '00:00:00', 0.00, 0.00),
('e08e4cf2-ef45-11e5-8e9e-386077c711ee', 'e0865ea1-ef45-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, '00:00:00', 0.00, 0.00),
('e09651e9-ef45-11e5-8e9e-386077c711ee', 'e0865ea1-ef45-11e5-8e9e-386077c711ee', 21.15, 72.76, 0, '00:00:00', 0.00, 0.00),
('e09bf2f5-ef45-11e5-8e9e-386077c711ee', 'e0865ea1-ef45-11e5-8e9e-386077c711ee', 21.16, 72.79, 0, '00:00:00', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isEmailVerified` tinyint(4) NOT NULL COMMENT '1=verified',
  `passcode` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `isActive` tinyint(4) NOT NULL COMMENT '1=deleted',
  `userProfile` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `firstName`, `lastName`, `email`, `mobile`, `password`, `isEmailVerified`, `passcode`, `createdDate`, `isActive`, `userProfile`) VALUES
('31ae7ea7-edb2-11e5-8168-386077c711ee', 'ishani', 'shah', 'lanetteam.ishani@gmail.com', '9876543210', 'Lanet@123', 0, 123456, '2016-03-21 14:03:25', 1, 'public/images/ca689506cdf8ccedc67366c1643513fd'),
('a3529d0e-efe0-11e5-8e9e-386077c711ee', 'tapan', 'gohil', 'lanetteam.tapan@gmail.com', '9998078073', 'Lanetteam1$', 1, 311338, '2016-03-22 09:16:19', 1, 'public/static_image/user-icon.png'),
('d737d99b-edbb-11e5-8168-386077c711ee', 'yamini', 'tailor', 'lanetteam.yamini@gmail.com', '9857461230', 'Lanet@123', 1, 123456, '2016-03-21 14:03:25', 0, 'public/images/c6886c2dfa66cfddf7994c811e08ddca'),
('dd5c5368-ef29-11e5-8e9e-386077c711ee', 'Bhavin', 'Doshi', 'lanetteam.bhavin@gmail.com', '9999999999', 'Lanetteam@123', 1, 123456, '2016-03-21 14:03:25', 0, 'public/static_image/user-icon.png');

-- --------------------------------------------------------

--
-- Table structure for table `usercard`
--

CREATE TABLE IF NOT EXISTS `usercard` (
  `UserCardId` int(11) NOT NULL,
  `UserId` varchar(255) NOT NULL,
  `CardNumber` varchar(50) NOT NULL,
  `DOExpiration` datetime NOT NULL,
  `CVVNo` int(11) NOT NULL,
  `NameOnCard` varchar(50) NOT NULL,
  `IsSavedForFav` int(11) NOT NULL,
  `CardName` varchar(50) NOT NULL,
  KEY `UserId` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
