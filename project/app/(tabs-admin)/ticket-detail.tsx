import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Tag,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Star,
  Send,
  Paperclip,
  MoreVertical,
  Users,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface TicketUpdate {
  id: string;
  author: string;
  role: 'student' | 'parent' | 'ops' | 'admin';
  message: string;
  timestamp: string;
  attachments?: string[];
  isInternal?: boolean;
}

interface TicketDetail {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  department: string;
  submittedBy: string;
  submitterRole: 'student' | 'parent';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolutionTime?: number;
  satisfactionRating?: number;
  location?: string;
  tags: string[];
  updates: TicketUpdate[];
}

export default function TicketDetailScreen() {
  const [newMessage, setNewMessage] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  // Mock ticket data - in real app this would come from route params or API
  const ticket: TicketDetail = {
    id: 'TK-001',
    title: 'Wi-Fi connectivity issues in Library',
    description: 'I am experiencing frequent disconnections from the campus Wi-Fi network while working in the main library. The issue occurs every 10-15 minutes and requires me to reconnect manually. This is affecting my ability to complete online research and submit assignments.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Technical Support',
    department: 'IT Support',
    submittedBy: 'John Doe',
    submitterRole: 'student',
    assignedTo: 'Sarah Wilson',
    createdAt: '2024-03-15T09:30:00Z',
    updatedAt: '2024-03-15T14:45:00Z',
    location: 'Main Library - 2nd Floor',
    tags: ['networking', 'wifi', 'library'],
    updates: [
      {
        id: '1',
        author: 'John Doe',
        role: 'student',
        message: 'Initial ticket submission. Problem started yesterday around 2 PM.',
        timestamp: '2024-03-15T09:30:00Z',
      },
      {
        id: '2',
        author: 'Michael Chen',
        role: 'parent',
        message: 'As John\'s parent, I wanted to add that he mentioned this issue is also affecting other students in his study group. They are all having trouble accessing online resources.',
        timestamp: '2024-03-15T11:15:00Z',
      },
      {
        id: '3',
        author: 'Sarah Wilson',
        role: 'ops',
        message: 'Thank you for reporting this issue. I\'ve assigned this ticket to our networking team. We\'re aware of some infrastructure upgrades happening this week that might be causing intermittent connectivity issues.',
        timestamp: '2024-03-15T12:30:00Z',
      },
      {
        id: '4',
        author: 'IT Support Team',
        role: 'ops',
        message: 'We\'ve identified the root cause - a faulty access point on the 2nd floor. Replacement is scheduled for tomorrow morning. In the meantime, please try connecting to the "Campus-Guest" network which should be more stable.',
        timestamp: '2024-03-15T14:45:00Z',
        isInternal: false,
      },
      {
        id: '5',
        author: 'Sarah Wilson',
        role: 'ops',
        message: 'Internal note: Access point AP-LIB-002 needs replacement. Parts ordered, installation scheduled for 8 AM tomorrow.',
        timestamp: '2024-03-15T14:50:00Z',
        isInternal: true,
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in-progress': return RefreshCw;
      case 'resolved': return CheckCircle;
      case 'closed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in-progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'urgent': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return '#3B82F6';
      case 'parent': return '#10B981';
      case 'ops': return '#F59E0B';
      case 'admin': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      Alert.alert('Message Sent', 'Your update has been added to the ticket');
      setNewMessage('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    Alert.alert('Status Updated', `Ticket status changed to ${newStatus}`);
  };

  const StatusIcon = getStatusIcon(ticket.status);

  const UpdateCard = ({ update }: { update: TicketUpdate }) => {
    if (update.isInternal && !showInternalNotes) return null;

    return (
      <View style={[styles.updateCard, update.isInternal && styles.internalUpdate]}>
        <View style={styles.updateHeader}>
          <View style={styles.authorInfo}>
            <View style={[styles.roleIndicator, { backgroundColor: getRoleColor(update.role) }]}>
              <User color="white" size={12} />
            </View>
            <View>
              <Text style={styles.authorName}>{update.author}</Text>
              <Text style={styles.authorRole}>{update.role.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.updateMeta}>
            {update.isInternal && (
              <Text style={styles.internalLabel}>INTERNAL</Text>
            )}
            <Text style={styles.updateTime}>{formatTimestamp(update.timestamp)}</Text>
          </View>
        </View>
        <Text style={styles.updateMessage}>{update.message}</Text>
        {update.attachments && update.attachments.length > 0 && (
          <View style={styles.attachments}>
            {update.attachments.map((attachment, index) => (
              <TouchableOpacity key={index} style={styles.attachment}>
                <Paperclip color="#7C3AED" size={14} />
                <Text style={styles.attachmentName}>{attachment}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>#{ticket.id}</Text>
            <Text style={styles.headerSubtitle}>{ticket.title}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical color="white" size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <StatusIcon color={getStatusColor(ticket.status)} size={16} />
              <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
              <Text style={styles.priorityText}>{ticket.priority.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <Text style={styles.ticketDescription}>{ticket.description}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <User color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Submitted by</Text>
                <Text style={styles.metaValue}>{ticket.submittedBy} ({ticket.submitterRole})</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Users color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Assigned to</Text>
                <Text style={styles.metaValue}>{ticket.assignedTo || 'Unassigned'}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Tag color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Category</Text>
                <Text style={styles.metaValue}>{ticket.category}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <MapPin color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>{ticket.location || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Calendar color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatTimestamp(ticket.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Clock color="#7C3AED" size={16} />
              <View>
                <Text style={styles.metaLabel}>Last updated</Text>
                <Text style={styles.metaValue}>{formatTimestamp(ticket.updatedAt)}</Text>
              </View>
            </View>
          </View>

          {ticket.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsLabel}>Tags:</Text>
              <View style={styles.tags}>
                {ticket.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleStatusChange('in-progress')}
            >
              <RefreshCw color="#3B82F6" size={18} />
              <Text style={styles.actionText}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleStatusChange('resolved')}
            >
              <CheckCircle color="#10B981" size={18} />
              <Text style={styles.actionText}>Resolve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <User color="#F59E0B" size={18} />
              <Text style={styles.actionText}>Reassign</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Star color="#EF4444" size={18} />
              <Text style={styles.actionText}>Priority</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Updates Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>Updates & Communication</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowInternalNotes(!showInternalNotes)}
            >
              <Text style={styles.toggleText}>
                {showInternalNotes ? 'Hide Internal' : 'Show Internal'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeline}>
            {ticket.updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </View>
        </View>

        {/* Add Response */}
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>Add Response</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your response or update..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={styles.responseActions}>
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip color="#7C3AED" size={18} />
              <Text style={styles.attachText}>Attach</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Send color="white" size={18} />
              <Text style={styles.sendText}>Send Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  ticketDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaGrid: {
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tagsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  timelineCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
  },
  toggleText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  timeline: {
    gap: 16,
  },
  updateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  internalUpdate: {
    backgroundColor: '#FEF3C7',
    borderLeftColor: '#F59E0B',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  authorRole: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  updateMeta: {
    alignItems: 'flex-end',
  },
  internalLabel: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: 'bold',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  updateMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  attachments: {
    marginTop: 12,
    gap: 8,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  attachmentName: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '500',
  },
  responseCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  attachText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
  },
  sendText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});
