package org.rms.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the person_address database table.
 * 
 */
@Entity
@Table(name="person_address")
@NamedQuery(name="PersonAddress.findAll", query="SELECT p FROM PersonAddress p")
public class PersonAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="person_address_id")
	private int personAddressId;

	//bi-directional many-to-one association to Address
	@ManyToOne
	@JoinColumn(name="address_id")
	private Address address;

	//bi-directional many-to-one association to Person
	@ManyToOne
	@JoinColumn(name="person_id")
	private Person person;

	public PersonAddress() {
	}

	public int getPersonAddressId() {
		return this.personAddressId;
	}

	public void setPersonAddressId(int personAddressId) {
		this.personAddressId = personAddressId;
	}

	public Address getAddress() {
		return this.address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

}