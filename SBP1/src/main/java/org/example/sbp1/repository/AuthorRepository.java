package org.example.sbp1.repository;


import org.example.sbp1.model.Author;
import org.example.sbp1.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    boolean findById(int id);
    Optional<Author> findByName(String name);




}
