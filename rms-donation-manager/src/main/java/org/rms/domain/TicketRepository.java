package org.rms.domain;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends PagingAndSortingRepository<Ticket, Integer> {

	Ticket findByTicketNumber(@Param("ticketNumber") String ticketNumber);

	// Ask permission to modify this file
	Ticket findByTicketNumberAndEventEventId(@Param("ticketNumber") String ticketNumber, @Param("event") Integer event);

	Page<Ticket> findByYear(@Param("year") Integer year, Pageable page);

	Page<Ticket> findByEventEventId(@Param("event") Integer event, Pageable page);

	Page<Ticket> findByIsAtEventTrue(Pageable page);

	Page<Ticket> findByIsAtEventTrueAndEventEventId(@Param("event") Integer event, Pageable page);

	Page<Ticket> findByIsPaidTrueAndEventEventId(@Param("event") Integer event, Pageable page);

	Page<Ticket> findByIsPaidFalseAndEventEventId(@Param("event") Integer event, Pageable page);

	Page<Ticket> findByIsPaidTrueAndEventEventIdAndFormOfPaymentContaining(@Param("event") Integer event,
			@Param("formOfPayment") String formOfPayment, Pageable page);

	@Query("select t from Ticket t where t.event.eventId = :event "
			+ "and (cast(t.ticketNumber as string) like %:searchParameter% " + "or t.soldBy like %:searchParameter% "
			+ "or t.formOfPayment like %:searchParameter% " + "or t.event.name like %:searchParameter% "
			+ "or t.info like %:searchParameter% "
			+ "or t.person in (from Person p where concat(p.firstName, ' ', p.lastName) like %:searchParameter%)"
			+ "or t.organization in (from Organization o where o.name like %:searchParameter%))")
	Page<Ticket> findBySearchStringAndEvent(@Param("searchParameter") String searchParameter,
			@Param("event") Integer event, Pageable page);

	/*
	 * select t.ticket_id, first_name, p.last_name, a.address, a.address2, a.city,
	 * a.postal_code from ticket t join event e on t.event_id = e.event_id join
	 * person p on t.person_id=p.person_id join person_address pa on
	 * p.person_id=pa.person_id join address a on pa.address_id=a.address_id where
	 * t.person_id is not null and t.receipt_id is null and e.name = 'Seminary
	 * Dinner' and e.`year`=2018;
	 * 
	 */
	List<Ticket> findByPersonNotNullAndIsPaidTrueAndFormOfPaymentNotAndReceiptIsNullAndYear(String formOfPaymentNot,
			Integer year);

	List<Ticket> findByOrganizationNotNullAndIsPaidTrueAndFormOfPaymentNotAndReceiptIsNullAndYear(
			String formOfPaymentNot, Integer year);
}
