package org.example.sbp1.repository;

import org.example.sbp1.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    boolean existsByTitle(String title);
    void deleteByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    int countByCategory(String category);
    
    // Search methods
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthor_NameContainingIgnoreCase(String authorName);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByCategoryContainingIgnoreCase(String category);
}
