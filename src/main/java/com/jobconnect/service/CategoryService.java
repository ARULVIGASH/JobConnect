package com.jobconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jobconnect.entity.Category;
import com.jobconnect.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public boolean categoryExists(String name) {
        return categoryRepository.existsByName(name);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}