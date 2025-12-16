package org.example.sbp1.service;

import org.example.sbp1.dto.CreateBookRequest;
import org.example.sbp1.model.Author;
import org.example.sbp1.model.Book;
import org.example.sbp1.model.Publisher;
import org.example.sbp1.model.Tag;
import org.example.sbp1.repository.AuthorRepository;
import org.example.sbp1.repository.BookRepository;
import org.example.sbp1.repository.PublisherRepository;
import org.example.sbp1.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final TagRepository tagRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, PublisherRepository publisherRepository, TagRepository tagRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.tagRepository = tagRepository;
    }
    // -------------------------
    // CREATE BOOK from DTO
    // -------------------------
    public Book createBook(CreateBookRequest dto) {
        // Validate request fields for nulls
        if ((dto.getAuthorId() == null) && (dto.getAuthorName() == null || dto.getAuthorName().trim().isEmpty())) {
            throw new IllegalArgumentException("Author information is required (id or name)");
        }
        if ((dto.getPublisherId() == null) && (dto.getPublisherName() == null || dto.getPublisherName().trim().isEmpty())) {
            throw new IllegalArgumentException("Publisher information is required (id or name)");
        }


        if (dto.getIsbn() == null || dto.getIsbn().trim().isEmpty()) {
            throw new IllegalArgumentException("ISBN must not be null or empty");
        }
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title must not be null or empty");
        }
        if (dto.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        if (dto.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }



        // ISBN must be unique
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new RuntimeException("Book with ISBN already exists: " + dto.getIsbn());
        }

        // Load related entities
        // --- Look up Author (by ID or by Name) ---
        Author author;
        if (dto.getAuthorId() != null) {
            author = authorRepository.findById(dto.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
        } else {
            author = authorRepository.findByName(dto.getAuthorName())
                    .orElseThrow(() -> new RuntimeException("Author not found with name: " + dto.getAuthorName()));
        }


        // --- Look up Publisher (by ID or by Name) ---
        Publisher publisher;
        if (dto.getPublisherId() != null) {
            publisher = publisherRepository.findById(dto.getPublisherId())
                    .orElseThrow(() -> new RuntimeException("Publisher not found"));
        } else {
            publisher = publisherRepository.findByName(dto.getPublisherName())
                    .orElseThrow(() -> new RuntimeException("Publisher not found with name: " + dto.getPublisherName()));
        }

        Set<Tag> tags = new HashSet<>();
        if (dto.getTagIds() != null) {
            tags.addAll(dto.getTagIds().stream()
                    .map(id -> tagRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Tag not found: " + id)))
                    .collect(Collectors.toSet()));
        }
        if (dto.getTagNames() != null) {
            tags.addAll(dto.getTagNames().stream()
                    .map(name -> tagRepository.findByName(name)
                            .orElseThrow(() -> new RuntimeException("Tag not found with name: " + name)))
                    .collect(Collectors.toSet()));
        }






        // Build the Book Entity (client never builds it)
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setIsbn(dto.getIsbn());
        book.setPrice(dto.getPrice());
        book.setQuantity(dto.getQuantity());
        book.setCategory(dto.getCategory());
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setTags(tags);

        return bookRepository.save(book);
    }/* 
    public void SaveBook(Book book)
    {
        boolean exists = bookRepository.existsByIsbn(book.getTitle());

        if (!exists) {
            bookRepository.save(book);
            System.out.println("Book added: " + book.getTitle());
        } else {
            System.out.println("Book already exists: " + book.getTitle());
        }
    }*/
    public int Inventory(String category) {
        int count = 0;
        int total = bookRepository.countByCategory(category);
        /*List<Book> books = bookRepository.SearchCategory(category);
        for (Book book : books) {
                count++;
        }*/
        return total;
    }
    public void update(){
        List<Book> books = bookRepository.findAll();
        for (Book book : books) {
            //bookRepository.UpdatePrice(book.getPrice() * 0.1);
            book.setPrice(book.getPrice() * 0.1);
        }
        bookRepository.saveAll(books);


    }
    @Transactional
    public void deleteBook(String isbn){
        bookRepository.deleteByIsbn(isbn);
    }


    public List<Book> displayAllBooks(){
        List<Book> books = bookRepository.findAll();
        for (Book book : books) {
            System.out.println(book);
        }
        return books;
    }

    // Search methods
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Book> searchByAuthor(String authorName) {
        return bookRepository.findByAuthor_NameContainingIgnoreCase(authorName);
    }

    public Book searchByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found with ISBN: " + isbn));
    }

    public List<Book> searchByCategory(String category) {
        return bookRepository.findByCategoryContainingIgnoreCase(category);
    }

}
