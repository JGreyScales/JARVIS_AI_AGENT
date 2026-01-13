-- =========================================================
-- DATABASE
-- =========================================================
CREATE DATABASE IF NOT EXISTS JARVIS_AI_AGENT;
USE JARVIS_AI_AGENT;

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE Users (
  userID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  passwordHash CHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_name (userID, name)
) ENGINE=InnoDB;

-- =========================================================
-- FAMILIES
-- =========================================================
CREATE TABLE Families (
  familyID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  familyName VARCHAR(50) NOT NULL DEFAULT 'My Family',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- COMMANDS
-- =========================================================
CREATE TABLE Commands (
  commandID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  commandName VARCHAR(50) NOT NULL,
  commandExecution VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- GESTURE DATA (JSON instead of VECTOR)
-- =========================================================
CREATE TABLE GestureData (
  gestureDataID INT UNSIGNED PRIMARY KEY,
  landmarkData JSON NOT NULL,

  CONSTRAINT fk_gesture_command
    FOREIGN KEY (gestureDataID)
    REFERENCES Commands(commandID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- TRANSCRIPTS
-- =========================================================
CREATE TABLE Transcripts (
  transcriptID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  transcriptTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  action ENUM ('userAction','commandAction','familyAction') NOT NULL,
  actionType ENUM (
    'userUpdated','userDeleted','userCreated',
    'commandUpdated','commandDeleted','commandCreated','commandExecuted',
    'familyUpdated','familyDeleted','familyCreated'
  ) NOT NULL,

  invokerID INT UNSIGNED NOT NULL,
  familyInvokedInID INT UNSIGNED NULL,
  commandInvokedID INT UNSIGNED NULL,

  FOREIGN KEY (invokerID) REFERENCES Users(userID) ON DELETE CASCADE,
  FOREIGN KEY (familyInvokedInID) REFERENCES Families(familyID) ON DELETE SET NULL,
  FOREIGN KEY (commandInvokedID) REFERENCES Commands(commandID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================================================
-- USERS ↔ FAMILIES
-- =========================================================
CREATE TABLE UsersToFamilies (
  userID INT UNSIGNED NOT NULL,
  familyID INT UNSIGNED NOT NULL,
  PRIMARY KEY (userID, familyID),

  FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
  FOREIGN KEY (familyID) REFERENCES Families(familyID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- FAMILIES ↔ COMMANDS
-- =========================================================
CREATE TABLE FamiliesToCommand (
  familyID INT UNSIGNED NOT NULL,
  commandID INT UNSIGNED NOT NULL,
  PRIMARY KEY (familyID, commandID),

  FOREIGN KEY (familyID) REFERENCES Families(familyID) ON DELETE CASCADE,
  FOREIGN KEY (commandID) REFERENCES Commands(commandID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- MATERIALIZED SUMMARY TABLES
-- =========================================================
CREATE TABLE user_command_summary (
  userID INT UNSIGNED,
  familyID INT UNSIGNED,
  commandID INT UNSIGNED,
  commandName VARCHAR(50),
  commandExecution VARCHAR(500)
) ENGINE=InnoDB;

CREATE TABLE user_to_families (
  userID INT UNSIGNED,
  familyID INT UNSIGNED,
  familyName VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE families_to_commands (
  familyID INT UNSIGNED,
  commandID INT UNSIGNED,
  commandName VARCHAR(50),
  commandExecution VARCHAR(500)
) ENGINE=InnoDB;

-- =========================================================
-- GESTURE → COMMAND VIEW
-- =========================================================
CREATE OR REPLACE VIEW gesture_to_command AS
SELECT
  g.gestureDataID,
  g.landmarkData,
  c.commandName,
  c.commandExecution
FROM GestureData g
JOIN Commands c ON g.gestureDataID = c.commandID;

-- =========================================================
-- EVENTS
-- =========================================================
SET GLOBAL event_scheduler = ON;
DELIMITER $$

CREATE EVENT refresh_user_command_summary
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  TRUNCATE TABLE user_command_summary;
  INSERT INTO user_command_summary
  SELECT u.userID, f.familyID, c.commandID, c.commandName, c.commandExecution
  FROM Users u
  JOIN UsersToFamilies uf ON u.userID = uf.userID
  JOIN Families f ON uf.familyID = f.familyID
  JOIN FamiliesToCommand fc ON f.familyID = fc.familyID
  JOIN Commands c ON fc.commandID = c.commandID;
END$$

CREATE EVENT refresh_user_to_families
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  TRUNCATE TABLE user_to_families;
  INSERT INTO user_to_families
  SELECT u.userID, f.familyID, f.familyName
  FROM Users u
  JOIN UsersToFamilies uf ON u.userID = uf.userID
  JOIN Families f ON uf.familyID = f.familyID;
END$$

CREATE EVENT refresh_families_to_commands
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  TRUNCATE TABLE families_to_commands;
  INSERT INTO families_to_commands
  SELECT f.familyID, c.commandID, c.commandName, c.commandExecution
  FROM Families f
  JOIN FamiliesToCommand fc ON f.familyID = fc.familyID
  JOIN Commands c ON fc.commandID = c.commandID;
END$$

DELIMITER ;
