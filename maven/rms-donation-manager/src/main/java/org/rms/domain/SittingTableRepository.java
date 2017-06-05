package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface SittingTableRepository extends PagingAndSortingRepository<SittingTable, Integer> {

	SittingTable findSittingTableBySittingTableNameAndYear(String sittingTableName, int year);

	SittingTable findSittingTableBySittingTableNumberAndYear(int sittingTableNumber, int year);

	List<SittingTable> findSittingTablesByYear(int year);

}
