package org.rms.domain;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TestEntityManager {

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private PersonRepository personRepository;

	@Autowired
	private TicketRepository ticketRepository;

	@Autowired
	private TicketPriceRepository ticketPriceRepository;

	public Person createPerson(String title, String firstName, String lastName, String language, String cellPhoneNumber,
			String homePhoneNumber, String workPhoneNumber, String faxPhoneNumber, String email,
			List<Address> addresses, String spouse, String contactPerson, String parish, String community,
			String benefactorStatus, List<Organization> organizations, List<Ticket> tickets, List<Donation> donations,
			List<Receipt> receipts, String info) {
		Person person = new Person();
		person.setTitle(title);
		person.setFirstName(firstName);
		person.setLastName(lastName);
		person.setLanguage(language);
		person.setCellPhoneNumber(cellPhoneNumber);
		person.setHomePhoneNumber(homePhoneNumber);
		person.setWorkPhoneNumber(workPhoneNumber);
		person.setFaxPhoneNumber(faxPhoneNumber);
		person.setEmail(email);
		person.setAddresses(addresses);
		person.setSpouse(spouse);
		person.setContactPerson(contactPerson);
		person.setParish(parish);
		person.setCommunity(community);
		person.setBenefactorStatus(benefactorStatus);
		person.setOrganizations(organizations);
		person.setTickets(tickets);
		person.setDonations(donations);
		person.setReceipts(receipts);
		person.setInfo(info);
		return personRepository.save(person);
	}

	public Organization createOrganization(String name, List<Person> persons, List<Address> addresses,
			List<Ticket> tickets, List<Donation> donations, List<Receipt> receipts) {
		Organization organization = new Organization();
		organization.setName(name);
		organization.setPersons(persons);
		organization.setAddresses(addresses);
		organization.setTickets(tickets);
		organization.setDonations(donations);
		organization.setReceipts(receipts);
		return organizationRepository.save(organization);
	}

	public Address createAddress(String address1, String address2, String city, String province, String country,
			String postalCode, String poBox, List<Person> persons, List<Organization> organizations) {
		Address address = new Address();
		address.setAddress(address1);
		address.setAddress2(address2);
		address.setCity(city);
		address.setProvince(province);
		address.setPostalCode(postalCode);
		address.setPoBox(poBox);
		address.setCountry(country);
		address.setPersons(persons);
		address.setOrganizations(organizations);
		return addressRepository.save(address);
	}

	public Ticket createTicket(Person person, Organization organization, TicketPrice ticketPrice, Receipt receipt,
			SittingTable sittingTable, Event event, String soldBy, String ticketNumber, int year, String formOfPayment,
			boolean isPaid, boolean isAtEvent, String info) {
		Ticket ticket = new Ticket();
		ticket.setSoldBy(soldBy);
		ticket.setTicketNumber(ticketNumber);
		ticket.setYear(year);
		ticket.setOrganization(organization);
		ticket.setPerson(person);
		ticket.setTicketPrice(ticketPrice);
		ticket.setReceipt(receipt);
		ticket.setSittingTable(sittingTable);
		ticket.setEvent(event);
		ticket.setFormOfPayment(formOfPayment);
		ticket.setPaid(isPaid);
		ticket.setAtEvent(isAtEvent);
		ticket.setInfo(info);
		return ticketRepository.save(ticket);

	}

	public TicketPrice createTicketPrice(int year, double cost, double price, List<Ticket> tickets) {
		TicketPrice ticketPrice = new TicketPrice();
		ticketPrice.setCost(cost);
		ticketPrice.setPrice(price);
		ticketPrice.setTickets(tickets);
		ticketPrice.setYear(year);
		return ticketPriceRepository.save(ticketPrice);
	}

	public Event createEvent(String name, String venue, String address, String mastersOfCeremony, int year,
			List<Ticket> tickets, List<SittingTable> sittingTables) {
		Event event = new Event();
		event.setName(name);
		event.setVenue(venue);
		event.setAddress(address);
		event.setMastersOfCeremony(mastersOfCeremony);
		event.setYear(year);
		event.setTickets(tickets);
		event.setSittingTables(sittingTables);
		return eventRepository.save(event);
	}
}
