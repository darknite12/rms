package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface SittingTableRepository extends PagingAndSortingRepository<SittingTable, Integer> {

	SittingTable findByNumber(@Param("number") Integer number);
	
	SittingTable findByNumberAndEventEventId(@Param("number") Integer number, @Param("event") Integer event);

	Page<SittingTable> findByEventEventId(@Param("event") Integer event, Pageable page);

	@Query("select st from SittingTable st where cast(st.number as string) like %:searchParameter% or "
			+ "st.name like %:searchParameter% or cast(st.year as string) like %:searchParameter% or "
			+ "st.event.name like %:searchParameter%")
	Page<SittingTable> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);

}
