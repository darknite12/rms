package org.rms.domain;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the person_organization database table.
 * 
 */
@Entity
@Table(name="person_organization")
@NamedQuery(name="PersonOrganization.findAll", query="SELECT p FROM PersonOrganization p")
public class PersonOrganization implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="person_organization_id")
	private int personOrganizationId;

	//bi-directional many-to-one association to Organization
	@ManyToOne
	@JoinColumn(name="organization_id")
	private Organization organization;

	//bi-directional many-to-one association to Person
	@ManyToOne
	@JoinColumn(name="person_id")
	private Person person;

	public PersonOrganization() {
	}

	public int getPersonOrganizationId() {
		return this.personOrganizationId;
	}

	public void setPersonOrganizationId(int personOrganizationId) {
		this.personOrganizationId = personOrganizationId;
	}

	public Organization getOrganization() {
		return this.organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public Person getPerson() {
		return this.person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

}