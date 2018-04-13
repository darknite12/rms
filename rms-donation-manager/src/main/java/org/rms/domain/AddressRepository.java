package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface AddressRepository extends PagingAndSortingRepository<Address, Integer> {

	Page<Address> findByAddress(@Param("address") String address, Pageable page);

	@Query("select a from Address a where a.address like %:searchParameter% or "
			+ "a.city like %:searchParameter% or a.postalCode like %:searchParameter% or "
			+ "a.province like %:searchParameter% or a.country like %:searchParameter% ")
	Page<Address> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);

}
