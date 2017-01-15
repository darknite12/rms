package org.rms.web.controllers.api;

import org.rms.web.controllers.constants.URLConstants;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {
	
	private static final String PERSON = "/person";
	
	@RequestMapping(value = URLConstants.API + PERSON + "/{id}", method=RequestMethod.GET)
	public String get(@PathVariable("id") int id) {
//		return "Greetings from Spring Boot!";
		return "Greetings from Spring Boot person " + id + "!";
	}
}
