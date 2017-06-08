package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends PagingAndSortingRepository<Person, Integer> {

	List<Person> findByFirstName(@Param("firstName") String firstName);

	List<Person> findByLastName(@Param("lastName") String lastName);

	List<Person> findByFirstNameAndLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);

	List<Person> findByEmail(@Param("email") String email);

	List<Person> findByCellPhoneNumber(@Param("cellPhoneNumber") String cellPhoneNumber);

	List<Person> findByHomePhoneNumber(@Param("homePhoneNumber") String homePhoneNumber);

}
