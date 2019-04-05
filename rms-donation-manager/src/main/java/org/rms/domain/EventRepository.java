package org.rms.domain;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface EventRepository extends PagingAndSortingRepository<Event, Integer> {

	List<Event> findByIsActiveTrue();

}
