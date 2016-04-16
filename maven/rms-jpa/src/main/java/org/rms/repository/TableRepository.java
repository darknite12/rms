package org.rms.repository;

import java.util.List;

import org.rms.model.Table;
import org.springframework.data.repository.CrudRepository;

public interface TableRepository extends CrudRepository<Table, Integer> {
	
	Table findTableByTableNameAndYear(String tableName, int year);
	
	Table findTableByTableNumberAndYear(int tableNumber, int year);
	
	List<Table> findTablesByYear(int year);

}
