package org.example.sbp1.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Tag {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)private int id;

    @Column(nullable = false)@NotBlank(message = "Name cannot be blank")private String name;

    @ManyToMany(mappedBy = "tags") @JsonIgnore@JsonBackReference
    private Set<Book> books = new HashSet<>();

}
