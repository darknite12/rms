package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface PersonRepository extends PagingAndSortingRepository<Person, Integer> {

	List<Person> findByFirstName(@Param("firstName") String firstName);

}
