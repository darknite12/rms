package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;

import org.rms.domain.Person;
import org.rms.domain.Ticket;

import java.util.List;


/**
 * The persistent class for the organization database table.
 * 
 */
@Entity
@NamedQuery(name="Organization.findAll", query="SELECT o FROM Organization o")
public class Organization implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="organization_id")
	private int organizationId;

	private String name;

	//bi-directional many-to-one association to Donation
	@OneToMany(mappedBy="organization")
	private List<Donation> donations;

	//bi-directional many-to-many association to Address
	@ManyToMany
	@JoinTable(
		name="organization_address"
		, joinColumns={
			@JoinColumn(name="organization_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="address_id")
			}
		)
	private List<Address> addresses;

	//bi-directional many-to-many association to Person
	@ManyToMany(mappedBy="organizations")
	private List<Person> persons;


	//bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy="organization")
	private List<Ticket> tickets;

	public Organization() {
	}

	public int getOrganizationId() {
		return this.organizationId;
	}

	public void setOrganizationId(int organizationId) {
		this.organizationId = organizationId;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Donation> getDonations() {
		return this.donations;
	}

	public void setDonations(List<Donation> donations) {
		this.donations = donations;
	}

	public Donation addDonation(Donation donation) {
		getDonations().add(donation);
		donation.setOrganization(this);

		return donation;
	}

	public Donation removeDonation(Donation donation) {
		getDonations().remove(donation);
		donation.setOrganization(null);

		return donation;
	}

	public List<Address> getAddresses() {
		return this.addresses;
	}

	public void setAddresses(List<Address> addresses) {
		this.addresses = addresses;
	}

	public List<Person> getPersons() {
		return this.persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

	public List<Ticket> getTickets() {
		return this.tickets;
	}

	public void setTickets(List<Ticket> tickets) {
		this.tickets = tickets;
	}

	public Ticket addTicket(Ticket ticket) {
		getTickets().add(ticket);
		ticket.setOrganization(this);

		return ticket;
	}

	public Ticket removeTicket(Ticket ticket) {
		getTickets().remove(ticket);
		ticket.setOrganization(null);

		return ticket;
	}

}