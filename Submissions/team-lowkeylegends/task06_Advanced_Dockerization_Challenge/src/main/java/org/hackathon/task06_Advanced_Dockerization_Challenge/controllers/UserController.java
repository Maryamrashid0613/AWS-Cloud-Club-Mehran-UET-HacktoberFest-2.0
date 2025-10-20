package org.hackathon.task06_Advanced_Dockerization_Challenge.controllers;


import org.hackathon.task06_Advanced_Dockerization_Challenge.entities.Users;
import org.hackathon.task06_Advanced_Dockerization_Challenge.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController
{
    public final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity getAllUsers()
    {
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
