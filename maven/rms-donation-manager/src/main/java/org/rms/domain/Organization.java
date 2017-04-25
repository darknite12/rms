package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;
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

	//bi-directional many-to-one association to OrganizationAddress
	@OneToMany(mappedBy="organization")
	private List<OrganizationAddress> organizationAddresses;

	//bi-directional many-to-one association to PersonOrganization
	@OneToMany(mappedBy="organization")
	private List<PersonOrganization> personOrganizations;

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

	public List<OrganizationAddress> getOrganizationAddresses() {
		return this.organizationAddresses;
	}

	public void setOrganizationAddresses(List<OrganizationAddress> organizationAddresses) {
		this.organizationAddresses = organizationAddresses;
	}

	public OrganizationAddress addOrganizationAddress(OrganizationAddress organizationAddress) {
		getOrganizationAddresses().add(organizationAddress);
		organizationAddress.setOrganization(this);

		return organizationAddress;
	}

	public OrganizationAddress removeOrganizationAddress(OrganizationAddress organizationAddress) {
		getOrganizationAddresses().remove(organizationAddress);
		organizationAddress.setOrganization(null);

		return organizationAddress;
	}

	public List<PersonOrganization> getPersonOrganizations() {
		return this.personOrganizations;
	}

	public void setPersonOrganizations(List<PersonOrganization> personOrganizations) {
		this.personOrganizations = personOrganizations;
	}

	public PersonOrganization addPersonOrganization(PersonOrganization personOrganization) {
		getPersonOrganizations().add(personOrganization);
		personOrganization.setOrganization(this);

		return personOrganization;
	}

	public PersonOrganization removePersonOrganization(PersonOrganization personOrganization) {
		getPersonOrganizations().remove(personOrganization);
		personOrganization.setOrganization(null);

		return personOrganization;
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