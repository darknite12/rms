package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Integer> {

	List<Organization> findByNameLike(@Param("name") String name);

}