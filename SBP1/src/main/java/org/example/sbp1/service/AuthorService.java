package org.example.sbp1.service;

import lombok.RequiredArgsConstructor;
import org.example.sbp1.dto.CreateAuthorRequest;
import org.example.sbp1.model.Author;
import org.example.sbp1.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public Author createAuthor(CreateAuthorRequest request) {
        Author author = new Author();
        author.setName(request.getName());
        author.setEmail(request.getEmail());

        return authorRepository.save(author);
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
    }
}
