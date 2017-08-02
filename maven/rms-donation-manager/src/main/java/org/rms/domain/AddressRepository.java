package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface AddressRepository extends PagingAndSortingRepository<Address, Integer> {

	List<Address> findByAddress(@Param("address") String address);

	List<Address> findByCity(@Param("city") String city);

	List<Address> findByPostalCode(@Param("postalCode") String postalCode);

	List<Address> findByAddressAndCity(@Param("address") String address, @Param("city") String city);

	List<Address> findByAddressAndCityAndPostalCode(@Param("address") String address, @Param("city") String city,
			@Param("postalCode") String postalCode);

}