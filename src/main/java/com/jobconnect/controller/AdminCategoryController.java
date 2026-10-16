package com.jobconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.entity.Category;
import com.jobconnect.service.CategoryService;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin(origins = "http://localhost:5175")
public class AdminCategoryController {

private final CategoryService categoryService;

public AdminCategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
}

@GetMapping
public ResponseEntity<List<Category>> getAllCategories() {
    return ResponseEntity.ok(
        categoryService.getAllCategories()
    );
}

@PostMapping
public ResponseEntity<Category> createCategory(
        @RequestBody Category category) {

    return ResponseEntity.ok(
        categoryService.saveCategory(category)
    );
}

@PutMapping("/{id}")
public ResponseEntity<Category> updateCategory(
        @PathVariable Long id,
        @RequestBody Category category) {

    return categoryService.getCategoryById(id)
            .map(existingCategory -> {

                existingCategory.setName(category.getName());
                existingCategory.setDescription(
                    category.getDescription()
                );

                return ResponseEntity.ok(
                    categoryService.saveCategory(existingCategory)
                );
            })
            .orElse(ResponseEntity.notFound().build());
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteCategory(
        @PathVariable Long id) {

    if (categoryService.getCategoryById(id).isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    categoryService.deleteCategory(id);

    return ResponseEntity.noContent().build();
}

}