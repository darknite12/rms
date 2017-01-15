package org.rms.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the table database table.
 * 
 */
@Entity
@NamedQuery(name="SittingTable.findAll", query="SELECT t FROM SittingTable t")
public class SittingTable implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="sitting_table_id")
	private int sittingTableId;

	@Column(name="people_per_table")
	private int peoplePerTable;

	@Column(name="sitting_table_name")
	private String sittingTableName;

	@Column(name="sitting_table_number")
	private int sittingTableNumber;

	private int year;

	public SittingTable() {
	}

	public int getSittingTableId() {
		return sittingTableId;
	}

	public void setSittingTableId(int sittingTableId) {
		this.sittingTableId = sittingTableId;
	}

	public int getPeoplePerTable() {
		return this.peoplePerTable;
	}

	public void setPeoplePerTable(int peoplePerTable) {
		this.peoplePerTable = peoplePerTable;
	}

	public String getSittingTableName() {
		return sittingTableName;
	}

	public void setSittingTableName(String sittingTableName) {
		this.sittingTableName = sittingTableName;
	}

	public int getSittingTableNumber() {
		return sittingTableNumber;
	}

	public void setSittingTableNumber(int sittingTableNumber) {
		this.sittingTableNumber = sittingTableNumber;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

}