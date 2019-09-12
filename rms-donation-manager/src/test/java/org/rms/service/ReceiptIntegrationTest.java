package org.rms.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.rms.RMSApplication;
import org.rms.domain.Address;
import org.rms.domain.Event;
import org.rms.domain.Organization;
import org.rms.domain.OrganizationRepository;
import org.rms.domain.Person;
import org.rms.domain.PersonRepository;
import org.rms.domain.Receipt;
import org.rms.domain.ReceiptRepository;
import org.rms.domain.TestEntityManager;
import org.rms.domain.Ticket;
import org.rms.domain.TicketPrice;
import org.rms.web.GenerateReceiptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = RMSApplication.class)
@Transactional
public class ReceiptIntegrationTest {

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private ReceiptRepository receiptRepository;

	@Autowired
	private PersonRepository personRepository;

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private TestEntityManager em;

	private TicketPrice ticketPrice;

	private Event event;

	@Before
	public void setup() {
		if (ticketPrice == null) {
			ticketPrice = em.createTicketPrice(55.00, 120.00, null);
		}

		if (event == null) {
			event = em.createEvent("event1", "venue1", "event venue address1", "mc1", 2018, null, null);
		}

	}

	@Test
	public void given_multiple_ticket_without_receipts_when_generateReceipts_for_the_first_time_then_receipts_are_created() {

		// Given One person with two tickers, One person with one ticket and One
		// Organization with 3 tickets

		// Person 1
		Address address1 = em.createAddress("address1", null, "city1", "province1", "country1", "postalCode1", null,
				null, null);
		List<Address> addresses1 = new ArrayList<Address>();
		addresses1.add(address1);
		Person person1 = em.createPerson(null, "firstName1", "lastName1", "English", null, null, null, null, null,
				addresses1, null, null, "Parish1", "Community1", null, null, null, null, null, null);
		Ticket ticket1 = em.createTicket(person1, null, ticketPrice, null, null, event, "Sold By Person1", "1000", 2018,
				"Cash", true, true, null);
		Ticket ticket2 = em.createTicket(person1, null, ticketPrice, null, null, event, "Sold By Person1", "1001", 2018,
				"Cash", true, true, null);
		person1.addTicket(ticket1);
		person1.addTicket(ticket2);

		// Person 2
		Address address2 = em.createAddress("address2", null, "city2", "province2", "country1", "postalCode2", null,
				null, null);
		List<Address> addresses2 = new ArrayList<Address>();
		addresses2.add(address2);
		Person person2 = em.createPerson(null, "firstName2", "lastName2", "English", null, null, null, null, null,
				addresses2, null, null, "parish2", "Community2", null, null, null, null, null, null);
		Ticket ticket3 = em.createTicket(person2, null, ticketPrice, null, null, event, "Sold By Person2", "1002", 2018,
				"Cash", true, true, null);
		person2.addTicket(ticket3);

		// Organization 1
		Address address3 = em.createAddress("address3", null, "city3", "province3", "country1", "postalCode3", null,
				null, null);
		List<Address> addresses3 = new ArrayList<Address>();
		addresses3.add(address3);

		Organization organization1 = em.createOrganization("Organization1", null, addresses3, null, null, null);

		Ticket ticket4 = em.createTicket(null, organization1, ticketPrice, null, null, event, "Sold By Person 1",
				"1003", 2018, "Cash", true, true, null);
		Ticket ticket5 = em.createTicket(null, organization1, ticketPrice, null, null, event, "Sold By Person 1",
				"1004", 2018, "Cash", true, true, null);
		Ticket ticket6 = em.createTicket(null, organization1, ticketPrice, null, null, event, "Sold By Person 1",
				"1005", 2018, "Cash", true, true, null);
		organization1.addTicket(ticket4);
		organization1.addTicket(ticket5);
		organization1.addTicket(ticket6);

		// Lastest Receipt Number
		int latestReceiptNumber = 1000;

		// When Generate Receipts is called for the first time
		receiptService.generateReceipts(createRequest(2018, latestReceiptNumber));

		// Then three receipts will be generated

		for (Ticket person1Ticket : person1.getTickets()) {
			Assert.assertNotNull(person1Ticket.getReceipt());
		}
		for (Ticket person2Ticket : person2.getTickets()) {
			Assert.assertNotNull(person2Ticket.getReceipt());
		}
		for (Ticket organization1Ticket : organization1.getTickets()) {
			Assert.assertNotNull(organization1Ticket.getReceipt());
		}
		List<Receipt> allReceipts = (List<Receipt>) receiptRepository.findAll();

		int receiptNumber = latestReceiptNumber;
		Assert.assertTrue(allReceipts.size() == 3);
		for (Receipt receipt : allReceipts) {
			Assert.assertNotNull(receipt.getReceiptNumber());
			Assert.assertTrue(receipt.getReceiptNumber().equals(String.valueOf(receiptNumber)));
			Assert.assertNotNull(receipt.getTaxReceiptName());
			double totalPriceOfTicketsBought = 0.0;
			for (Ticket ticket : receipt.getTickets()) {
				totalPriceOfTicketsBought = totalPriceOfTicketsBought
						+ (ticket.getTicketPrice().getPrice() - ticket.getTicketPrice().getCost());
			}
			Assert.assertTrue(receipt.getAmount() == totalPriceOfTicketsBought);
			Assert.assertTrue(receipt.getPerson() != null ^ receipt.getOrganization() != null);
			if (receipt.getPerson() != null) {
				Assert.assertTrue(receipt.getNumberOfTickets() == receipt.getPerson().getTickets().size());
			}
			if (receipt.getOrganization() != null) {
				Assert.assertTrue(receipt.getNumberOfTickets() == receipt.getOrganization().getTickets().size());
			}
			receiptNumber++;

		}

	}

	private GenerateReceiptRequest createRequest(Integer year, int receiptNumber) {
		GenerateReceiptRequest request = new GenerateReceiptRequest();
		request.setYear(year);
		request.setLastReceiptNumber(receiptNumber);
		return request;
	}

}
