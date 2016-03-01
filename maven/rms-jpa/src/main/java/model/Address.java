package model;

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

	@Column(name="po_box")
	private String poBox;

	@Column(name="postal_code")
	private String postalCode;

	private String province;

	//bi-directional many-to-one association to OrganizationAddress
	@OneToMany(mappedBy="address")
	private List<OrganizationAddress> organizationAddresses;

	//bi-directional many-to-one association to PersonAddress
	@OneToMany(mappedBy="address")
	private List<PersonAddress> personAddresses;

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

	public List<OrganizationAddress> getOrganizationAddresses() {
		return this.organizationAddresses;
	}

	public void setOrganizationAddresses(List<OrganizationAddress> organizationAddresses) {
		this.organizationAddresses = organizationAddresses;
	}

	public OrganizationAddress addOrganizationAddress(OrganizationAddress organizationAddress) {
		getOrganizationAddresses().add(organizationAddress);
		organizationAddress.setAddress(this);

		return organizationAddress;
	}

	public OrganizationAddress removeOrganizationAddress(OrganizationAddress organizationAddress) {
		getOrganizationAddresses().remove(organizationAddress);
		organizationAddress.setAddress(null);

		return organizationAddress;
	}

	public List<PersonAddress> getPersonAddresses() {
		return this.personAddresses;
	}

	public void setPersonAddresses(List<PersonAddress> personAddresses) {
		this.personAddresses = personAddresses;
	}

	public PersonAddress addPersonAddress(PersonAddress personAddress) {
		getPersonAddresses().add(personAddress);
		personAddress.setAddress(this);

		return personAddress;
	}

	public PersonAddress removePersonAddress(PersonAddress personAddress) {
		getPersonAddresses().remove(personAddress);
		personAddress.setAddress(null);

		return personAddress;
	}

}