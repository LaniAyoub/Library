package org.example.sbp1.dto;

import lombok.Data;
import org.example.sbp1.model.Book;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateAuthorResponse {
    private int id;
    private String name;
    private String email;
    private List<Book> books = new ArrayList<>();
}