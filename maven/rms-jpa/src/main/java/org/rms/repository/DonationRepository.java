package org.rms.repository;

import java.util.List;

import org.rms.model.Donation;
import org.rms.model.Organization;
import org.rms.model.Person;
import org.springframework.data.repository.CrudRepository;

public interface DonationRepository extends CrudRepository<Donation, Integer> {
	
	List<Donation> findByPerson(Person person);
	
	List<Donation> findByPersonAndAmountGreaterThanEqual(Person person, Double amount);
	
	List<Donation> findByOrganization(Organization organization);
	
	List<Donation> findByOrganizationAndAmountGreaterThanEqual(Organization organization, Double amount);
	
	

}
