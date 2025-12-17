package org.example.sbp1.controller;

import org.example.sbp1.dto.CreateBookRequest;
import org.example.sbp1.model.Book;
import org.example.sbp1.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")


public class
BookController {
    private  BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    
    // --- Get all books (REST standard endpoint) ---
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.displayAllBooks();
    }
    
    /*
    // --- Create a book ---
    @PostMapping("/saveBook")
    public void addBook(@RequestBody Book book) {
        bookService.SaveBook(book);
    } */
    // ---or ---
    @PostMapping("/createBook")
    public Book createBook(@RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }

    // --- Get the number of books in a category ---
    @GetMapping("/inventory")
    public int getAllBooks(@RequestParam String category) {
        return bookService.Inventory(category);
    }

    // --- Update all book prices by 10% ---
    @PutMapping("/updateBook")
    public void updatePrices() {
        bookService.update();
    }

    // --- Delete a book by ISBN ---
    @DeleteMapping("/DeleteBook/{isbn}")
    public void deleteBook(@PathVariable String isbn) {
        bookService.deleteBook(isbn);
    }
    // --- Display All Books ---
    @GetMapping("/displayAllBooks")
    public List<Book> displayBooks() {
        return bookService.displayAllBooks();
    }

    // --- Search books by title ---
    @GetMapping("/search/title")
    public List<Book> searchByTitle(@RequestParam String title) {
        return bookService.searchByTitle(title);
    }

    // --- Search books by author name ---
    @GetMapping("/search/author")
    public List<Book> searchByAuthor(@RequestParam String authorName) {
        return bookService.searchByAuthor(authorName);
    }

    // --- Search book by ISBN ---
    @GetMapping("/search/isbn")
    public Book searchByIsbn(@RequestParam String isbn) {
        return bookService.searchByIsbn(isbn);
    }

    // --- Search books by category ---
    @GetMapping("/search/category")
    public List<Book> searchByCategory(@RequestParam String category) {
        return bookService.searchByCategory(category);
    }

}
