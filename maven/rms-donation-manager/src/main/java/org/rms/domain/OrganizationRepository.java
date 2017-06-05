package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Integer> {

	List<Organization> findByNameLike(String name);

}