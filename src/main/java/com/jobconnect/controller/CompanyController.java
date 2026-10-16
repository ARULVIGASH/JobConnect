package com.jobconnect.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.CompanyRequest;
import com.jobconnect.dto.CompanyResponse;
import com.jobconnect.entity.Company;
import com.jobconnect.entity.Recruiter;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.service.CompanyService;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5175")
public class CompanyController {

    private final CompanyService companyService;
    private final RecruiterRepository recruiterRepository;

    public CompanyController(
            CompanyService companyService,
            RecruiterRepository recruiterRepository) {

        this.companyService = companyService;
        this.recruiterRepository = recruiterRepository;
    }

    // =========================
    // CREATE COMPANY
    // =========================

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @RequestBody CompanyRequest request) {

        Recruiter recruiter = recruiterRepository
                .findById(request.getRecruiterId())
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        Company company = new Company();

        company.setRecruiter(recruiter);
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setWebsite(request.getWebsite());
        company.setLogoUrl(request.getLogoUrl());

        Company savedCompany = companyService.saveCompany(company);

        CompanyResponse response = new CompanyResponse(
                savedCompany.getId(),
                savedCompany.getName(),
                savedCompany.getDescription(),
                savedCompany.getWebsite(),
                savedCompany.getLogoUrl(),
                savedCompany.getRecruiter().getId()
        );

        return ResponseEntity.ok(response);
    }


    // =========================
    // GET COMPANY BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(
            @PathVariable Long id) {

        return companyService.getCompanyById(id)
                .map(company -> {

                    CompanyResponse response = new CompanyResponse(
                            company.getId(),
                            company.getName(),
                            company.getDescription(),
                            company.getWebsite(),
                            company.getLogoUrl(),
                            company.getRecruiter().getId()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================
    // GET COMPANIES BY RECRUITER
    // =========================

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<CompanyResponse>> getCompaniesByRecruiter(
            @PathVariable Long recruiterId) {

        List<CompanyResponse> responses = companyService
                .getCompaniesByRecruiterId(recruiterId)
                .stream()
                .map(company -> new CompanyResponse(
                        company.getId(),
                        company.getName(),
                        company.getDescription(),
                        company.getWebsite(),
                        company.getLogoUrl(),
                        company.getRecruiter().getId()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}