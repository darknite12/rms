package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends PagingAndSortingRepository<Ticket, Integer> {

	Page<Ticket> findByTicketNumber(@Param("ticketNumber") String ticketNumber, Pageable page);
	Page<Ticket> findByYear(@Param("year") Integer year, Pageable page);

}
