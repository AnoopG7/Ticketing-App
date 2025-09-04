import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Bell,
  BellDot,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  User,
  MessageSquare,
  Settings,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Notification {
  id: string;
  type: 'ticket_update' | 'system' | 'reminder' | 'grade' | 'event';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  relatedChild?: string;
  actionRequired?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'ticket_update',
    title: 'Ticket Update: Portal Access Issue',
    message: 'Tech Support Team has responded to your ticket #T001 regarding portal access issues.',
    timestamp: '2024-01-16T14:30:00Z',
    isRead: false,
    priority: 'high',
    relatedChild: 'Emma Johnson',
    actionRequired: true,
  },
  {
    id: 'N002',
    type: 'grade',
    title: 'New Grade Posted',
    message: 'A new grade has been posted for Math Quiz in Emma\'s account.',
    timestamp: '2024-01-16T11:15:00Z',
    isRead: false,
    priority: 'medium',
    relatedChild: 'Emma Johnson',
  },
  {
    id: 'N003',
    type: 'event',
    title: 'School Event Reminder',
    message: 'Parent-Teacher Conference is scheduled for tomorrow at 3:00 PM.',
    timestamp: '2024-01-15T16:00:00Z',
    isRead: true,
    priority: 'medium',
    actionRequired: true,
  },
  {
    id: 'N004',
    type: 'system',
    title: 'System Maintenance Notice',
    message: 'The student portal will be under maintenance this Saturday from 2:00 AM to 6:00 AM.',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: true,
    priority: 'low',
  },
  {
    id: 'N005',
    type: 'reminder',
    title: 'Fee Payment Reminder',
    message: 'Monthly fee payment is due in 3 days. Please ensure timely payment to avoid late fees.',
    timestamp: '2024-01-14T09:00:00Z',
    isRead: false,
    priority: 'high',
    actionRequired: true,
  },
  {
    id: 'N006',
    type: 'ticket_update',
    title: 'Ticket Resolved: Bus Route Change',
    message: 'Your request for bus route change has been completed successfully.',
    timestamp: '2024-01-12T09:15:00Z',
    isRead: true,
    priority: 'medium',
    relatedChild: 'Emma Johnson',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'actionRequired'>('all');

  const getNotificationIcon = (type: string, isRead: boolean) => {
    const size = 20;
    const color = isRead ? '#6B7280' : '#059669';
    
    switch (type) {
      case 'ticket_update':
        return <MessageSquare size={size} color={color} />;
      case 'grade':
        return <CheckCircle size={size} color={color} />;
      case 'event':
        return <Calendar size={size} color={color} />;
      case 'reminder':
        return <AlertTriangle size={size} color={color} />;
      case 'system':
        return <Info size={size} color={color} />;
      default:
        return <Bell size={size} color={color} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'actionRequired') return notification.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#047857']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount} unread • {actionRequiredCount} action required
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <CheckCircle size={16} color="white" />
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'actionRequired' && styles.activeFilterTab]}
          onPress={() => setFilter('actionRequired')}
        >
          <Text style={[styles.filterText, filter === 'actionRequired' && styles.activeFilterText]}>
            Action Required ({actionRequiredCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'unread' ? 'All caught up!' : 'You\'ll see notifications here when they arrive.'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIconContainer}>
                  {getNotificationIcon(notification.type, notification.isRead)}
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationTitleRow}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.isRead && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    <View style={styles.notificationMeta}>
                      <View style={[
                        styles.priorityIndicator,
                        { backgroundColor: getPriorityColor(notification.priority) }
                      ]} />
                      <Text style={styles.timeText}>
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  
                  <View style={styles.notificationFooter}>
                    {notification.relatedChild && (
                      <View style={styles.childTag}>
                        <User size={12} color="#059669" />
                        <Text style={styles.childText}>{notification.relatedChild}</Text>
                      </View>
                    )}
                    {notification.actionRequired && (
                      <View style={styles.actionTag}>
                        <AlertTriangle size={12} color="#F59E0B" />
                        <Text style={styles.actionText}>Action Required</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  markAllText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#F0FDF4',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#059669',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    backgroundColor: '#F8FAFC',
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
    marginTop: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  unreadTitle: {
    color: '#111827',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  childText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#059669',
    marginLeft: 4,
  },
  actionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#F59E0B',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
