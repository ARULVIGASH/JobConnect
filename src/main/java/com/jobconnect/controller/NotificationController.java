
package com.jobconnect.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.jobconnect.dto.NotificationResponse;
import com.jobconnect.entity.Notification;
import com.jobconnect.entity.User;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        List<NotificationResponse> responses =
                notificationService.getNotificationsByUser(user.getId())
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/me/unread")
    public ResponseEntity<List<NotificationResponse>> getMyUnreadNotifications(
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        List<NotificationResponse> responses =
                notificationService.getUnreadNotifications(user.getId())
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/me/unread-count")
    public ResponseEntity<Long> getMyUnreadCount(
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadCount(user.getId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUser(
            @PathVariable Long userId,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        verifyOwnership(currentUser, userId);

        List<NotificationResponse> responses =
                notificationService.getNotificationsByUser(userId)
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable Long userId,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        verifyOwnership(currentUser, userId);

        List<NotificationResponse> responses =
                notificationService.getUnreadNotifications(userId)
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        Notification notification =
                notificationService.markAsRead(id, user.getId());

        return ResponseEntity.ok(convertToResponse(notification));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        Notification notification = notificationService
                .getNotificationById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notification not found"));

        verifyOwnership(user, notification.getUser().getId());

        return ResponseEntity.ok(convertToResponse(notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);

        notificationService.deleteNotification(id, user.getId());

        return ResponseEntity.noContent().build();
    }

    private void verifyOwnership(User currentUser, Long requestedUserId) {
        if (!currentUser.getId().equals(requestedUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's notifications");
        }
    }

    private NotificationResponse convertToResponse(
            Notification notification) {

        Long userId = notification.getUser() != null
                ? notification.getUser().getId()
                : null;

        return new NotificationResponse(
                notification.getId(),
                userId,
                notification.getApplicationId(),
                notification.getJobId(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}

