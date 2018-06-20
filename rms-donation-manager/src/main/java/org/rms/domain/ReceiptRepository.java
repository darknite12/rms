package org.rms.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ReceiptRepository extends PagingAndSortingRepository<Receipt, Integer> {

	Receipt findByReceiptNumber(@Param("receiptNumber") String receiptNumber);
	
	Page<Receipt> findByYear(@Param("year") Integer year, Pageable page);
	
	@Query("select r from Receipt r where r.receiptNumber like %:searchParameter% or r.amount like %:searchParameter% or "
			+ "r.year like %:searchParameter% or r.taxReceiptName like %:searchParameter% or r.numberOfTickets like %:searchParameter%")
	Page<Receipt> findBySearchString(@Param("searchParameter") String searchParameter, Pageable page);
}
