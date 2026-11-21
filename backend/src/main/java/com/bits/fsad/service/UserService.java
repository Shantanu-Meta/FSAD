package com.bits.fsad.service;

import com.bits.fsad.dto.CreateUserRequest;
import com.bits.fsad.entity.User;
import com.bits.fsad.exception.BusinessException;
import com.bits.fsad.exception.ResourceNotFoundException;
import com.bits.fsad.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public User create(CreateUserRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new BusinessException("Username already exists: " + req.getUsername());
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole());
        u.setFullName(req.getFullName());
        u.setEmail(req.getEmail());
        u.setIsActive(true);
        return userRepository.save(u);
    }

    @Transactional
    public User setActive(Long id, boolean active) {
        User u = findById(id);
        u.setIsActive(active);
        return userRepository.save(u);
    }
}
