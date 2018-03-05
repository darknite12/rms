package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends PagingAndSortingRepository<Person, Integer> {

	@Query("select p from Person p where CONCAT(p.firstName, ' ', p.lastName) like %:searchParameter% or "
			+ "p.parish like %:searchParameter% or p.language like %:searchParameter% or p.workPhoneNumber like %:searchParameter% or p.cellPhoneNumber like %:searchParameter% or "
			+ "p.homePhoneNumber like %:searchParameter% or p.email like %:searchParameter% ")
	Page<Person> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);

}
