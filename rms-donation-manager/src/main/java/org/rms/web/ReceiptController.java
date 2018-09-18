package org.rms.web;

import org.rms.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReceiptController {

	@Autowired
	ReceiptService receiptService;

	@RequestMapping(value = "/receipts/generate", method = RequestMethod.POST)
	public void generate(@RequestBody GenerateReceiptRequest generateReceiptRequest) {

		receiptService.generateReceipts(generateReceiptRequest);

	}

}
