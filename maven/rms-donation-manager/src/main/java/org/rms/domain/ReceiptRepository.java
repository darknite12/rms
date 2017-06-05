package org.rms.domain;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ReceiptRepository extends PagingAndSortingRepository<Receipt, Integer> {

	Receipt findByReceiptNumber(String receiptNumber);

}
