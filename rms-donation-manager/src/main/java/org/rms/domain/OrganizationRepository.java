package org.rms.domain;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Integer> {

	@Query("select o from Organization o where o.name like %:searchParameter%")
	Page<Organization> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);
	
	List<Organization> findByNameLike(@Param("name") String name);

}