package org.rms.domain;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface TicketRepository extends PagingAndSortingRepository<Ticket, Integer> {

	Ticket findByTicketNumberAndYear(String ticketNumber, Integer year);

}
