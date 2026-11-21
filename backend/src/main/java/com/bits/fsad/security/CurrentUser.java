package com.bits.fsad.security;

import com.bits.fsad.entity.User;
import com.bits.fsad.exception.BusinessException;
import com.bits.fsad.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** Resolves the currently authenticated application User. */
@Component
public class CurrentUser {

    private final UserRepository userRepository;

    public CurrentUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User get() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new BusinessException("No authenticated user");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new BusinessException("Authenticated user not found"));
    }

    public Long getId() {
        return get().getUserId();
    }
}
