package org.example.sbp1.repository;


import org.example.sbp1.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    boolean findById(int id);
    Optional<Publisher> findByName(String name);

}
