package org.rms.domain;

import java.util.List;

import org.rms.domain.Person;
import org.springframework.data.repository.CrudRepository;

public interface PersonRepository extends CrudRepository<Person, Integer> {
	
	List<Person> findByFirstName(String firstName);
	
	
}
