package org.example.sbp1.controller;

import lombok.RequiredArgsConstructor;
import org.example.sbp1.dto.CreateAuthorRequest;
import org.example.sbp1.model.Author;
import org.example.sbp1.repository.AuthorRepository;
import org.example.sbp1.service.AuthorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PostMapping
    public Author createAuthor(@RequestBody CreateAuthorRequest request) {
        return authorService.createAuthor(request);
    }

    @GetMapping
    public List<Author> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable Long id) {
        return authorService.getAuthorById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
    }
}
