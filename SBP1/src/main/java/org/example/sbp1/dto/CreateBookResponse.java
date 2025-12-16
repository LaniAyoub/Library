package org.example.sbp1.dto;

import lombok.Data;

import java.util.Set;

@Data
public class CreateBookResponse {
    private String title;
    private String category;
    private String isbn;
    private double price;
    private int quantity;
    private Long authorId;
    private Long publisherId;
    private Set<Long> tagIds;
}