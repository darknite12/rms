package org.rms.repository;

import java.util.List;

import org.rms.model.Address;
import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
	
	List<Address> findByCity(String city);

}
