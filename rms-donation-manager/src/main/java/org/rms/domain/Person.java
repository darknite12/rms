package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;

import java.util.List;


/**
 * The persistent class for the person database table.
 * 
 */
@Entity
@NamedQuery(name="Person.findAll", query="SELECT p FROM Person p")
public class Person implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="person_id")
	private int personId;

	@Column(name="benefactor_status")
	private String benefactorStatus;

	@Column(name="cell_phone_number")
	private String cellPhoneNumber;

	private String community;

	@Column(name="contact_person")
	private String contactPerson;

	private String email;

	@Column(name="fax_phone_number")
	private String faxPhoneNumber;

	@Column(name="first_name")
	private String firstName;

	@Column(name="home_phone_number")
	private String homePhoneNumber;

	@Lob
	private String info;

	private String language;

	@Column(name="last_name")
	private String lastName;

	private String parish;

	private String spouse;

	private String title;

	@Column(name="work_phone_number")
	private String workPhoneNumber;

	//bi-directional many-to-one association to Donation
	@OneToMany(mappedBy="person")
	private List<Donation> donations;

	//bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy="person")
	private List<Ticket> tickets;
	
	//bi-directional many-to-one association to Ticket
	@OneToMany(mappedBy="person")
	private List<Receipt> receipts;
	
	//bi-directional many-to-many association to Address
	@ManyToMany
	@JoinTable(
		name="person_address"
		, joinColumns={
			@JoinColumn(name="person_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="address_id")
			}
		)
	private List<Address> addresses;

	//bi-directional many-to-many association to Organization
	@ManyToMany
	@JoinTable(
		name="person_organization"
		, joinColumns={
			@JoinColumn(name="person_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="organization_id")
			}
		)
	private List<Organization> organizations;

	public Person() {
	}

	public int getPersonId() {
		return this.personId;
	}

	public void setPersonId(int personId) {
		this.personId = personId;
	}

	public String getBenefactorStatus() {
		return this.benefactorStatus;
	}

	public void setBenefactorStatus(String benefactorStatus) {
		this.benefactorStatus = benefactorStatus;
	}

	public String getCellPhoneNumber() {
		return this.cellPhoneNumber;
	}

	public void setCellPhoneNumber(String cellPhoneNumber) {
		this.cellPhoneNumber = cellPhoneNumber;
	}

	public String getCommunity() {
		return this.community;
	}

	public void setCommunity(String community) {
		this.community = community;
	}

	public String getContactPerson() {
		return this.contactPerson;
	}

	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFaxPhoneNumber() {
		return this.faxPhoneNumber;
	}

	public void setFaxPhoneNumber(String faxPhoneNumber) {
		this.faxPhoneNumber = faxPhoneNumber;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getHomePhoneNumber() {
		return this.homePhoneNumber;
	}

	public void setHomePhoneNumber(String homePhoneNumber) {
		this.homePhoneNumber = homePhoneNumber;
	}

	public String getInfo() {
		return this.info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getLanguage() {
		return this.language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getParish() {
		return this.parish;
	}

	public void setParish(String parish) {
		this.parish = parish;
	}

	public String getSpouse() {
		return this.spouse;
	}

	public void setSpouse(String spouse) {
		this.spouse = spouse;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getWorkPhoneNumber() {
		return this.workPhoneNumber;
	}

	public void setWorkPhoneNumber(String workPhoneNumber) {
		this.workPhoneNumber = workPhoneNumber;
	}

	public List<Donation> getDonations() {
		return this.donations;
	}

	public void setDonations(List<Donation> donations) {
		this.donations = donations;
	}

	public Donation addDonation(Donation donation) {
		getDonations().add(donation);
		donation.setPerson(this);

		return donation;
	}

	public Donation removeDonation(Donation donation) {
		getDonations().remove(donation);
		donation.setPerson(null);

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
		ticket.setPerson(this);

		return ticket;
	}

	public Ticket removeTicket(Ticket ticket) {
		getTickets().remove(ticket);
		ticket.setPerson(null);

		return ticket;
	}
	
	public List<Receipt> getReceipts() {
		return this.receipts;
	}

	public void setReceipts(List<Receipt> receipts) {
		this.receipts = receipts;
	}

	public Receipt addReceipt(Receipt receipt) {
		getReceipts().add(receipt);
		receipt.setPerson(this);

		return receipt;
	}

	public Receipt removeReceipt(Receipt receipt) {
		getReceipts().remove(receipt);
		receipt.setPerson(null);

		return receipt;
	}

	public List<Address> getAddresses() {
		return this.addresses;
	}

	public void setAddresses(List<Address> addresses) {
		this.addresses = addresses;
	}

	public List<Organization> getOrganizations() {
		return this.organizations;
	}

	public void setOrganizations(List<Organization> organizations) {
		this.organizations = organizations;
	}

}