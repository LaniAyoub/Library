package org.example.sbp1.repository;


import org.example.sbp1.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    boolean findById(int id);
    Optional<Tag> findByName(String name);



}
