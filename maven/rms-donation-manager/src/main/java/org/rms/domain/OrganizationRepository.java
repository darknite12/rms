package org.rms.domain;

import java.util.List;

import org.rms.domain.Organization;
import org.springframework.data.repository.CrudRepository;

public interface OrganizationRepository extends CrudRepository<Organization, Integer> {
	
	List<Organization> findByNameLike(String name);

}
