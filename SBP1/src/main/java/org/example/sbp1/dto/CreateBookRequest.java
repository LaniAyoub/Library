package org.example.sbp1.dto;

import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class CreateBookRequest {
    private String title;
    private String category;
    private String isbn;
    private double price;
    private int quantity;
    private Long authorId;
    private Long publisherId;
    private String authorName; // New: used for searching
    private String publisherName; // New: used for searching
    private Set<Long> tagIds;
    private List<String> tagNames;

}
