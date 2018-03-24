package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends PagingAndSortingRepository<Ticket, Integer> {

	Ticket findByTicketNumber(@Param("ticketNumber") String ticketNumber);
	
	Page<Ticket> findByYear(@Param("year") Integer year, Pageable page);
	
	@Query("select t from Ticket t where t.ticketNumber like %:searchParameter%")
	Page<Ticket> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);
	
	/*or t.soldBy like %:searchParameter% or "
			+ "CONCAT(t.person.firstName, ' ', t.person.lastName) like %:searchParameter% or t.organization.name like %:searchParameter%*/
}
