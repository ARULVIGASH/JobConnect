package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobconnect.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByRecruiterId(Long recruiterId);

}