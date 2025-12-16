package org.example.sbp1.service;

import lombok.RequiredArgsConstructor;
import org.example.sbp1.dto.CreatePublisherRequest;
import org.example.sbp1.model.Publisher;
import org.example.sbp1.repository.PublisherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {

    private final PublisherRepository publisherRepository;

    public Publisher createPublisher(CreatePublisherRequest request) {
        Publisher publisher = new Publisher();
        publisher.setName(request.getName());
        publisher.setAdress(request.getAddress());

        return publisherRepository.save(publisher);
    }

    public Publisher getPublisherById(Long id) {
        return publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));
    }

    public List<Publisher> getAllPublishers() {
        return publisherRepository.findAll();
    }

    public void deletePublisher(Long id) {
        if (!publisherRepository.existsById(id)) {
            throw new RuntimeException("Publisher not found with id: " + id);
        }
        publisherRepository.deleteById(id);
    }
}
