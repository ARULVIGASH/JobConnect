package com.jobconnect.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobconnect.dto.JobRequest;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.entity.Category;
import com.jobconnect.entity.Company;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.Recruiter;
import com.jobconnect.repository.CategoryRepository;
import com.jobconnect.repository.CompanyRepository;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5175")
public class JobController {

    private final JobService jobService;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;

    public JobController(
            JobService jobService,
            RecruiterRepository recruiterRepository,
            CompanyRepository companyRepository,
            CategoryRepository categoryRepository) {

        this.jobService = jobService;
        this.recruiterRepository = recruiterRepository;
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @RequestBody JobRequest request) {

        Recruiter recruiter = recruiterRepository
                .findById(request.getRecruiterId())
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        Company company = companyRepository
                .findById(request.getCompanyId())
                .orElseThrow(() ->
                        new RuntimeException("Company not found"));

        Category category = null;

        if (request.getCategoryId() != null) {

            category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new RuntimeException("Category not found"));
        }

        Job job = new Job();

        job.setRecruiter(recruiter);
        job.setCompany(company);
        job.setCategory(category);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkills(request.getSkills());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setExperience(request.getExperience());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setVacancies(request.getVacancies());
        job.setDeadline(request.getDeadline());

        Job savedJob = jobService.saveJob(job);

        return ResponseEntity.ok(
                convertToResponse(savedJob)
        );
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        List<JobResponse> responses = jobService
                .getActiveJobs()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(
            @RequestParam String title) {

        List<JobResponse> responses = jobService
                .searchByTitle(title)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<JobResponse>> searchByTitle(
            @RequestParam String title) {

        List<JobResponse> responses = jobService
                .searchByTitle(title)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<JobResponse>> searchByLocation(
            @RequestParam String location) {

        List<JobResponse> responses = jobService
                .searchByLocation(location)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search/category")
    public ResponseEntity<List<JobResponse>> searchByCategory(
            @RequestParam Long categoryId) {

        List<JobResponse> responses = jobService
                .getJobsByCategory(categoryId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search/min-salary")
    public ResponseEntity<List<JobResponse>> searchByMinimumSalary(
            @RequestParam Integer salaryMin) {

        List<JobResponse> responses = jobService
                .searchByMinimumSalary(salaryMin)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search/max-salary")
    public ResponseEntity<List<JobResponse>> searchByMaximumSalary(
            @RequestParam Integer salaryMax) {

        List<JobResponse> responses = jobService
                .searchByMaximumSalary(salaryMax)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobResponse>> getJobsByRecruiter(
            @PathVariable Long recruiterId) {

        List<JobResponse> responses = jobService
                .getJobsByRecruiterId(recruiterId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id) {

        return jobService.getJobById(id)
                .map(job -> ResponseEntity.ok(
                        convertToResponse(job)
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody JobRequest request) {

        Job job = jobService.getJobById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (request.getCompanyId() != null) {

            Company company = companyRepository
                    .findById(request.getCompanyId())
                    .orElseThrow(() ->
                            new RuntimeException("Company not found"));

            job.setCompany(company);
        }

        if (request.getCategoryId() != null) {

            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new RuntimeException("Category not found"));

            job.setCategory(category);

        } else {

            job.setCategory(null);
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkills(request.getSkills());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setExperience(request.getExperience());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setVacancies(request.getVacancies());
        job.setDeadline(request.getDeadline());

        Job updatedJob = jobService.saveJob(job);

        return ResponseEntity.ok(
                convertToResponse(updatedJob)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id) {

        Job job = jobService.getJobById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        jobService.deleteJob(id);

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }

    private JobResponse convertToResponse(Job job) {

        JobResponse response = new JobResponse();

        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setSkills(job.getSkills());
        response.setLocation(job.getLocation());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setExperience(job.getExperience());

        if (job.getJobType() != null) {

            response.setJobType(
                    job.getJobType().name()
            );
        }

        if (job.getWorkMode() != null) {

            response.setWorkMode(
                    job.getWorkMode().name()
            );
        }

        response.setVacancies(job.getVacancies());
        response.setDeadline(job.getDeadline());

        if (job.getStatus() != null) {

            response.setStatus(
                    job.getStatus().name()
            );
        }

        if (job.getRecruiter() != null) {

            response.setRecruiterId(
                    job.getRecruiter().getId()
            );
        }

        if (job.getCompany() != null) {

            response.setCompanyId(
                    job.getCompany().getId()
            );

            response.setCompanyName(
                    job.getCompany().getName()
            );
        }

        if (job.getCategory() != null) {

            response.setCategoryId(
                    job.getCategory().getId()
            );

            response.setCategoryName(
                    job.getCategory().getName()
            );
        }

        return response;
    }
}