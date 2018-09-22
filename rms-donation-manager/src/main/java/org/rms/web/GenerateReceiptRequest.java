package org.rms.web;

public class GenerateReceiptRequest {

	Integer year;
	Integer lastReceiptNumber;

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Integer getLastReceiptNumber() {
		return lastReceiptNumber;
	}

	public void setLastReceiptNumber(Integer lastReceiptNumber) {
		this.lastReceiptNumber = lastReceiptNumber;
	}

	@Override
	public String toString() {
		return "GenerateReceiptRequest [year=" + year + ", lastReceiptNumber=" + lastReceiptNumber + "]";
	}

}
