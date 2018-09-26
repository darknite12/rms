package org.rms.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rms.domain.Organization;
import org.rms.domain.Person;
import org.rms.domain.Receipt;
import org.rms.domain.ReceiptRepository;
import org.rms.domain.Ticket;
import org.rms.domain.TicketRepository;
import org.rms.web.GenerateReceiptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ReceiptService {

	@Autowired
	protected TicketRepository ticketRepo;

	@Autowired
	protected ReceiptRepository receiptRepo;

	public void generateReceipts(GenerateReceiptRequest request) {
		List<Ticket> ticketsBoughtWithoutAReceipt = new ArrayList<Ticket>();
		ticketsBoughtWithoutAReceipt
				.addAll(ticketRepo.findByPersonNotNullAndIsPaidTrueAndReceiptIsNullAndYear(request.getYear()));
		ticketsBoughtWithoutAReceipt
				.addAll(ticketRepo.findByOrganizationNotNullAndIsPaidTrueAndReceiptIsNullAndYear(request.getYear()));
		Page<Receipt> receiptsOfTheYear = receiptRepo.findByYear(request.getYear(), null);

		if (receiptsOfTheYear.hasContent()) {
			List<Receipt> receipts = receiptsOfTheYear.getContent();
			for (Receipt receipt : receipts) {
				for (Ticket ticket : ticketsBoughtWithoutAReceipt) {
					if (receipt.getPerson().getPersonId() == ticket.getPerson().getPersonId()) {
						System.out.println("add a ticket to an existing receipt");
					}
				}
			}
		} else {
			createReceiptsForTheFirstTime(request, ticketsBoughtWithoutAReceipt);
		}
	}

	private void createReceiptsForTheFirstTime(GenerateReceiptRequest request,
			List<Ticket> ticketsBoughtWithoutAReceipt) {
		Integer lastReceiptNumber = request.getLastReceiptNumber();
		Map<Object, List<Ticket>> ticketMap = new HashMap<Object, List<Ticket>>();
		for (Ticket ticket : ticketsBoughtWithoutAReceipt) {
			Object key = ticket.getOrganization();
			if (key == null) {
				key = ticket.getPerson();
			}
			List<Ticket> value = ticketMap.get(key);
			if (value != null) {
				value.add(ticket);
				ticketMap.put(key, value);
			} else {
				List<Ticket> initialisedList = new ArrayList<Ticket>();
				initialisedList.add(ticket);
				ticketMap.put(key, initialisedList);
			}
		}
		for (Map.Entry<Object, List<Ticket>> entry : ticketMap.entrySet()) {
			Receipt receipt = new Receipt();
			for (Ticket ticket : entry.getValue()) {
				double amount = receipt.getAmount()
						+ (ticket.getTicketPrice().getPrice() - ticket.getTicketPrice().getCost());
				receipt.setAmount(amount);
				ticket.setReceipt(receipt);
			}
			receipt.setNumberOfTickets(entry.getValue().size());
			receipt.setReceiptNumber(String.valueOf(lastReceiptNumber));
			if (entry.getKey() instanceof Organization) {
				Organization organization = (Organization) entry.getKey();
				receipt.setTaxReceiptName(organization.getName());
				receipt.setOrganization(organization);
			} else if (entry.getKey() instanceof Person) {
				Person person = (Person) entry.getKey();
				receipt.setTaxReceiptName(person.getFirstName() + " " + person.getLastName());
				receipt.setPerson(person);
			}
			receipt.setFirstOfYear(1);
			receipt.setTickets(entry.getValue());
			receipt.setYear(request.getYear());
			lastReceiptNumber++;
			receiptRepo.save(receipt);
		}
	}

}
