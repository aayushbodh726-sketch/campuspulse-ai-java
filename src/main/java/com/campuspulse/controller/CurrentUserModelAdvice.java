package com.campuspulse.controller;

import com.campuspulse.model.AppUser;
import com.campuspulse.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@ControllerAdvice
public class CurrentUserModelAdvice {
    private final AppUserRepository users;
    public CurrentUserModelAdvice(AppUserRepository users) { this.users = users; }

    @ModelAttribute("todayLabel")
    public String todayLabel() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("EEEE, d MMMM", Locale.ENGLISH));
    }

    @ModelAttribute("currentUser")
    public AppUser currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserDetails)) return null;
        return users.findByEmailIgnoreCase(authentication.getName()).orElse(null);
    }
}
