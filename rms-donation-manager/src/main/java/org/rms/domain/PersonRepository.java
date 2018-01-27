package org.rms.domain;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends PagingAndSortingRepository<Person, Integer> {

	List<Person> findByFirstName(@Param("firstName") String firstName);

	List<Person> findByLastName(@Param("lastName") String lastName);

	List<Person> findByFirstNameAndLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);

	List<Person> findByEmail(@Param("email") String email);

	List<Person> findByCellPhoneNumber(@Param("cellPhoneNumber") String cellPhoneNumber);

	List<Person> findByHomePhoneNumber(@Param("homePhoneNumber") String homePhoneNumber);

	@Query("select p from Person p where p.firstName like %:searchParameter% or p.lastName like %:searchParameter% or "
			+ "p.parish like %:searchParameter% or p.language like %:searchParameter% or p.workPhoneNumber like %:searchParameter% or "
			+ "p.cellPhoneNumber like %:searchParameter% or p.homePhoneNumber like %:searchParameter% or p.email like %:searchParameter% ")
	Page<Person> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);

}
