package org.rms.repository;

import org.rms.model.Receipt;
import org.springframework.data.repository.CrudRepository;

public interface ReceiptRepository extends CrudRepository<Receipt, Integer> {
	
	Receipt findByReceiptNumber(String receiptNumber);

}
