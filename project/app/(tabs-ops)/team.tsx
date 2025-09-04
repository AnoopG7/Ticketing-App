import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Calendar,
  TrendingUp,
  Filter,
  MoreVertical,
  User,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Phone,
} from 'lucide-react-native';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  assignedTickets: number;
  completedToday: number;
  avgResolutionTime: number; // in hours
  workloadCapacity: number; // percentage
  expertise: string[];
  performance: {
    thisWeek: number;
    lastWeek: number;
  };
}

interface WorkloadTicket {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unassigned' | 'assigned' | 'in-progress' | 'review' | 'completed';
  assignee?: string;
  estimatedTime: number; // in hours
  timeSpent: number; // in hours
  dueDate: string;
  createdAt: string;
  studentName: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Sarah Wilson',
    role: 'Senior Support',
    status: 'online',
    assignedTickets: 8,
    completedToday: 3,
    avgResolutionTime: 2.5,
    workloadCapacity: 75,
    expertise: ['Academic', 'Library', 'Technical'],
    performance: { thisWeek: 24, lastWeek: 20 },
  },
  {
    id: 'tm2',
    name: 'Mike Johnson',
    role: 'IT Support',
    status: 'busy',
    assignedTickets: 12,
    completedToday: 5,
    avgResolutionTime: 1.8,
    workloadCapacity: 90,
    expertise: ['Technical', 'System', 'Network'],
    performance: { thisWeek: 30, lastWeek: 28 },
  },
  {
    id: 'tm3',
    name: 'Lisa Chen',
    role: 'Academic Advisor',
    status: 'online',
    assignedTickets: 6,
    completedToday: 2,
    avgResolutionTime: 3.2,
    workloadCapacity: 60,
    expertise: ['Academic', 'Health', 'Counseling'],
    performance: { thisWeek: 18, lastWeek: 22 },
  },
  {
    id: 'tm4',
    name: 'David Brown',
    role: 'Facilities',
    status: 'offline',
    assignedTickets: 4,
    completedToday: 1,
    avgResolutionTime: 4.1,
    workloadCapacity: 40,
    expertise: ['Facilities', 'Maintenance', 'Security'],
    performance: { thisWeek: 12, lastWeek: 14 },
  },
];

const mockWorkloadTickets: WorkloadTicket[] = [
  {
    id: 'wt1',
    title: 'Library Access Card Not Working',
    category: 'Library',
    priority: 'high',
    status: 'unassigned',
    estimatedTime: 1,
    timeSpent: 0,
    dueDate: '2024-01-16',
    createdAt: '2024-01-15T14:30:00Z',
    studentName: 'Emma Doe',
  },
  {
    id: 'wt2',
    title: 'WiFi Connection Issues in Dorm',
    category: 'Technical',
    priority: 'urgent',
    status: 'assigned',
    assignee: 'tm2',
    estimatedTime: 2,
    timeSpent: 0.5,
    dueDate: '2024-01-15',
    createdAt: '2024-01-15T09:00:00Z',
    studentName: 'Alex Doe',
  },
  {
    id: 'wt3',
    title: 'Course Registration Help',
    category: 'Academic',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'tm3',
    estimatedTime: 1.5,
    timeSpent: 1,
    dueDate: '2024-01-17',
    createdAt: '2024-01-14T11:00:00Z',
    studentName: 'John Smith',
  },
  {
    id: 'wt4',
    title: 'Classroom Projector Repair',
    category: 'Facilities',
    priority: 'low',
    status: 'review',
    assignee: 'tm4',
    estimatedTime: 3,
    timeSpent: 2.5,
    dueDate: '2024-01-18',
    createdAt: '2024-01-13T08:00:00Z',
    studentName: 'System Request',
  },
];

export default function OpsTeamScreen() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [tickets, setTickets] = useState<WorkloadTicket[]>(mockWorkloadTickets);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'workload' | 'performance'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
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

  const getWorkloadColor = (capacity: number) => {
    if (capacity >= 90) return '#DC2626';
    if (capacity >= 75) return '#F59E0B';
    if (capacity >= 50) return '#10B981';
    return '#6B7280';
  };

  const getPerformanceTrend = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = Math.abs(Math.round((change / previous) * 100));
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage,
      color: change >= 0 ? '#10B981' : '#EF4444',
    };
  };

  const handleAssignTicket = (ticketId: string, memberId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, assignee: memberId, status: 'assigned' }
          : ticket
      )
    );
    Alert.alert('Success', 'Ticket assigned successfully');
  };

  const handleContactMember = (member: TeamMember, method: 'message' | 'call') => {
    Alert.alert(
      method === 'message' ? 'Send Message' : 'Call Member',
      `${method === 'message' ? 'Messaging' : 'Calling'} ${member.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {} },
      ]
    );
  };

  const filteredTickets = selectedTeamMember === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.assignee === selectedTeamMember);

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'online').length,
    avgWorkload: Math.round(teamMembers.reduce((sum, member) => sum + member.workloadCapacity, 0) / teamMembers.length),
    totalTickets: tickets.length,
    unassignedTickets: tickets.filter(t => t.status === 'unassigned').length,
  };

  const renderTeamMemberCard = ({ item }: { item: TeamMember }) => {
    const performanceTrend = getPerformanceTrend(item.performance.thisWeek, item.performance.lastWeek);
    
    return (
      <TouchableOpacity style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <View style={styles.avatarContainer}>
              <User color="#6366F1" size={20} />
            </View>
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                <Text style={styles.statusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color="#6B7280" size={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.memberStats}>
          <View style={styles.memberStatItem}>
            <Text style={styles.memberStatNumber}>{item.assignedTickets}</Text>
            <Text style={styles.memberStatLabel}>Assigned</Text>
          </View>
          <View style={styles.memberStatItem}>
            <Text style={styles.memberStatNumber}>{item.completedToday}</Text>
            <Text style={styles.memberStatLabel}>Today</Text>
          </View>
          <View style={styles.memberStatItem}>
            <Text style={styles.memberStatNumber}>{item.avgResolutionTime}h</Text>
            <Text style={styles.memberStatLabel}>Avg Time</Text>
          </View>
          <View style={styles.memberStatItem}>
            <View style={styles.performanceIndicator}>
              <Text style={styles.memberStatNumber}>{item.performance.thisWeek}</Text>
              <View style={styles.trendContainer}>
                {performanceTrend.direction === 'up' ? 
                  <ArrowUp color={performanceTrend.color} size={12} /> :
                  <ArrowDown color={performanceTrend.color} size={12} />
                }
                <Text style={[styles.trendText, { color: performanceTrend.color }]}>
                  {performanceTrend.percentage}%
                </Text>
              </View>
            </View>
            <Text style={styles.memberStatLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.workloadContainer}>
          <View style={styles.workloadHeader}>
            <Text style={styles.workloadLabel}>Workload Capacity</Text>
            <Text style={[styles.workloadPercentage, { color: getWorkloadColor(item.workloadCapacity) }]}>
              {item.workloadCapacity}%
            </Text>
          </View>
          <View style={styles.workloadBar}>
            <View 
              style={[
                styles.workloadFill, 
                { 
                  width: `${item.workloadCapacity}%`,
                  backgroundColor: getWorkloadColor(item.workloadCapacity),
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.expertiseContainer}>
          {item.expertise.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.expertiseTag}>
              <Text style={styles.expertiseText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleContactMember(item, 'message')}
          >
            <MessageSquare color="#6366F1" size={16} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleContactMember(item, 'call')}
          >
            <Phone color="#6366F1" size={16} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUnassignedTicket = ({ item }: { item: WorkloadTicket }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
          <Text style={styles.ticketTitle}>{item.title}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.ticketStudent}>Student: {item.studentName}</Text>
      <Text style={styles.ticketCategory}>{item.category} • Est. {item.estimatedTime}h</Text>

      <View style={styles.ticketFooter}>
        <Text style={styles.dueDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
        <TouchableOpacity 
          style={styles.assignButton}
          onPress={() => {
            Alert.alert(
              'Assign Ticket',
              'Select team member to assign this ticket to:',
              teamMembers.map(member => ({
                text: member.name,
                onPress: () => handleAssignTicket(item.id, member.id),
              })).concat([{ text: 'Cancel', onPress: () => {} }])
            );
          }}
        >
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const ViewModeButton = ({ mode, label }: { mode: string; label: string }) => (
    <TouchableOpacity
      style={[styles.viewModeButton, viewMode === mode && styles.viewModeButtonActive]}
      onPress={() => setViewMode(mode as any)}
    >
      <Text style={[styles.viewModeText, viewMode === mode && styles.viewModeTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Member</Text>
        </TouchableOpacity>
      </View>

      {/* Team Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{teamStats.totalMembers}</Text>
          <Text style={styles.statLabel}>Team Size</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{teamStats.activeMembers}</Text>
          <Text style={styles.statLabel}>Active Now</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: getWorkloadColor(teamStats.avgWorkload) }]}>
            {teamStats.avgWorkload}%
          </Text>
          <Text style={styles.statLabel}>Avg Workload</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#EF4444' }]}>{teamStats.unassignedTickets}</Text>
          <Text style={styles.statLabel}>Unassigned</Text>
        </View>
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        <ViewModeButton mode="overview" label="Overview" />
        <ViewModeButton mode="workload" label="Workload" />
        <ViewModeButton mode="performance" label="Performance" />
      </View>

      {/* Team Members Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        <FlatList
          data={teamMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamMemberCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.membersList}
        />
      </View>

      {/* Unassigned Tickets Section */}
      {tickets.filter(t => t.status === 'unassigned').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tickets Awaiting Assignment</Text>
          <FlatList
            data={tickets.filter(t => t.status === 'unassigned')}
            keyExtractor={(item) => item.id}
            renderItem={renderUnassignedTicket}
            scrollEnabled={false}
            contentContainerStyle={styles.ticketsList}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#6366F1',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  viewModeTextActive: {
    color: 'white',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  membersList: {
    gap: 16,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  memberStatItem: {
    alignItems: 'center',
  },
  memberStatNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 2,
  },
  memberStatLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  performanceIndicator: {
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  trendText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  workloadContainer: {
    marginBottom: 12,
  },
  workloadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workloadLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  workloadPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  workloadBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  workloadFill: {
    height: '100%',
    borderRadius: 3,
  },
  expertiseContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  expertiseTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expertiseText: {
    fontSize: 10,
    color: '#6366F1',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketStudent: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 4,
  },
  ticketCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignButton: {
    backgroundColor: '#6366F1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
