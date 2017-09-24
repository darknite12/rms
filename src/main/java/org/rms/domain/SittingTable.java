package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the sitting_table database table.
 * 
 */
@Entity
@Table(name="sitting_table")
@NamedQuery(name="SittingTable.findAll", query="SELECT s FROM SittingTable s")
public class SittingTable implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="sitting_table_id")
	private int sittingTableId;

	@Column(name="people_per_table")
	private int peoplePerTable;

	@Column(name="sitting_table_name")
	private String sittingTableName;

	@Column(name="sitting_table_number")
	private int sittingTableNumber;

	private int year;

	//bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy="sittingTable")
	private List<Ticket> tickets;

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

	public String getSittingTableName() {
		return this.sittingTableName;
	}

	public void setSittingTableName(String sittingTableName) {
		this.sittingTableName = sittingTableName;
	}

	public int getSittingTableNumber() {
		return this.sittingTableNumber;
	}

	public void setSittingTableNumber(int sittingTableNumber) {
		this.sittingTableNumber = sittingTableNumber;
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