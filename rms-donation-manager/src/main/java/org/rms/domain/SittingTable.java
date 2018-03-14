package org.rms.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the sitting_table database table.
 * 
 */
@Entity
@Table(name = "sitting_table")
@NamedQuery(name = "SittingTable.findAll", query = "SELECT s FROM SittingTable s")
public class SittingTable implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "sitting_table_id")
	private int sittingTableId;

	@Column(name = "people_per_table")
	private int peoplePerTable;

	private String name;

	private int number;

	private int year;

	// bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy = "sittingTable")
	private List<Ticket> tickets;

	// bi-directional many-to-one association to Event
	@ManyToOne
	@JoinColumn(name = "event_id")
	private Event event;

	public SittingTable() {
	}

	public int getSittingTableId() {
		return this.sittingTableId;
	}

	public void setSittingTableId(int sittingTableId) {
		this.sittingTableId = sittingTableId;
	}

	public int getPeoplePerTable() {
		return this.peoplePerTable;
	}

	public void setPeoplePerTable(int peoplePerTable) {
		this.peoplePerTable = peoplePerTable;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
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
		ticket.setSittingTable(this);

		return ticket;
	}

	public Ticket removeTicket(Ticket ticket) {
		getTickets().remove(ticket);
		ticket.setSittingTable(null);

		return ticket;
	}

}