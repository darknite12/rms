package org.rms.domain;

import java.util.List;

import org.rms.domain.Donation;
import org.rms.domain.Organization;
import org.rms.domain.Person;
import org.springframework.data.repository.CrudRepository;

public interface DonationRepository extends CrudRepository<Donation, Integer> {
	
	List<Donation> findByPerson(Person person);
	
	List<Donation> findByPersonAndAmountGreaterThanEqual(Person person, Double amount);
	
	List<Donation> findByOrganization(Organization organization);
	
	List<Donation> findByOrganizationAndAmountGreaterThanEqual(Organization organization, Double amount);
	
	

}
