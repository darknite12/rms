package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface DonationRepository extends PagingAndSortingRepository<Donation, Integer> {

	List<Donation> findByPerson(Person person);

	List<Donation> findByPersonAndAmountGreaterThanEqual(Person person, Double amount);

	List<Donation> findByOrganization(Organization organization);

	List<Donation> findByOrganizationAndAmountGreaterThanEqual(Organization organization, Double amount);

}
