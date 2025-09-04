import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Search, Filter, Plus, Clock, CheckCircle, AlertCircle, Users, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface FamilyTicket {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  childName: string;
  childId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

const mockFamilyTickets: FamilyTicket[] = [
  {
    id: '1',
    title: 'Permission for Science Fair Participation',
    category: 'Academic',
    status: 'open',
    priority: 'medium',
    childName: 'Emma Doe',
    childId: 'student1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Library Card Replacement',
    category: 'Library',
    status: 'in-progress',
    priority: 'low',
    childName: 'Alex Doe',
    childId: 'student2',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
    assignee: 'Library Staff',
  },
  {
    id: '3',
    title: 'Medical Excuse for PE Class',
    category: 'Health',
    status: 'resolved',
    priority: 'high',
    childName: 'Emma Doe',
    childId: 'student1',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
    assignee: 'Health Services',
  },
];

export default function ParentTicketsScreen() {
  const [tickets, setTickets] = useState<FamilyTicket[]>(mockFamilyTickets);
  const [selectedChild, setSelectedChild] = useState<'all' | string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const children = [
    { id: 'all', name: 'All Children' },
    { id: 'student1', name: 'Emma Doe' },
    { id: 'student2', name: 'Alex Doe' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in-progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle color="#EF4444" size={16} />;
      case 'in-progress': return <Clock color="#F59E0B" size={16} />;
      case 'resolved':
      case 'closed': return <CheckCircle color="#10B981" size={16} />;
      default: return <Clock color="#6B7280" size={16} />;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesChild = selectedChild === 'all' || ticket.childId === selectedChild;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    return matchesChild && matchesStatus;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const renderTicketCard = ({ item }: { item: FamilyTicket }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => router.push(`/tickets/${item.id}`)}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.childInfo}>
          <Users color="#059669" size={16} />
          <Text style={styles.childName}>{item.childName}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketCategory}>{item.category}</Text>

      <View style={styles.statusContainer}>
        {getStatusIcon(item.status)}
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status.replace('-', ' ').toUpperCase()}
        </Text>
      </View>

      <View style={styles.ticketFooter}>
        <View>
          <Text style={styles.ticketDate}>Created: {item.createdAt}</Text>
          {item.assignee && (
            <Text style={styles.assignee}>Assigned to: {item.assignee}</Text>
          )}
        </View>
        <ArrowRight color="#9CA3AF" size={20} />
      </View>
    </TouchableOpacity>
  );

  const ChildFilterButton = ({ child }: { child: any }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedChild === child.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedChild(child.id)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedChild === child.id && styles.filterButtonTextActive,
        ]}
      >
        {child.name}
      </Text>
    </TouchableOpacity>
  );

  const StatusFilterButton = ({ label, value }: { label: string; value: any }) => (
    <TouchableOpacity
      style={[
        styles.statusFilterButton,
        selectedStatus === value && styles.statusFilterButtonActive,
      ]}
      onPress={() => setSelectedStatus(value)}
    >
      <Text
        style={[
          styles.statusFilterButtonText,
          selectedStatus === value && styles.statusFilterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Tickets</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/tickets/create')}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* Ticket Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ticketStats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#EF4444' }]}>{ticketStats.open}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{ticketStats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{ticketStats.resolved}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* Child Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.childFiltersContainer}
        contentContainerStyle={styles.childFilters}
      >
        {children.map((child) => (
          <ChildFilterButton key={child.id} child={child} />
        ))}
      </ScrollView>

      {/* Status Filters */}
      <View style={styles.statusFiltersContainer}>
        <StatusFilterButton label="All" value="all" />
        <StatusFilterButton label="Open" value="open" />
        <StatusFilterButton label="In Progress" value="in-progress" />
        <StatusFilterButton label="Resolved" value="resolved" />
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicketCard}
        contentContainerStyle={styles.ticketsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No tickets found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your filters
            </Text>
          </View>
        }
      />
    </View>
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
  createButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
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
  childFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  childFilters: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  statusFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  statusFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusFilterButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  statusFilterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusFilterButtonTextActive: {
    color: 'white',
  },
  ticketsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  ticketCategory: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ticketDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  assignee: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
