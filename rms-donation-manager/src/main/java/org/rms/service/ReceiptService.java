package org.rms.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
	TicketRepository ticketRepo;

	@Autowired
	ReceiptRepository receiptRepo;

	public void generateReceipts(GenerateReceiptRequest request) {
		Collection<Ticket> tickets = ticketRepo
				.findByPersonNotNullAndIsPaidTrueAndReceiptIsNullAndYear(request.getYear());
		Page<Receipt> receiptsOfTheYear = receiptRepo.findByYear(request.getYear(), null);

		// 1. Get receipts of the Year
		// 2. Are there any receipts ?
		// 2a. YES - Loop through the list of paid tickets bought by a person that does
		// not have a receipt assigned to it
		// 2a. Is the ticket contained in the list of receipts of the year?
		// 2a i) YES - Its a new ticket in a receipt that already exists, we must ADD
		// this ticket and its value to the receipt
		// 2a i) NO - Its a new ticket that has no receipt, we must CREATE a new receipt
		// 2b. NO

		if (receiptsOfTheYear.hasContent()) {
			for (Ticket ticket : tickets) {
				if (receiptsOfTheYear.getContent().contains(ticket.getReceipt())) {
					System.out.println("A new ticket in a receipt that already exists");
				} else {
					System.out.println("A new ticket for a new receipt");
				}

			}
		} else {
			Map<Person, List<Ticket>> personTicketMap = new HashMap<Person, List<Ticket>>();
			for (Ticket ticket : tickets) {
				Person key = ticket.getPerson();
				List<Ticket> value = personTicketMap.get(key);
				if (value != null) {
					value.add(ticket);
					personTicketMap.put(key, value);
				} else {
					List<Ticket> initialisedList = new ArrayList<Ticket>();
					initialisedList.add(ticket);
					personTicketMap.put(key, initialisedList);
				}
			}
			for (Map.Entry<Person, List<Ticket>> entry : personTicketMap.entrySet()) {
				Receipt receipt = new Receipt();
				for (Ticket ticket : entry.getValue()) {
					double amount = receipt.getAmount()
							+ (ticket.getTicketPrice().getPrice() - ticket.getTicketPrice().getCost());
					receipt.setAmount(amount);
					ticket.setReceipt(receipt);
				}
				receipt.setNumberOfTickets(entry.getValue().size());
				receipt.setReceiptNumber(UUID.randomUUID().toString());
				receipt.setTaxReceiptName(entry.getKey().getFirstName() + " " + entry.getKey().getLastName());
				receipt.setFirstOfYear(1); // FIXME: figure out what this is
				receipt.setTickets(entry.getValue());
				receipt.setYear(request.getYear());
				receiptRepo.save(receipt);
			}
		}
	}

}
