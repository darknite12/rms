package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;

import java.util.List;


/**
 * The persistent class for the address database table.
 * 
 */
@Entity
@NamedQuery(name="Address.findAll", query="SELECT a FROM Address a")
public class Address implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="address_id")
	private int addressId;

	private String address;

	private String address2;

	private String city;
	
	private String country;

	@Column(name="po_box")
	private String poBox;

	@Column(name="postal_code")
	private String postalCode;

	private String province;

	//bi-directional many-to-many association to Person
	@ManyToMany(mappedBy="addresses")
	private List<Person> persons;

	//bi-directional many-to-many association to Organization
	@ManyToMany(mappedBy="addresses")
	private List<Organization> organizations;

	public Address() {
	}

	public int getAddressId() {
		return this.addressId;
	}

	public void setAddressId(int addressId) {
		this.addressId = addressId;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAddress2() {
		return this.address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}
	
	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPoBox() {
		return this.poBox;
	}

	public void setPoBox(String poBox) {
		this.poBox = poBox;
	}

	public String getPostalCode() {
		return this.postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getProvince() {
		return this.province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public List<Person> getPersons() {
		return this.persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

	public List<Organization> getOrganizations() {
		return this.organizations;
	}

	public void setOrganizations(List<Organization> organizations) {
		this.organizations = organizations;
	}

}