package org.rms.domain;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TicketPriceRepository extends PagingAndSortingRepository<TicketPrice, Integer> {
	
	TicketPrice findByYear(@Param("year") int year);

}
