package com.bits.fsad.controller;

import com.bits.fsad.dto.CreateUserRequest;
import com.bits.fsad.dto.UserInfo;
import com.bits.fsad.entity.User;
import com.bits.fsad.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserInfo> list() {
        return userService.findAll().stream().map(this::toInfo).toList();
    }

    @PostMapping
    public ResponseEntity<UserInfo> create(@Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.ok(toInfo(userService.create(req)));
    }

    @PutMapping("/{id}/activate")
    public UserInfo activate(@PathVariable Long id) {
        return toInfo(userService.setActive(id, true));
    }

    @PutMapping("/{id}/deactivate")
    public UserInfo deactivate(@PathVariable Long id) {
        return toInfo(userService.setActive(id, false));
    }

    private UserInfo toInfo(User u) {
        return new UserInfo(u.getUserId(), u.getUsername(), u.getRole(), u.getFullName(), u.getEmail(), u.getIsActive());
    }
}
