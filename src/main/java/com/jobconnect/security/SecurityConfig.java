package com.jobconnect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // AUTHENTICATION
                .requestMatchers("/api/auth/**").permitAll()

                // PUBLIC JOBS
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs",
                    "/api/jobs/**"
                ).permitAll()

                // PUBLIC CATEGORIES
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/categories",
                    "/api/categories/**"
                ).permitAll()

                // JOB SEEKER ROUTES
                .requestMatchers("/api/job-seekers/user/**")
                    .hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/job-seekers/**"
                ).hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/applications"
                ).hasRole("JOB_SEEKER")

                .requestMatchers("/api/applications/seeker/**")
                    .hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/saved-jobs"
                ).hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/saved-jobs/**"
                ).hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/saved-jobs/**"
                ).hasRole("JOB_SEEKER")

                // RESUME ROUTES
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/resumes/upload"
                ).hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/resumes/seeker/**"
                ).hasRole("JOB_SEEKER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/resumes/download/**"
                ).hasRole("RECRUITER")

                // RECRUITER ROUTES
                .requestMatchers("/api/recruiters/user/**")
                    .hasRole("RECRUITER")

                .requestMatchers("/api/recruiter/dashboard/**")
                    .hasRole("RECRUITER")

                .requestMatchers(
                    "/api/companies",
                    "/api/companies/**"
                ).hasRole("RECRUITER")

                .requestMatchers("/api/applications/job/**")
                    .hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/applications/*/status"
                ).hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs/recruiter/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/jobs"
                ).hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/jobs/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/jobs/**"
                ).hasRole("RECRUITER")

                // ADMIN ROUTES
                .requestMatchers("/api/admin/dashboard")
                    .hasRole("ADMIN")

                .requestMatchers("/api/admin/jobs/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/admin/applications/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/admin/categories/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/users/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/job-seekers/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/recruiters/**")
                    .hasRole("ADMIN")

                // NOTIFICATIONS
                .requestMatchers("/api/notifications/**")
                    .authenticated()

                // EVERYTHING ELSE
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

