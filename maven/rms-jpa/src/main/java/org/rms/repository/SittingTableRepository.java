package org.rms.repository;

import java.util.List;

import org.rms.model.SittingTable;
import org.springframework.data.repository.CrudRepository;

public interface SittingTableRepository extends CrudRepository<SittingTable, Integer> {
	
	SittingTable findSittingTableBySittingTableNameAndYear(String sittingTableName, int year);
	
	SittingTable findSittingTableBySittingTableNumberAndYear(int sittingTableNumber, int year);
	
	List<SittingTable> findSittingTablesByYear(int year);

}
