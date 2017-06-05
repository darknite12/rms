package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface AddressRepository extends PagingAndSortingRepository<Address, Integer> {

	List<Address> findByCity(String city);

}
