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
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Tag,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface AdminTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  submitter: {
    name: string;
    role: 'student' | 'parent' | 'staff';
    id: string;
  };
  assignee?: {
    name: string;
    department: string;
  };
  createdAt: string;
  updatedAt: string;
  resolutionTime?: number; // in hours
  satisfactionRating?: number; // 1-5
  department: string;
}

export default function AdminTicketsScreen() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const mockTickets: AdminTicket[] = [
    {
      id: 'ADM001',
      title: 'Campus WiFi Connectivity Issues',
      description: 'Multiple students reporting intermittent WiFi disconnections in dormitory buildings',
      category: 'Technical',
      priority: 'high',
      status: 'in-progress',
      submitter: { name: 'John Doe', role: 'student', id: 'STU001' },
      assignee: { name: 'Mike Johnson', department: 'IT Support' },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:45:00Z',
      resolutionTime: 28,
      department: 'IT',
    },
    {
      id: 'ADM002',
      title: 'Library Book Request - Advanced Physics',
      description: 'Request for additional copies of "Quantum Mechanics and Path Integrals"',
      category: 'Library',
      priority: 'medium',
      status: 'resolved',
      submitter: { name: 'Sarah Smith', role: 'student', id: 'STU002' },
      assignee: { name: 'Lisa Chen', department: 'Library Services' },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T16:20:00Z',
      resolutionTime: 7,
      satisfactionRating: 5,
      department: 'Library',
    },
    {
      id: 'ADM003',
      title: 'Cafeteria Food Quality Complaint',
      description: 'Poor food quality and hygiene concerns raised by multiple students',
      category: 'Facilities',
      priority: 'urgent',
      status: 'open',
      submitter: { name: 'Emma Wilson', role: 'parent', id: 'PAR001' },
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
      department: 'Facilities',
    },
    {
      id: 'ADM004',
      title: 'Grade Dispute - Mathematics 201',
      description: 'Student requesting review of final examination grade calculation',
      category: 'Academic',
      priority: 'medium',
      status: 'assigned',
      submitter: { name: 'Alex Johnson', role: 'student', id: 'STU003' },
      assignee: { name: 'Dr. Patricia Davis', department: 'Academic Affairs' },
      createdAt: '2024-01-13T14:22:00Z',
      updatedAt: '2024-01-14T09:10:00Z',
      department: 'Academic',
    },
    {
      id: 'ADM005',
      title: 'Dormitory Heating System Malfunction',
      description: 'Heating system not working properly in Building C, rooms 201-220',
      category: 'Maintenance',
      priority: 'high',
      status: 'closed',
      submitter: { name: 'David Brown', role: 'staff', id: 'STF001' },
      assignee: { name: 'Robert Wilson', department: 'Facilities' },
      createdAt: '2024-01-12T08:45:00Z',
      updatedAt: '2024-01-14T17:30:00Z',
      resolutionTime: 56,
      satisfactionRating: 4,
      department: 'Facilities',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'assigned': return '#F59E0B';
      case 'in-progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'assigned': return Clock;
      case 'in-progress': return RefreshCw;
      case 'resolved': return CheckCircle;
      case 'closed': return XCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return '#3B82F6';
      case 'parent': return '#10B981';
      case 'staff': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const filteredTickets = mockTickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    return true;
  });

  const ticketStats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    inProgress: mockTickets.filter(t => t.status === 'in-progress').length,
    resolved: mockTickets.filter(t => t.status === 'resolved').length,
    avgResolutionTime: Math.round(
      mockTickets.filter(t => t.resolutionTime).reduce((sum, t) => sum + (t.resolutionTime || 0), 0) /
      mockTickets.filter(t => t.resolutionTime).length
    ),
    avgSatisfaction: (
      mockTickets.filter(t => t.satisfactionRating).reduce((sum, t) => sum + (t.satisfactionRating || 0), 0) /
      mockTickets.filter(t => t.satisfactionRating).length
    ).toFixed(1),
  };

  const TicketCard = ({ item }: { item: AdminTicket }) => {
    const StatusIcon = getStatusIcon(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.ticketCard}
        onPress={() => router.push('/ticket-detail')}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketTitleRow}>
            <Text style={styles.ticketId}>#{item.id}</Text>
            <View style={styles.ticketActions}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical color="#6B7280" size={16} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.ticketTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.ticketDescription} numberOfLines={2}>{item.description}</Text>
        </View>

        <View style={styles.ticketMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <User color="#6B7280" size={14} />
              <Text style={[styles.metaText, { color: getRoleColor(item.submitter.role) }]}>
                {item.submitter.name}
              </Text>
              <Text style={styles.roleText}>({item.submitter.role})</Text>
            </View>
            <View style={styles.metaItem}>
              <Tag color="#6B7280" size={14} />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar color="#6B7280" size={14} />
              <Text style={styles.metaText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {item.assignee && (
              <View style={styles.metaItem}>
                <User color="#6B7280" size={14} />
                <Text style={styles.metaText}>{item.assignee.name}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.ticketFooter}>
          <View style={styles.statusContainer}>
            <StatusIcon color={getStatusColor(item.status)} size={16} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
          <View style={styles.departmentBadge}>
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
        </View>

        {item.resolutionTime && (
          <View style={styles.performanceRow}>
            <Text style={styles.performanceText}>
              Resolved in {item.resolutionTime}h
            </Text>
            {item.satisfactionRating && (
              <Text style={styles.ratingText}>
                ⭐ {item.satisfactionRating}/5
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const StatCard = ({ title, value, subtitle, color, icon: Icon }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon color={color} size={20} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>All Tickets</Text>
          <Text style={styles.headerSubtitle}>System-wide ticket monitoring and management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Download color="white" size={18} />
              <Text style={styles.headerButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total"
              value={ticketStats.total}
              color="#7C3AED"
              icon={Tag}
            />
            <StatCard
              title="Open"
              value={ticketStats.open}
              color="#EF4444"
              icon={AlertCircle}
            />
            <StatCard
              title="In Progress"
              value={ticketStats.inProgress}
              color="#3B82F6"
              icon={RefreshCw}
            />
            <StatCard
              title="Resolved"
              value={ticketStats.resolved}
              color="#10B981"
              icon={CheckCircle}
            />
          </View>
          <View style={styles.performanceStats}>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>{ticketStats.avgResolutionTime}h</Text>
              <Text style={styles.performanceLabel}>Avg Resolution Time</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>{ticketStats.avgSatisfaction}</Text>
              <Text style={styles.performanceLabel}>Avg Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#7C3AED" />
              <Text style={styles.filterText}>Department</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Tag size={16} color="#7C3AED" />
              <Text style={styles.filterText}>Priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Clock size={16} color="#7C3AED" />
              <Text style={styles.filterText}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Search size={16} color="#7C3AED" />
              <Text style={styles.filterText}>Search</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tickets List */}
        <View style={styles.ticketsList}>
          {filteredTickets.map((item) => (
            <TicketCard key={item.id} item={item} />
          ))}
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
  scrollContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  performanceStats: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterScroll: {
    paddingHorizontal: 20,
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
    marginRight: 12,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  ticketsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    marginBottom: 16,
  },
  ticketTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  moreButton: {
    padding: 4,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ticketMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  roleText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  departmentBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  departmentText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  performanceText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
  },
  ratingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '500',
  },
});
