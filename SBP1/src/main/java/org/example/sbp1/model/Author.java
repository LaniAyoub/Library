package org.example.sbp1.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.validator.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@ToString(exclude = "books")

public class Author {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)private int id;
    @Column(nullable = false)@NotBlank(message = "Name cannot be blank")private String name;
    @Column(nullable = false)@NotBlank(message = "Email cannot be blank")private String email;
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)@JsonIgnore@JsonBackReference

    private List<Book> books = new ArrayList<>();


    public Author(String name, int id, String email, List<Book> books) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.books = books;
    }

    public Author() {

    }
}
