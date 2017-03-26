package org.rms.domain;

import java.util.List;

import org.rms.domain.SittingTable;
import org.springframework.data.repository.CrudRepository;

public interface SittingTableRepository extends CrudRepository<SittingTable, Integer> {
	
	SittingTable findSittingTableBySittingTableNameAndYear(String sittingTableName, int year);
	
	SittingTable findSittingTableBySittingTableNumberAndYear(int sittingTableNumber, int year);
	
	List<SittingTable> findSittingTablesByYear(int year);

}
