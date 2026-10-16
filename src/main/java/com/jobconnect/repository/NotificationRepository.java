
package com.jobconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobconnect.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId")
    List<Notification> findByUserId(
            @Param("userId") Long userId
    );

    @Query("""
           SELECT n FROM Notification n
           WHERE n.user.id = :userId
           AND n.isRead = false
           """)
    List<Notification> findByUserIdAndIsReadFalse(
            @Param("userId") Long userId
    );

    // Count unread notifications for the navbar badge
    @Query("""
           SELECT COUNT(n) FROM Notification n
           WHERE n.user.id = :userId
           AND n.isRead = false
           """)
    long countUnreadByUserId(
            @Param("userId") Long userId
    );
}
