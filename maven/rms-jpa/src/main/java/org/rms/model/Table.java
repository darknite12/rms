package org.rms.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the table database table.
 * 
 */
@Entity
@NamedQuery(name="Table.findAll", query="SELECT t FROM Table t")
public class Table implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="table_id")
	private int tableId;

	@Column(name="people_per_table")
	private int peoplePerTable;

	@Column(name="table_name")
	private String tableName;

	@Column(name="table_number")
	private int tableNumber;

	private int year;

	public Table() {
	}

	public int getTableId() {
		return this.tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	public int getPeoplePerTable() {
		return this.peoplePerTable;
	}

	public void setPeoplePerTable(int peoplePerTable) {
		this.peoplePerTable = peoplePerTable;
	}

	public String getTableName() {
		return this.tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public int getTableNumber() {
		return this.tableNumber;
	}

	public void setTableNumber(int tableNumber) {
		this.tableNumber = tableNumber;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

}