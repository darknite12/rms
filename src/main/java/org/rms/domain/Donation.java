package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the donation database table.
 * 
 */
@Entity
@NamedQuery(name="Donation.findAll", query="SELECT d FROM Donation d")
public class Donation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="donation_id")
	private int donationId;

	private double amount;

	@Column(name="donation_in_kind")
	private byte donationInKind;

	@Column(name="form_of_payment")
	private String formOfPayment;

	@Lob
	private String info;

	private int year;

	//bi-directional many-to-one association to Organization
	@ManyToOne
	@JoinColumn(name="organization_id")
	private Organization organization;

	//bi-directional many-to-one association to Person
	@ManyToOne
	@JoinColumn(name="person_id")
	private Person person;

	//bi-directional many-to-one association to Receipt
	@ManyToOne
	@JoinColumn(name="receipt_id")
	private Receipt receipt;

	public Donation() {
	}

	public int getDonationId() {
		return this.donationId;
	}

	public void setDonationId(int donationId) {
		this.donationId = donationId;
	}

	public double getAmount() {
		return this.amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public byte getDonationInKind() {
		return this.donationInKind;
	}

	public void setDonationInKind(byte donationInKind) {
		this.donationInKind = donationInKind;
	}

	public String getFormOfPayment() {
		return this.formOfPayment;
	}

	public void setFormOfPayment(String formOfPayment) {
		this.formOfPayment = formOfPayment;
	}

	public String getInfo() {
		return this.info;
	}

	public void setInfo(String info) {
		this.info = info;
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

	public Receipt getReceipt() {
		return this.receipt;
	}

	public void setReceipt(Receipt receipt) {
		this.receipt = receipt;
	}

}