package org.hackathon.task06_Advanced_Dockerization_Challenge.repostory;

import org.hackathon.task06_Advanced_Dockerization_Challenge.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
}
