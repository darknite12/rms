-- MySQL Script generated by MySQL Workbench
-- 03/13/15 22:35:55
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

-- DROP DATABASE IF EXISTS rmsdb;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema rmsdb
-- -----------------------------------------------------
-- CREATE DATABASE rmsdb;
ALTER DATABASE rmsdb CHARACTER SET latin1 COLLATE latin1_swedish_ci;

USE rmsdb;

-- -----------------------------------------------------
-- Table `address`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `address` (
  `address_id` INT(11) NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `address2` VARCHAR(255) NULL DEFAULT NULL,
  `po_box` VARCHAR(20) NULL DEFAULT NULL,
  `city` VARCHAR(255) NULL DEFAULT NULL,
  `province` VARCHAR(255) NULL DEFAULT NULL,
  `postal_code` VARCHAR(20) NULL DEFAULT NULL,
  `country` VARCHAR(255) NULL DEFAULT null,
  PRIMARY KEY (`address_id`))
ENGINE = InnoDB DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `receipt`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `receipt` (
  `receipt_id` INT(11) NOT NULL AUTO_INCREMENT,
  `person_id` INT(11) NULL,
  `organization_id` INT(11) NULL,
  `receipt_number` VARCHAR(50) NULL DEFAULT NULL,
  `amount` DOUBLE NULL DEFAULT NULL,
  `year` INT(11) NULL DEFAULT NULL,
  `tax_receipt_name` VARCHAR(255) NULL DEFAULT NULL,
  `number_of_tickets` INT(11) NULL DEFAULT NULL,
  `first_of_year` INT(11) NULL DEFAULT NULL,
  `info` LONGTEXT NULL DEFAULT NULL,
  UNIQUE KEY`uc_receipt_number`(receipt_number),
  PRIMARY KEY (`receipt_id`),
  CONSTRAINT `fk_receipt_person`
    FOREIGN KEY (`person_id`)
    REFERENCES `person` (`person_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_receipt_organization`
    FOREIGN KEY (`organization_id`)
    REFERENCES `organization` (`organization_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `organization`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `organization` (
  `organization_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `is_non_profit` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`organization_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `person`
-- -----------------------------------------------------

CREATE TABLE `person` (
  `person_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `spouse` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `home_phone_number` varchar(30) DEFAULT NULL,
  `cell_phone_number` varchar(30) DEFAULT NULL,
  `work_phone_number` varchar(30) DEFAULT NULL,
  `fax_phone_number` varchar(30) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `parish` varchar(255) DEFAULT NULL,
  `community` varchar(255) DEFAULT NULL,
  `benefactor_status` varchar(255) DEFAULT NULL,
  `info` longtext,
  PRIMARY KEY (`person_id`))
ENGINE=InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `person_organization`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `person_organization` (
  `person_organization_id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  PRIMARY KEY (`person_organization_id`),
  INDEX `fk_person_organization_person_idx` (`person_id` ASC),
  INDEX `fk_person_organization_organization_idx` (`organization_id` ASC),
  CONSTRAINT `fk_person_organization_person`
    FOREIGN KEY (person_id) 
    REFERENCES `person` (`person_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_person_organization_organization` 
    FOREIGN KEY (`organization_id`) 
    REFERENCES `organization` (`organization_id`)
	ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `donation`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `donation` (
  `donation_id` INT(11) NOT NULL AUTO_INCREMENT,
  `person_id` INT(11) NULL,
  `organization_id` INT(11) NULL,
  `receipt_id` INT(11) NULL,
  `amount` DOUBLE NOT NULL,
  `year` INT(11) NOT NULL,
  `form_of_payment` VARCHAR(50) NULL DEFAULT NULL,
  `donation_in_kind` TINYINT(4) NULL DEFAULT NULL,
  `info` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`donation_id`),
  INDEX `fk_donation_receipt1_idx` (`receipt_id` ASC),
  INDEX `fk_donation_person1_idx` (`person_id` ASC),
  INDEX `fk_donation_organization1_idx` (`organization_id` ASC),
  CONSTRAINT `fk_donation_receipt1`
    FOREIGN KEY (`receipt_id`)
    REFERENCES `receipt` (`receipt_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_donation_person1`
    FOREIGN KEY (`person_id`)
    REFERENCES `person` (`person_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_donation_organization1`
    FOREIGN KEY (`organization_id`)
    REFERENCES `organization` (`organization_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `organization_address`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `organization_address` (
  `organization_address_id` INT(11) NOT NULL AUTO_INCREMENT,
  `organization_id` INT(11) NOT NULL,
  `address_id` INT(11) NOT NULL,
  PRIMARY KEY (`organization_address_id`),
  INDEX `fk_organization_address_organization1_idx` (`organization_id` ASC),
  INDEX `fk_organization_address_address1_idx` (`address_id` ASC),
  CONSTRAINT `fk_organization_address_organization1`
    FOREIGN KEY (`organization_id`)
    REFERENCES `organization` (`organization_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_organization_address_address1`
    FOREIGN KEY (`address_id`)
    REFERENCES `address` (`address_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `person_address`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `person_address` (
  `person_address_id` INT(11) NOT NULL AUTO_INCREMENT,
  `person_id` INT(11) NOT NULL,
  `address_id` INT(11) NOT NULL,
  PRIMARY KEY (`person_address_id`),
  INDEX `fk_person_address_person_idx` (`person_id` ASC),
  INDEX `fk_person_address_address1_idx` (`address_id` ASC),
  CONSTRAINT `fk_person_address_person`
    FOREIGN KEY (`person_id`)
    REFERENCES `person` (`person_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_person_address_address1`
    FOREIGN KEY (`address_id`)
    REFERENCES `address` (`address_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `ticket_price`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `ticket_price` (
  `ticket_price_id` INT(11) NOT NULL AUTO_INCREMENT,
  `price` DOUBLE NOT NULL,
  `cost` DOUBLE NOT NULL,
  PRIMARY KEY (`ticket_price_id`),
  UNIQUE KEY `ticket_price_cost_unique` (`price`,`cost`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `sitting_table`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `sitting_table` (
  `sitting_table_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `number` INT(11) NULL DEFAULT NULL,
  `event_id` INT(11) NOT NULL,
  `year` INT(11) NULL DEFAULT NULL,
  `people_per_table` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`sitting_table_id`),
  INDEX `fk_sitting_table_event_idx` (`event_id` ASC),
  CONSTRAINT `fk_sitting_table_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `event` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `event`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `event` (
  `event_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `year` INT(11) NOT NULL,
  `venue` VARCHAR(255) NULL,
  `address` VARCHAR(255) NULL,
  `masters_of_ceremony` VARCHAR(255) NULL,
  `ticket_price_id` INT(11) NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `event_ticket_price_fk` (`ticket_price_id`),
  CONSTRAINT `event_ticket_price_fk` FOREIGN KEY (`ticket_price_id`) REFERENCES `ticket_price` (`ticket_price_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` INT(11) NOT NULL AUTO_INCREMENT,
  `person_id` INT(11) NULL,
  `organization_id` INT(11) NULL,
  `receipt_id` INT(11) NULL,
  `price_of_ticket_id` INT(11) NOT NULL,
  `ticket_number` VARCHAR(20) NOT NULL,
  `year` INT(11) NOT NULL,
  `sold_by` VARCHAR(255) NULL DEFAULT NULL,
  `sitting_table_id` INT(11) NULL,
  `event_id` INT(11) NOT NULL,
  `form_of_payment` VARCHAR(50) NULL DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT 0,
  `is_at_event` tinyint(1) DEFAULT 0,
  `info` longtext,
  PRIMARY KEY (`ticket_id`),
  INDEX `fk_ticket_receipt1_idx` (`receipt_id` ASC),
  INDEX `fk_ticket_person1_idx` (`person_id` ASC),
  INDEX `fk_ticket_sitting_table1_idx` (`sitting_table_id` ASC),
  INDEX `fk_ticket_event_idx` (`event_id` ASC),
  INDEX `fk_ticket_price_of_ticket1_idx` (`price_of_ticket_id` ASC),
  INDEX `fk_ticket_organization1_idx` (`organization_id` ASC),
  CONSTRAINT `fk_ticket_receipt1`
    FOREIGN KEY (`receipt_id`)
    REFERENCES `receipt` (`receipt_id`)
    ON DELETE NO ACTION  
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_person1`
    FOREIGN KEY (`person_id`)
    REFERENCES `person` (`person_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_sitting_table1`
    FOREIGN KEY (`sitting_table_id`)
    REFERENCES `sitting_table` (`sitting_table_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `event` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_price_of_ticket1`
    FOREIGN KEY (`price_of_ticket_id`)
    REFERENCES `ticket_price` (`ticket_price_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_organization1`
    FOREIGN KEY (`organization_id`)
    REFERENCES `organization` (`organization_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
