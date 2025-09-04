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
import { ArrowLeft, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, User, MessageCircle, Send, Camera } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface Comment {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
  isOwner: boolean;
}

interface TicketDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  location?: string;
  comments: Comment[];
}

const mockTicket: TicketDetails = {
  id: '1',
  title: 'Cannot access online course materials',
  description: 'I am unable to access the course materials for CS101. When I click on the course link, it shows an error message saying "Access Denied". This has been happening since yesterday and I need to access the materials for tomorrow\'s exam.',
  category: 'Academic',
  status: 'in-progress',
  priority: 'high',
  createdAt: '2024-01-15 09:30 AM',
  updatedAt: '2024-01-15 02:15 PM',
  assignee: 'Dr. Sarah Wilson',
  location: 'Computer Science Building',
  comments: [
    {
      id: '1',
      author: 'Dr. Sarah Wilson',
      role: 'Academic Coordinator',
      message: 'Hi John, I\'ve received your ticket. I\'m checking with the IT department about the access issue. We should have this resolved within the next few hours.',
      timestamp: '2024-01-15 10:45 AM',
      isOwner: false,
    },
    {
      id: '2',
      author: 'You',
      role: 'Student',
      message: 'Thank you for the quick response! Just wanted to mention that other students in my class are also experiencing the same issue.',
      timestamp: '2024-01-15 11:20 AM',
      isOwner: true,
    },
  ],
};

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const [ticket] = useState<TicketDetails>(mockTicket);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#EF4444';
      case 'in-progress':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      case 'closed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle color="#EF4444" size={20} />;
      case 'in-progress':
        return <Clock color="#F59E0B" size={20} />;
      case 'resolved':
      case 'closed':
        return <CheckCircle color="#10B981" size={20} />;
      default:
        return <Clock color="#6B7280" size={20} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setNewComment('');
      Alert.alert('Success', 'Your comment has been added!');
    }, 1000);
  };

  const CommentItem = ({ comment }: { comment: Comment }) => (
    <View style={[
      styles.commentItem,
      comment.isOwner && styles.ownerComment
    ]}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAuthor}>
          <User color={comment.isOwner ? '#3B82F6' : '#6B7280'} size={16} />
          <Text style={styles.authorName}>{comment.author}</Text>
          <Text style={styles.authorRole}>• {comment.role}</Text>
        </View>
        <Text style={styles.commentTime}>{comment.timestamp}</Text>
      </View>
      <Text style={styles.commentMessage}>{comment.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket #{ticket.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.statusContainer}>
              {getStatusIcon(ticket.status)}
              <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
              <Text style={styles.priorityText}>{ticket.priority.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <Text style={styles.ticketCategory}>{ticket.category}</Text>
          
          <View style={styles.ticketMeta}>
            <Text style={styles.metaItem}>Created: {ticket.createdAt}</Text>
            <Text style={styles.metaItem}>Updated: {ticket.updatedAt}</Text>
            {ticket.assignee && (
              <Text style={styles.metaItem}>Assigned to: {ticket.assignee}</Text>
            )}
            {ticket.location && (
              <Text style={styles.metaItem}>Location: {ticket.location}</Text>
            )}
          </View>

          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.ticketDescription}>{ticket.description}</Text>
        </View>

        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <MessageCircle color="#1F2937" size={20} />
            <Text style={styles.commentsTitle}>
              Comments ({ticket.comments.length})
            </Text>
          </View>

          {ticket.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.commentInput}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            numberOfLines={2}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.attachButton}>
              <Camera color="#6B7280" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.sendButton,
                newComment.trim() && styles.sendButtonActive
              ]}
              onPress={handleSendComment}
              disabled={!newComment.trim() || loading}
            >
              <Send color={newComment.trim() ? 'white' : '#9CA3AF'} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  ticketCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  ticketCategory: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 16,
  },
  ticketMeta: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  metaItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  commentsSection: {
    margin: 20,
    marginTop: 0,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  commentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ownerComment: {
    borderLeftColor: '#3B82F6',
    backgroundColor: '#F8FAFF',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  authorRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  commentInput: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 80,
    minHeight: 20,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  attachButton: {
    padding: 8,
    borderRadius: 6,
  },
  sendButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
});