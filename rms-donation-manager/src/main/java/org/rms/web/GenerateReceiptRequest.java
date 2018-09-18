package org.rms.web;

public class GenerateReceiptRequest {

	Integer year;

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	@Override
	public String toString() {
		return String.format("GenerateReceiptRequest [year=%s]", year);
	}

}
