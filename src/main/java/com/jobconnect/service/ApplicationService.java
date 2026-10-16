package com.jobconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobconnect.entity.Application;
import com.jobconnect.entity.Notification;
import com.jobconnect.entity.User;
import com.jobconnect.enums.ApplicationStatus;
import com.jobconnect.repository.ApplicationRepository;

@Service
public class ApplicationService {


private final ApplicationRepository applicationRepository;
private final NotificationService notificationService;

public ApplicationService(
        ApplicationRepository applicationRepository,
        NotificationService notificationService) {
    this.applicationRepository = applicationRepository;
    this.notificationService = notificationService;
}

@Transactional
public Application saveApplication(Application application) {

    Application savedApplication = applicationRepository.save(application);

    User recruiterUser = savedApplication.getJob()
            .getRecruiter()
            .getUser();

    Notification notification = new Notification();
    notification.setUser(recruiterUser);
    notification.setMessage(
            "New application received for the job '"
            + savedApplication.getJob().getTitle()
            + "'.");
    notification.setIsRead(false);

    notificationService.saveNotification(notification);

    return savedApplication;
}

public Optional<Application> getApplicationById(Long id) {
    return applicationRepository.findById(id);
}

public List<Application> getApplicationsBySeeker(Long seekerId) {
    return applicationRepository.findBySeekerId(seekerId);
}

public List<Application> getApplicationsByJob(Long jobId) {
    return applicationRepository.findByJobId(jobId);
}

public List<Application> getApplicationsByStatus(ApplicationStatus status) {
    return applicationRepository.findByStatus(status);
}

public boolean applicationExists(Long jobId, Long seekerId) {
    return applicationRepository.existsByJobIdAndSeekerId(jobId, seekerId);
}

public List<Application> getAllApplications() {
    return applicationRepository.findAll();
}

public void deleteApplication(Long id) {
    applicationRepository.deleteById(id);
}

public boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId) {
    return applicationRepository.existsByJobIdAndSeekerId(jobId, seekerId);
}

public List<Application> getApplicationsBySeekerId(Long seekerId) {
    return applicationRepository.findBySeekerId(seekerId);
}

public List<Application> getApplicationsByJobId(Long jobId) {
    return applicationRepository.findByJobId(jobId);
}

@Transactional
public Application updateApplicationStatus(
        Long applicationId,
        ApplicationStatus status) {

    Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    application.setStatus(status);
    Application updatedApplication =
            applicationRepository.save(application);

    User user = application.getSeeker().getUser();

    String message =
            "Your application status for the job '"
            + application.getJob().getTitle()
            + "' has been updated to "
            + status
            + ".";

    Notification notification = new Notification();
    notification.setUser(user);
    notification.setMessage(message);
    notification.setIsRead(false);

    notificationService.saveNotification(notification);

    return updatedApplication;
}


}
