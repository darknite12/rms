package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the receipt database table.
 * 
 */
@Entity
@NamedQuery(name="Receipt.findAll", query="SELECT r FROM Receipt r")
public class Receipt implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="receipt_id")
	private int receiptId;

	private double amount;

	@Column(name="first_of_year")
	private int firstOfYear;

	@Lob
	private String info;

	@Column(name="number_of_tickets")
	private int numberOfTickets;

	@Column(name="receipt_number")
	private String receiptNumber;

	@Column(name="tax_receipt_name")
	private String taxReceiptName;

	private int year;

	//bi-directional many-to-one association to Donation
	@OneToMany(mappedBy="receipt")
	private List<Donation> donations;

	//bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy="receipt")
	private List<Ticket> tickets;

	public Receipt() {
	}

	public int getReceiptId() {
		return this.receiptId;
	}

	public void setReceiptId(int receiptId) {
		this.receiptId = receiptId;
	}

	public double getAmount() {
		return this.amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public int getFirstOfYear() {
		return this.firstOfYear;
	}

	public void setFirstOfYear(int firstOfYear) {
		this.firstOfYear = firstOfYear;
	}

	public String getInfo() {
		return this.info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public int getNumberOfTickets() {
		return this.numberOfTickets;
	}

	public void setNumberOfTickets(int numberOfTickets) {
		this.numberOfTickets = numberOfTickets;
	}

	public String getReceiptNumber() {
		return this.receiptNumber;
	}

	public void setReceiptNumber(String receiptNumber) {
		this.receiptNumber = receiptNumber;
	}

	public String getTaxReceiptName() {
		return this.taxReceiptName;
	}

	public void setTaxReceiptName(String taxReceiptName) {
		this.taxReceiptName = taxReceiptName;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public List<Donation> getDonations() {
		return this.donations;
	}

	public void setDonations(List<Donation> donations) {
		this.donations = donations;
	}

	public Donation addDonation(Donation donation) {
		getDonations().add(donation);
		donation.setReceipt(this);

		return donation;
	}

	public Donation removeDonation(Donation donation) {
		getDonations().remove(donation);
		donation.setReceipt(null);

		return donation;
	}

	public List<Ticket> getTickets() {
		return this.tickets;
	}

	public void setTickets(List<Ticket> tickets) {
		this.tickets = tickets;
	}

	public Ticket addTicket(Ticket ticket) {
		getTickets().add(ticket);
		ticket.setReceipt(this);

		return ticket;
	}

	public Ticket removeTicket(Ticket ticket) {
		getTickets().remove(ticket);
		ticket.setReceipt(null);

		return ticket;
	}

}