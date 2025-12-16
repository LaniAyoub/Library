package org.example.sbp1.controller;

import lombok.RequiredArgsConstructor;
import org.example.sbp1.dto.CreatePublisherRequest;
import org.example.sbp1.model.Publisher;
import org.example.sbp1.service.PublisherService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {

    private final PublisherService publisherService;

    @PostMapping
    public Publisher createPublisher(@RequestBody CreatePublisherRequest request) {
        return publisherService.createPublisher(request);
    }

    @GetMapping
    public List<Publisher> getAllPublishers() {
        return publisherService.getAllPublishers();
    }

    @GetMapping("/{id}")
    public Publisher getPublisherById(@PathVariable Long id) {
        return publisherService.getPublisherById(id);
    }

    @DeleteMapping("/{id}")
    public void deletePublisher(@PathVariable Long id) {
        publisherService.deletePublisher(id);
    }
}
