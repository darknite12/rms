package org.rms.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the ticket_price database table.
 * 
 */
@Entity
@Table(name = "ticket_price")
@NamedQuery(name = "TicketPrice.findAll", query = "SELECT t FROM TicketPrice t")
public class TicketPrice implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "ticket_price_id")
	private int ticketPriceId;

	private double cost;

	private double price;

	private int year;

	// bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy = "ticketPrice")
	private List<Ticket> tickets;

	// bi-directional many-to-one association to Event
	@OneToMany(mappedBy = "ticketPrice")
	private List<Event> events;

	public TicketPrice() {
	}

	public int getTicketPriceId() {
		return this.ticketPriceId;
	}

	public void setTicketPriceId(int ticketPriceId) {
		this.ticketPriceId = ticketPriceId;
	}

	public double getCost() {
		return this.cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public double getPrice() {
		return this.price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public List<Ticket> getTickets() {
		return this.tickets;
	}

	public void setTickets(List<Ticket> tickets) {
		this.tickets = tickets;
	}

	public Ticket addTicket(Ticket ticket) {
		getTickets().add(ticket);
		ticket.setTicketPrice(this);

		return ticket;
	}

	public Ticket removeTicket(Ticket ticket) {
		getTickets().remove(ticket);
		ticket.setTicketPrice(null);

		return ticket;
	}

	public List<Event> getEvents() {
		return this.events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}

	public Event addEvent(Event event) {
		getEvents().add(event);
		event.setTicketPrice(this);

		return event;
	}

	public Event removeEvent(Event event) {
		getEvents().remove(event);
		event.setTicketPrice(null);

		return event;
	}

}