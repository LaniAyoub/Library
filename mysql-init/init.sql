-- Library Management System - Initial Database Setup
-- This file runs automatically when MySQL container starts for the first time

-- Create database if not exists (already handled by docker-compose)
CREATE DATABASE IF NOT EXISTS librarydb;
USE librarydb;

-- Grant privileges
GRANT ALL PRIVILEGES ON librarydb.* TO 'library'@'%';
FLUSH PRIVILEGES;

-- Optional: Insert sample data
-- Uncomment the following lines to add initial test data

/*
-- Insert sample authors
INSERT INTO author (name, email) VALUES 
  ('J.K. Rowling', 'jkrowling@example.com'),
  ('George Orwell', 'orwell@example.com'),
  ('Jane Austen', 'austen@example.com');

-- Insert sample publishers
INSERT INTO publisher (name, address) VALUES 
  ('Penguin Books', 'London, UK'),
  ('Bloomsbury', 'London, UK'),
  ('HarperCollins', 'New York, USA');

-- Insert sample books
INSERT INTO books (title, isbn, price, quantity, category, author_id, publisher_id) VALUES 
  ('1984', '12-345-678', 19.99, 50, 'Dystopian', 2, 1),
  ('Harry Potter', '23-456-789', 29.99, 100, 'Fantasy', 1, 2),
  ('Pride and Prejudice', '34-567-890', 14.99, 30, 'Classic', 3, 3);
*/

SELECT 'Database initialization complete!' AS status;
