package org.rms.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;

/**
 * The persistent class for the event database table.
 * 
 */
@Entity
@NamedQuery(name = "Event.findAll", query = "SELECT e FROM Event e")
public class Event implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "event_id")
	private int eventId;

	private String venue;

	@Column(name = "masters_of_ceremony")
	private String mastersOfCeremony;

	private String name;

	private int year;

	private String address;

	// bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy = "event")
	private List<Ticket> tickets;

	// bi-directional many-to-one association to Sitting Table
	@OneToMany(mappedBy = "event")
	private List<SittingTable> sittingTables;

	public Event() {
	}

	public int getEventId() {
		return this.eventId;
	}

	public void setEventId(int eventId) {
		this.eventId = eventId;
	}

	public String getVenue() {
		return venue;
	}

	public void setVenue(String venue) {
		this.venue = venue;
	}

	public String getMastersOfCeremony() {
		return this.mastersOfCeremony;
	}

	public void setMastersOfCeremony(String mastersOfCeremony) {
		this.mastersOfCeremony = mastersOfCeremony;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public List<Ticket> getTickets() {
		return tickets;
	}

	public void setTickets(List<Ticket> tickets) {
		this.tickets = tickets;
	}

	public List<SittingTable> getSittingTables() {
		return sittingTables;
	}

	public void setSittingTables(List<SittingTable> sittingTables) {
		this.sittingTables = sittingTables;
	}

}