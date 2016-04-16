package org.rms.repository;

import org.rms.model.Ticket;
import org.springframework.data.repository.CrudRepository;

public interface TicketRepository extends CrudRepository<Ticket, Integer> {
	
	Ticket findByTicketNumberAndYear(String ticketNumber, Integer year);

}
