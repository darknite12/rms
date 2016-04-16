package org.rms.repository;

import java.util.List;

import org.rms.model.Organization;
import org.springframework.data.repository.CrudRepository;

public interface OrganizationRepository extends CrudRepository<Organization, Integer> {
	
	List<Organization> findByNameLike(String name);

}
