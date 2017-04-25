package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the ticket database table.
 * 
 */
@Entity
@NamedQuery(name="Ticket.findAll", query="SELECT t FROM Ticket t")
public class Ticket implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="ticket_id")
	private int ticketId;

	@Column(name="sold_by")
	private String soldBy;

	@Column(name="ticket_number")
	private String ticketNumber;

	private int year;

	//bi-directional many-to-one association to Organization
	@ManyToOne
	@JoinColumn(name="organization_id")
	private Organization organization;

	//bi-directional many-to-one association to Person
	@ManyToOne
	@JoinColumn(name="person_id")
	private Person person;

	//bi-directional many-to-one association to TicketPrice
	@ManyToOne
	@JoinColumn(name="price_of_ticket_id")
	private TicketPrice ticketPrice;

	//bi-directional many-to-one association to Receipt
	@ManyToOne
	@JoinColumn(name="receipt_id")
	private Receipt receipt;

	//bi-directional many-to-one association to SittingTable
	@ManyToOne
	@JoinColumn(name="sitting_table_id")
	private SittingTable sittingTable;

	public Ticket() {
	}

	public int getTicketId() {
		return this.ticketId;
	}

	public void setTicketId(int ticketId) {
		this.ticketId = ticketId;
	}

	public String getSoldBy() {
		return this.soldBy;
	}

	public void setSoldBy(String soldBy) {
		this.soldBy = soldBy;
	}

	public String getTicketNumber() {
		return this.ticketNumber;
	}

	public void setTicketNumber(String ticketNumber) {
		this.ticketNumber = ticketNumber;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public Organization getOrganization() {
		return this.organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	public TicketPrice getTicketPrice() {
		return this.ticketPrice;
	}

	public void setTicketPrice(TicketPrice ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

	public Receipt getReceipt() {
		return this.receipt;
	}

	public void setReceipt(Receipt receipt) {
		this.receipt = receipt;
	}

	public SittingTable getSittingTable() {
		return this.sittingTable;
	}

	public void setSittingTable(SittingTable sittingTable) {
		this.sittingTable = sittingTable;
	}

}