package org.hackathon.task06_Advanced_Dockerization_Challenge.services;

import org.hackathon.task06_Advanced_Dockerization_Challenge.repostory.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{

    public final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List getAllUsers()
    {
        return userRepository.findAll();
    }
}
