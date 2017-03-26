package org.rms.domain;

import org.rms.domain.Ticket;
import org.springframework.data.repository.CrudRepository;

public interface TicketRepository extends CrudRepository<Ticket, Integer> {
	
	Ticket findByTicketNumberAndYear(String ticketNumber, Integer year);

}
