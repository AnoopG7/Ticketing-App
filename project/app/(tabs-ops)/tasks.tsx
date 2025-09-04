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
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Tag,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignee: string;
  dueDate: string;
  category: string;
  estimatedTime: string;
}

export default function TasksScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Review Network Infrastructure',
      description: 'Comprehensive audit of campus network equipment and performance metrics',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Sarah Wilson',
      dueDate: '2024-01-20',
      category: 'Infrastructure',
      estimatedTime: '4h',
    },
    {
      id: '2',
      title: 'Update Student Portal',
      description: 'Deploy new features and security patches to the student information system',
      priority: 'medium',
      status: 'pending',
      assignee: 'Mike Chen',
      dueDate: '2024-01-22',
      category: 'Software',
      estimatedTime: '6h',
    },
    {
      id: '3',
      title: 'Hardware Maintenance',
      description: 'Scheduled maintenance for lab computers in Building C',
      priority: 'medium',
      status: 'completed',
      assignee: 'Alex Johnson',
      dueDate: '2024-01-18',
      category: 'Hardware',
      estimatedTime: '3h',
    },
    {
      id: '4',
      title: 'Security Audit',
      description: 'Monthly security assessment and vulnerability scanning',
      priority: 'high',
      status: 'blocked',
      assignee: 'Lisa Rodriguez',
      dueDate: '2024-01-25',
      category: 'Security',
      estimatedTime: '8h',
    },
    {
      id: '5',
      title: 'Database Optimization',
      description: 'Performance tuning and indexing for student records database',
      priority: 'low',
      status: 'pending',
      assignee: 'David Kim',
      dueDate: '2024-01-30',
      category: 'Database',
      estimatedTime: '5h',
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'All Tasks', count: mockTasks.length },
    { id: 'pending', label: 'Pending', count: mockTasks.filter(t => t.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: mockTasks.filter(t => t.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: mockTasks.filter(t => t.status === 'completed').length },
    { id: 'blocked', label: 'Blocked', count: mockTasks.filter(t => t.status === 'blocked').length },
  ];

  const filteredTasks = selectedFilter === 'all' 
    ? mockTasks 
    : mockTasks.filter(task => task.status === selectedFilter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'blocked': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return Clock;
      case 'blocked': return AlertCircle;
      default: return Clock;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = getStatusIcon(task.status);
    
    return (
      <TouchableOpacity style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>

        <View style={styles.taskMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <User color="#6B7280" size={14} />
              <Text style={styles.metaText}>{task.assignee}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar color="#6B7280" size={14} />
              <Text style={styles.metaText}>{new Date(task.dueDate).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Tag color="#6B7280" size={14} />
              <Text style={styles.metaText}>{task.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock color="#6B7280" size={14} />
              <Text style={styles.metaText}>{task.estimatedTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.statusContainer}>
            <StatusIcon color={getStatusColor(task.status)} size={16} />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
          <ChevronRight color="#6B7280" size={16} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.header}>
        <Text style={styles.headerTitle}>Task Management</Text>
        <Text style={styles.headerSubtitle}>Track and manage your assignments</Text>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.id && styles.filterTabTextActive
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterBadge,
                selectedFilter === filter.id && styles.filterBadgeActive
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  selectedFilter === filter.id && styles.filterBadgeTextActive
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle color="#6B7280" size={48} />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? 'No tasks available at the moment' 
                : `No ${selectedFilter.replace('-', ' ')} tasks found`}
            </Text>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#F59E0B',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 6,
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  filterBadgeTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    marginBottom: 16,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  taskMeta: {
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
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
