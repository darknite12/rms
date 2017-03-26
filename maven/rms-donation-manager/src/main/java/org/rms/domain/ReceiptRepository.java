package org.rms.domain;

import org.rms.domain.Receipt;
import org.springframework.data.repository.CrudRepository;

public interface ReceiptRepository extends CrudRepository<Receipt, Integer> {
	
	Receipt findByReceiptNumber(String receiptNumber);

}
