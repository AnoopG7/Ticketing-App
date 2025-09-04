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
  Plus,
  Search,
  Filter,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  Activity,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'technical' | 'academic' | 'financial' | 'general';
  requester: string;
  requesterType: 'parent' | 'child';
  childName?: string;
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
  responses: number;
}

interface RecentActivity {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'response_added' | 'status_changed';
  title: string;
  description: string;
  timestamp: string;
  ticketId?: string;
  requester: string;
  requesterType: 'parent' | 'child';
}

const mockSupportTickets: SupportTicket[] = [
  {
    id: 'T001',
    title: 'Unable to access online portal',
    description: 'My child cannot log into the student portal since yesterday',
    priority: 'high',
    status: 'in-progress',
    category: 'technical',
    requester: 'Sarah Johnson',
    requesterType: 'parent',
    childName: 'Emma Johnson',
    createdAt: '2024-01-15T09:30:00Z',
    lastUpdated: '2024-01-15T14:20:00Z',
    assignedTo: 'Tech Support Team',
    responses: 3,
  },
  {
    id: 'T002',
    title: 'Grade not showing in system',
    description: 'Math test grade from last week is not visible in the portal',
    priority: 'medium',
    status: 'open',
    category: 'academic',
    requester: 'Emma Johnson',
    requesterType: 'child',
    childName: 'Emma Johnson',
    createdAt: '2024-01-14T16:45:00Z',
    lastUpdated: '2024-01-14T16:45:00Z',
    responses: 0,
  },
  {
    id: 'T003',
    title: 'Bus route change request',
    description: 'Need to update bus pickup location due to address change',
    priority: 'medium',
    status: 'resolved',
    category: 'general',
    requester: 'Sarah Johnson',
    requesterType: 'parent',
    childName: 'Emma Johnson',
    createdAt: '2024-01-10T11:20:00Z',
    lastUpdated: '2024-01-12T09:15:00Z',
    assignedTo: 'Transportation Team',
    responses: 5,
  },
  {
    id: 'T004',
    title: 'Library book fine dispute',
    description: 'Charged for book that was returned on time',
    priority: 'low',
    status: 'closed',
    category: 'financial',
    requester: 'Alex Johnson',
    requesterType: 'child',
    childName: 'Alex Johnson',
    createdAt: '2024-01-08T13:10:00Z',
    lastUpdated: '2024-01-09T10:30:00Z',
    assignedTo: 'Library Staff',
    responses: 2,
  },
  {
    id: 'T005',
    title: 'Special dietary requirements not met',
    description: 'Lunch served contained allergens despite notification',
    priority: 'urgent',
    status: 'in-progress',
    category: 'general',
    requester: 'Sarah Johnson',
    requesterType: 'parent',
    childName: 'Alex Johnson',
    createdAt: '2024-01-16T12:00:00Z',
    lastUpdated: '2024-01-16T15:30:00Z',
    assignedTo: 'Food Services',
    responses: 4,
  },
];

const mockRecentActivities: RecentActivity[] = [
  {
    id: 'A001',
    type: 'response_added',
    title: 'New response to portal access issue',
    description: 'Tech Support Team provided troubleshooting steps',
    timestamp: '2024-01-16T14:20:00Z',
    ticketId: 'T001',
    requester: 'Tech Support Team',
    requesterType: 'parent',
  },
  {
    id: 'A002',
    type: 'ticket_created',
    title: 'New urgent ticket created',
    description: 'Dietary requirements issue reported',
    timestamp: '2024-01-16T12:00:00Z',
    ticketId: 'T005',
    requester: 'Sarah Johnson',
    requesterType: 'parent',
  },
  {
    id: 'A003',
    type: 'status_changed',
    title: 'Bus route request resolved',
    description: 'Transportation team completed the route change',
    timestamp: '2024-01-12T09:15:00Z',
    ticketId: 'T003',
    requester: 'Transportation Team',
    requesterType: 'parent',
  },
];

export default function SupportCenterScreen() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'activities'>('tickets');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in-progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle size={16} color="#EF4444" />;
      case 'in-progress': return <Clock size={16} color="#F59E0B" />;
      case 'resolved': return <CheckCircle size={16} color="#10B981" />;
      case 'closed': return <CheckCircle size={16} color="#6B7280" />;
      default: return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_created': return <Plus size={16} color="#059669" />;
      case 'response_added': return <MessageSquare size={16} color="#3B82F6" />;
      case 'status_changed': return <Activity size={16} color="#F59E0B" />;
      default: return <Activity size={16} color="#6B7280" />;
    }
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

  const filteredTickets = mockSupportTickets.filter(ticket => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
    return true;
  });

  const ticketStats = {
    total: mockSupportTickets.length,
    open: mockSupportTickets.filter(t => t.status === 'open').length,
    inProgress: mockSupportTickets.filter(t => t.status === 'in-progress').length,
    resolved: mockSupportTickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#047857']} style={styles.header}>
        <Text style={styles.headerTitle}>Tickets</Text>
        <Text style={styles.headerSubtitle}>
          Manage tickets for your family
        </Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/tickets/create')}
        >
          <Plus size={20} color="white" />
          <Text style={styles.createButtonText}>New Ticket</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
          onPress={() => setActiveTab('tickets')}
        >
          <Activity size={20} color={activeTab === 'tickets' ? '#059669' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
            Tickets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Activity size={20} color={activeTab === 'activities' ? '#059669' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Recent Activity
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'tickets' && (
        <>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <BarChart3 size={24} color="#059669" />
              <Text style={styles.statNumber}>{ticketStats.total}</Text>
              <Text style={styles.statLabel}>Total Tickets</Text>
            </View>
            <View style={styles.statCard}>
              <AlertCircle size={24} color="#EF4444" />
              <Text style={styles.statNumber}>{ticketStats.open}</Text>
              <Text style={styles.statLabel}>Open</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{ticketStats.inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color="#10B981" />
              <Text style={styles.statNumber}>{ticketStats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#059669" />
              <Text style={styles.filterText}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Search size={16} color="#059669" />
              <Text style={styles.filterText}>Priority</Text>
            </TouchableOpacity>
          </View>

          {/* Tickets List */}
          <ScrollView style={styles.ticketsContainer} showsVerticalScrollIndicator={false}>
            {filteredTickets.map((ticket) => (
              <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketTitleRow}>
                    <Text style={styles.ticketId}>#{ticket.id}</Text>
                    <View style={styles.ticketBadges}>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
                        <Text style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                          {ticket.priority.toUpperCase()}
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
                  <View style={styles.ticketRequester}>
                    <User size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {ticket.requesterType === 'parent' ? 'You' : ticket.childName}
                    </Text>
                    {ticket.requesterType === 'child' && (
                      <Text style={styles.childIndicator}>(Child)</Text>
                    )}
                  </View>
                  <View style={styles.ticketDate}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{formatDate(ticket.createdAt)}</Text>
                  </View>
                </View>

                <View style={styles.ticketFooter}>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(ticket.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                      {ticket.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.responsesContainer}>
                    <MessageSquare size={14} color="#6B7280" />
                    <Text style={styles.responsesText}>{ticket.responses} responses</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {activeTab === 'activities' && (
        <ScrollView style={styles.activitiesContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {mockRecentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>{formatDate(activity.timestamp)}</Text>
                  {activity.ticketId && (
                    <Text style={styles.activityTicket}>#{activity.ticketId}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F0FDF4',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    color: '#059669',
    fontWeight: '500',
  },
  ticketsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    color: '#059669',
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
  ticketRequester: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  childIndicator: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  responsesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responsesText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  activitiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  activityTicket: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
  },
});
