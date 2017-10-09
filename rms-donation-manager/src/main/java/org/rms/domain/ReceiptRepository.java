package org.rms.domain;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ReceiptRepository extends PagingAndSortingRepository<Receipt, Integer> {

	Receipt findByReceiptNumber(@Param("receiptNumber") String receiptNumber);

}
