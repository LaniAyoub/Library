package org.example.sbp1.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Publisher {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)private int id;
    @Column(nullable = false)@NotBlank(message = "Name cannot be blank")private String name;
    @Column(nullable = false)@NotBlank(message = "Adress cannot be blank")private String adress;
    @JsonIgnore
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL) 
    private List<Book> books = new ArrayList<>();
    @Override
    public String toString() {
        return "Publisher{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", adress='" + adress + '\'' +
                ", booksCount=" + (books != null ? books.size() : 0) +
                '}';
    }

}
