package org.rms.domain;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface SittingTableRepository extends PagingAndSortingRepository<SittingTable, Integer> {

	SittingTable findBySittingTableNumber(@Param("sittingTableNumber") int sittingTableNumber);
	
}
