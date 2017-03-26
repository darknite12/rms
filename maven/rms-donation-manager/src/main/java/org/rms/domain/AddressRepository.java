package org.rms.domain;

import java.util.List;

import org.rms.domain.Address;
import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
	
	List<Address> findByCity(String city);

}
