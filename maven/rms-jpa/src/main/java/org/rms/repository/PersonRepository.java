package org.rms.repository;

import java.util.List;

import org.rms.model.Person;
import org.springframework.data.repository.CrudRepository;

public interface PersonRepository extends CrudRepository<Person, Integer> {
	
	List<Person> findByFirstName(String firstName);
	
	List<Person> findByLastName(String lastName);
	
	List<Person> findByFirstNameAndLastName(String firstName, String lastName);
	
	List<Person> findByCellPhoneNumberOrHomePhoneNumberOrWorkPhoneNumberOrFaxPhoneNumber(String phoneNumber);
	
	List<Person> findByEmail(String email);

}
