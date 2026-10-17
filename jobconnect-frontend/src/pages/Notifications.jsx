
import { useEffect, useState } from 'react'
import api from '../services/api'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [processingId, setProcessingId] = useState(null)

  const role = localStorage.getItem('role')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/notifications/me')

      setNotifications(
        Array.isArray(response.data) ? response.data : []
      )
    } catch (err) {
      console.error('Notification error:', err)
      setError(
        'Failed to load notifications. Please log in again if your session has expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      setProcessingId(notificationId)
      setActionError('')

      await api.put(`/notifications/${notificationId}/read`)

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Mark as read error:', err)
      setActionError('Could not mark the notification as read.')
    } finally {
      setProcessingId(null)
    }
  }

  const deleteNotification = async (notificationId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this notification?'
    )

    if (!confirmed) return

    try {
      setProcessingId(notificationId)
      setActionError('')

      await api.delete(`/notifications/${notificationId}`)

      setNotifications((previous) =>
        previous.filter(
          (notification) => notification.id !== notificationId
        )
      )
    } catch (err) {
      console.error('Delete notification error:', err)
      setActionError('Could not delete the notification.')
    } finally {
      setProcessingId(null)
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length

  if (loading) {
    return <div style={{ padding: '30px' }}>Loading notifications...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '30px' }}>
        <h2>{error}</h2>
        <button onClick={loadNotifications}>Try Again</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1>🔔 Notifications</h1>

      <p>
        Unread notifications: <strong>{unreadCount}</strong>
      </p>

      {actionError && (
        <p role="alert" style={styles.error}>
          {actionError}
        </p>
      )}

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              ...styles.card,
              backgroundColor: notification.isRead
                ? '#f5f5f5'
                : '#fff8dc',
              opacity:
                processingId === notification.id ? 0.7 : 1,
            }}
          >
            <h3>
              {notification.isRead ? '🔔' : '🔴'} Notification
            </h3>

            <p>{notification.message}</p>

            <p>
              <strong>Status:</strong>{' '}
              {notification.isRead ? 'Read' : 'Unread'}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {notification.createdAt
                ? new Date(notification.createdAt).toLocaleString()
                : 'Not available'}
            </p>

            <div style={styles.actions}>
              {!notification.isRead && (
                <button
                  style={styles.readButton}
                  disabled={processingId === notification.id}
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}

              <button
                type="button"
                style={styles.deleteButton}
                disabled={processingId === notification.id}
                onClick={() => deleteNotification(notification.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    border: '1px solid #ddd',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '12px',
  },
  readButton: {
    padding: '8px 12px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '9px 14px',
    cursor: 'pointer',
  },
  error: {
    color: 'crimson',
    marginBottom: '15px',
  },
}

export default Notifications

