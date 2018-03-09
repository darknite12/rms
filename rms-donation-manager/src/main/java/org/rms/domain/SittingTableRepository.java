package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface SittingTableRepository extends PagingAndSortingRepository<SittingTable, Integer> {

	SittingTable findBySittingTableNumber(@Param("sittingTableNumber") int sittingTableNumber);
	
	@Query("select st from SittingTable st where st.sittingTableNumber like %:searchParameter% or "
			+ "st.sittingTableName like %:searchParameter% or st.year like %:searchParameter% or st.peoplePerTable like %:searchParameter%")
	Page<SittingTable> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);
	
}
