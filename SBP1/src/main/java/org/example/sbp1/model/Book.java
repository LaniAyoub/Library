package org.example.sbp1.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.validator.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@ToString(exclude = "author")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Book {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)private int id;
    @Column(nullable = false)@NotBlank(message = "Title cannot be blank")private String title;
    //@NotBlank(message = "Author cannot be blank")@Column(nullable = false)private String author;
    @Column(unique = true,nullable = false)
    @NotBlank @Pattern(regexp = "^\\d{2}-\\d{3}-\\d{3}$", message = "ISBN must be in the format xx-xxx-xxx")private String isbn;
    @Column(nullable = false) @Min(value = 0, message = "¨Price cannot be negative") private double price;
    @Column(nullable = false) @Min(value = 0, message = "¨Quantity cannot be negative")  private int quantity;
    private String category;

    // ------------------------
    //  Relationships
    // ------------------------

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @ManyToOne
    @JoinColumn(name = "publisher_id", nullable = false)
    private Publisher publisher;

    @ManyToMany
    @JoinTable(
            name = "book_tag",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", isbn='" + isbn + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", category='" + category + '\'' +
                ", author=" + (author != null ? author.getId() : null) +
                ", publisher=" + (publisher != null ? publisher.getId() : null) +
                ", tagsCount=" + (tags != null ? tags.size() : 0) +
                '}';
    }

}
