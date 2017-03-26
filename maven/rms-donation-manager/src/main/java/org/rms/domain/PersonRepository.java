package org.rms.domain;

import java.util.List;

import org.rms.domain.Person;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends CrudRepository<Person, Integer> {
	
	List<Person> findByFirstName(@Param("firstName") String firstName);
	
	
}
