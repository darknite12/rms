CREATE DEFINER=`root`@`localhost` PROCEDURE `rmsdbaccess`.`copypeopleaddress`()
begin
	declare done INT default false;
	declare title varchar(20);
	declare first_name varchar(255);
	declare last_name varchar(255);
	declare spouse varchar(255);
	declare contact_person varchar(255);
	declare home_phone_number varchar(30);
	declare cell_phone_number varchar(30);
	declare work_phone_number varchar(30);
	declare fax_phone_number varchar(30);
	declare email varchar(255);
	declare lang varchar(255);
	declare parish varchar(255);
	declare community varchar(255);
	declare benefactor_status varchar(255);
	declare info longtext character set utf16;
	declare address varchar(255);
	declare address2 varchar(255);
	declare po_box varchar(20);
	declare city varchar(255);
	declare province varchar(255);
	declare postal_code varchar(20);
	declare country varchar(255);
	declare persson_id int(11);
	declare address_id int(11);
	
	declare cur cursor for 	select	p.title, p.`FIRST NAME`, p.`LAST NAME`, p.spouse, CONCAT(p.`CONTACT 1`, ", ", p.`CONTACT 2`), 
									p.homephone, p.cellphone, p.workphone, p.faxno, p.`E-MAIL`, p.`Language lookup`, p.parish,
									p.community, p.benstatutes, p.info, CONCAT(p.street_no, " ", s.street), CONCAT(p.`APT NO`, p.unit), p.`P O BOX`, p.postal, s.city, s.prov, s.country
							from rmsdbaccess.people p left join rmsdbaccess.streets s on p.streets_id=s.id
							where p.`FIRST NAME` is not null
							and p.`FIRST NAME` != ''
							and p.`LAST NAME` is not null
							and p.`LAST NAME` != ''
							and p.street_no is not null
							and s.city is not null
							and s.city != '';
	declare continue HANDLER for not found SET done = true;

	open cur;
		read_loop: loop
			fetch cur INTO title, first_name, last_name, spouse, contact_person, home_phone_number, cell_phone_number, work_phone_number, fax_phone_number, email, lang, parish, community, benefactor_status, info, address, address2, po_box, postal_code, city, province, country;
			if done then
				leave read_loop;
			end if;
			-- select title, first_name, last_name;
			 insert into rmsdb.person (title, first_name, last_name, spouse, contact_person, home_phone_number, cell_phone_number, work_phone_number, fax_phone_number, email, `language`, parish, community, benefactor_status) values (title, first_name, last_name, spouse, contact_person, home_phone_number, cell_phone_number, work_phone_number, fax_phone_number, email, lang, parish, community, benefactor_status);
			 SET @person_id_var = LAST_INSERT_ID();
			 insert into rmsdb.address (address, address2, po_box, postal_code, city, province, country) values (address, address2, po_box, postal_code, city, province, country);
			 SET @address_id_var = LAST_INSERT_ID();
			 insert into rmsdb.person_address(person_id, address_id) values (@person_id_var, @address_id_var);
		end loop;
	close cur;
end