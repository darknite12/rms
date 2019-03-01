ALTER TABLE `event` ADD `ticket_price_id` int(11);
ALTER TABLE `event` ADD CONSTRAINT `event_ticket_price_fk` FOREIGN KEY (`ticket_price_id`) REFERENCES `ticket_price`(`ticket_price_id`);
UPDATE `event` SET `ticket_price_id` = (select `ticket_price_id` from `ticket_price` where `price`=120 and `cost`=58 and `year`=2018);
ALTER TABLE `event` MODIFY COLUMN `ticket_price_id` int(11) NOT NULL;