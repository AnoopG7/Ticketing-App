import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Filter,
  Search,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  CheckCircle,
  Play,
  MoreHorizontal,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface QueueTicket {
  id: string;
  title: string;
  description: string;
  student: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'technical' | 'academic' | 'financial' | 'general';
  status: 'unassigned' | 'assigned' | 'in-progress' | 'pending-review';
  createdAt: string;
  assignedTo?: string;
  estimatedTime: string;
  tags: string[];
}

const mockQueueTickets: QueueTicket[] = [
  {
    id: 'T001',
    title: 'Cannot access exam portal',
    description: 'Student unable to log into final exam portal, getting error 403',
    student: 'John Doe',
    priority: 'urgent',
    category: 'technical',
    status: 'unassigned',
    createdAt: '2024-01-16T10:30:00Z',
    estimatedTime: '30 min',
    tags: ['portal', 'exam', 'login'],
  },
  {
    id: 'T002',
    title: 'Grade not updated in transcript',
    description: 'Final grade for Chemistry 101 not reflecting in official transcript',
    student: 'Sarah Smith',
    priority: 'high',
    category: 'academic',
    status: 'assigned',
    assignedTo: 'Mike Johnson',
    createdAt: '2024-01-16T09:45:00Z',
    estimatedTime: '45 min',
    tags: ['transcript', 'grades', 'chemistry'],
  },
  {
    id: 'T003',
    title: 'Library book fine dispute',
    description: 'Student claims book was returned on time but system shows late fee',
    student: 'Alex Johnson',
    priority: 'medium',
    category: 'financial',
    status: 'in-progress',
    assignedTo: 'Sarah Wilson',
    createdAt: '2024-01-16T08:20:00Z',
    estimatedTime: '20 min',
    tags: ['library', 'fine', 'dispute'],
  },
  {
    id: 'T004',
    title: 'Course enrollment issue',
    description: 'Unable to enroll in required course showing as full despite available spots',
    student: 'Emma Davis',
    priority: 'high',
    category: 'academic',
    status: 'unassigned',
    createdAt: '2024-01-16T10:15:00Z',
    estimatedTime: '25 min',
    tags: ['enrollment', 'course', 'registration'],
  },
  {
    id: 'T005',
    title: 'Meal plan not activated',
    description: 'Student card not working at dining hall despite payment confirmation',
    student: 'Chris Wilson',
    priority: 'medium',
    category: 'general',
    status: 'unassigned',
    createdAt: '2024-01-16T09:30:00Z',
    estimatedTime: '15 min',
    tags: ['dining', 'meal-plan', 'card'],
  },
  {
    id: 'T006',
    title: 'Scholarship status inquiry',
    description: 'Need clarification on scholarship disbursement schedule',
    student: 'Taylor Brown',
    priority: 'low',
    category: 'financial',
    status: 'assigned',
    assignedTo: 'Lisa Chen',
    createdAt: '2024-01-16T07:45:00Z',
    estimatedTime: '35 min',
    tags: ['scholarship', 'financial-aid', 'disbursement'],
  },
];

export default function OpsQueueScreen() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'queue' | 'assigned'>('queue');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned': return '#6B7280';
      case 'assigned': return '#3B82F6';
      case 'in-progress': return '#F59E0B';
      case 'pending-review': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unassigned': return <AlertTriangle size={16} color="#6B7280" />;
      case 'assigned': return <User size={16} color="#3B82F6" />;
      case 'in-progress': return <Clock size={16} color="#F59E0B" />;
      case 'pending-review': return <CheckCircle size={16} color="#8B5CF6" />;
      default: return <AlertTriangle size={16} color="#6B7280" />;
    }
  };

  const filteredTickets = mockQueueTickets.filter(ticket => {
    if (activeTab === 'queue' && ticket.status !== 'unassigned') return false;
    if (activeTab === 'assigned' && (ticket.status === 'unassigned' || ticket.assignedTo !== 'Sarah Wilson')) return false;
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
    return true;
  });

  const handleAssignTicket = (ticketId: string) => {
    Alert.alert(
      'Assign Ticket',
      'Take this ticket and start working on it?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Assign to Me', 
          onPress: () => {
            Alert.alert('Success', 'Ticket assigned to you successfully');
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const TicketCard = ({ ticket }: { ticket: QueueTicket }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTitleRow}>
          <Text style={styles.ticketId}>#{ticket.id}</Text>
          <View style={styles.ticketBadges}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                {ticket.priority.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
              {getStatusIcon(ticket.status)}
              <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.ticketTitle}>{ticket.title}</Text>
      </View>

      <Text style={styles.ticketDescription} numberOfLines={2}>
        {ticket.description}
      </Text>

      <View style={styles.ticketMeta}>
        <View style={styles.metaRow}>
          <User size={14} color="#6B7280" />
          <Text style={styles.metaText}>{ticket.student}</Text>
        </View>
        <View style={styles.metaRow}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.metaText}>{formatDate(ticket.createdAt)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.metaText}>~{ticket.estimatedTime}</Text>
        </View>
      </View>

      <View style={styles.ticketTags}>
        {ticket.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ticketActions}>
        {ticket.status === 'unassigned' ? (
          <TouchableOpacity 
            style={styles.assignButton}
            onPress={() => handleAssignTicket(ticket.id)}
          >
            <Play size={16} color="white" />
            <Text style={styles.assignButtonText}>Take Ticket</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.assignedInfo}>
            <Text style={styles.assignedText}>
              Assigned to: {ticket.assignedTo === 'Sarah Wilson' ? 'You' : ticket.assignedTo}
            </Text>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const queueStats = {
    total: mockQueueTickets.length,
    unassigned: mockQueueTickets.filter(t => t.status === 'unassigned').length,
    myAssigned: mockQueueTickets.filter(t => t.assignedTo === 'Sarah Wilson').length,
    urgent: mockQueueTickets.filter(t => t.priority === 'urgent').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.header}>
        <Text style={styles.headerTitle}>Ticket Queue</Text>
        <Text style={styles.headerSubtitle}>
          Manage and assign support tickets
        </Text>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{queueStats.unassigned}</Text>
            <Text style={styles.statLabel}>Unassigned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{queueStats.myAssigned}</Text>
            <Text style={styles.statLabel}>My Tickets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{queueStats.urgent}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'queue' && styles.activeTab]}
          onPress={() => setActiveTab('queue')}
        >
          <Text style={[styles.tabText, activeTab === 'queue' && styles.activeTabText]}>
            Available Queue ({queueStats.unassigned})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
          onPress={() => setActiveTab('assigned')}
        >
          <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>
            My Assigned ({queueStats.myAssigned})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#F59E0B" />
          <Text style={styles.filterText}>Priority</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Search size={16} color="#F59E0B" />
          <Text style={styles.filterText}>Category</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tickets found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'queue' 
                ? 'All available tickets have been assigned' 
                : 'You have no assigned tickets at the moment'}
            </Text>
          </View>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  tabContainer: {
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
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FEF3C7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#F59E0B',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    marginBottom: 12,
  },
  ticketTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  ticketBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  ticketTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  ticketActions: {
    marginTop: 8,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  assignedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignedText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
