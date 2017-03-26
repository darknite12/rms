package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the organization_address database table.
 * 
 */
@Entity
@javax.persistence.Table(name="organization_address")
@NamedQuery(name="OrganizationAddress.findAll", query="SELECT o FROM OrganizationAddress o")
public class OrganizationAddress implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="organization_address_id")
	private int organizationAddressId;

	//bi-directional many-to-one association to Address
	@ManyToOne
	@JoinColumn(name="address_id")
	private Address address;

	//bi-directional many-to-one association to Organization
	@ManyToOne
	@JoinColumn(name="organization_id")
	private Organization organization;

	public OrganizationAddress() {
	}

	public int getOrganizationAddressId() {
		return this.organizationAddressId;
	}

	public void setOrganizationAddressId(int organizationAddressId) {
		this.organizationAddressId = organizationAddressId;
	}

	public Address getAddress() {
		return this.address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public Organization getOrganization() {
		return this.organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

}