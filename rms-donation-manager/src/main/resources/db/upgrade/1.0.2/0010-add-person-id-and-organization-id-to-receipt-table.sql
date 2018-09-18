ALTER TABLE `receipt` ADD `person_id` int(11) NULL AFTER `receipt_id`; 
ALTER TABLE `receipt` ADD `organization_id` int(11) NULL AFTER person_id;
ALTER TABLE `receipt` ADD CONSTRAINT `fk_receipt_person` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `receipt` ADD CONSTRAINT `fk_receipt_organization` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;