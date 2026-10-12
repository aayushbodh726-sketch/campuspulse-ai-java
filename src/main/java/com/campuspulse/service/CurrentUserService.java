package com.campuspulse.service;

import com.campuspulse.model.AppUser;
import com.campuspulse.repository.AppUserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService {
    private final AppUserRepository users;
    public CurrentUserService(AppUserRepository users) { this.users = users; }

    @Transactional(readOnly = true)
    public AppUser requireCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("Please sign in first.");
        }
        return users.findByEmailIgnoreCase(authentication.getName())
            .orElseThrow(() -> new AccessDeniedException("Your account profile could not be found."));
    }
}
