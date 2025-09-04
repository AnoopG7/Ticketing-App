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
import { User, BookOpen, Calendar, Clock, Award, Activity, Phone, Mail, Settings, Bell } from 'lucide-react-native';
import { router } from 'expo-router';

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActive: string;
  upcomingEvents: number;
  activeTickets: number;
  achievements: number;
  gpa: number;
  attendance: number;
  contactInfo: {
    phone?: string;
    email?: string;
  };
}

interface Activity {
  id: string;
  childId: string;
  type: 'ticket' | 'assignment' | 'event' | 'achievement';
  title: string;
  timestamp: string;
  status?: string;
}

const mockChildren: Child[] = [
  {
    id: 'student1',
    name: 'Emma Doe',
    grade: '10th',
    class: 'A',
    studentId: 'ST001',
    status: 'active',
    lastActive: '2024-01-15T10:30:00Z',
    upcomingEvents: 3,
    activeTickets: 2,
    achievements: 12,
    gpa: 3.8,
    attendance: 96,
    contactInfo: {
      phone: '+1-234-567-8901',
      email: 'emma.doe@school.edu',
    },
  },
  {
    id: 'student2',
    name: 'Alex Doe',
    grade: '8th',
    class: 'B',
    studentId: 'ST002',
    status: 'active',
    lastActive: '2024-01-15T09:15:00Z',
    upcomingEvents: 1,
    activeTickets: 1,
    achievements: 8,
    gpa: 3.6,
    attendance: 94,
    contactInfo: {
      phone: '+1-234-567-8902',
      email: 'alex.doe@school.edu',
    },
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    childId: 'student1',
    type: 'ticket',
    title: 'Science Fair Permission - Submitted',
    timestamp: '2024-01-15T08:30:00Z',
    status: 'open',
  },
  {
    id: '2',
    childId: 'student2',
    type: 'assignment',
    title: 'Math Homework - Due Tomorrow',
    timestamp: '2024-01-14T16:00:00Z',
  },
  {
    id: '3',
    childId: 'student1',
    type: 'achievement',
    title: 'Honor Roll - Quarter 2',
    timestamp: '2024-01-14T12:00:00Z',
  },
  {
    id: '4',
    childId: 'student2',
    type: 'event',
    title: 'Parent-Teacher Conference Scheduled',
    timestamp: '2024-01-13T14:30:00Z',
  },
];

export default function ParentChildrenScreen() {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [selectedChild, setSelectedChild] = useState<string | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <Clock color="#F59E0B" size={16} />;
      case 'assignment': return <BookOpen color="#3B82F6" size={16} />;
      case 'event': return <Calendar color="#8B5CF6" size={16} />;
      case 'achievement': return <Award color="#10B981" size={16} />;
      default: return <Activity color="#6B7280" size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ticket': return '#F59E0B';
      case 'assignment': return '#3B82F6';
      case 'event': return '#8B5CF6';
      case 'achievement': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatLastActive = (timestamp: string) => {
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleChildSettings = (child: Child) => {
    Alert.alert(
      'Child Settings',
      `Settings for ${child.name}`,
      [
        { text: 'View Profile', onPress: () => {} },
        { text: 'Notification Settings', onPress: () => {} },
        { text: 'Privacy Settings', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredActivities = selectedChild === 'all' 
    ? activities 
    : activities.filter(activity => activity.childId === selectedChild);

  const renderChildCard = ({ item }: { item: Child }) => (
    <View style={styles.childCard}>
      <View style={styles.childHeader}>
        <View style={styles.childInfo}>
          <View style={styles.avatarContainer}>
            <User color="#059669" size={24} />
          </View>
          <View style={styles.childDetails}>
            <Text style={styles.childName}>{item.name}</Text>
            <Text style={styles.childGrade}>Grade {item.grade} - Class {item.class}</Text>
            <Text style={styles.studentId}>ID: {item.studentId}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => handleChildSettings(item)}
        >
          <Settings color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.gpa}</Text>
          <Text style={styles.statLabel}>GPA</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.attendance}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.activeTickets}</Text>
          <Text style={styles.statLabel}>Active Tickets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.achievements}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#10B981' : '#EF4444' }]} />
        <Text style={styles.statusText}>
          {item.status === 'active' ? 'Active' : 'Inactive'} • {formatLastActive(item.lastActive)}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Phone color="#059669" size={16} />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Mail color="#059669" size={16} />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Bell color="#059669" size={16} />
          <Text style={styles.actionButtonText}>Notify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        {getActivityIcon(item.type)}
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={styles.activityMeta}>
          <Text style={styles.activityChild}>
            {children.find(c => c.id === item.childId)?.name}
          </Text>
          <Text style={styles.activityTime}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {item.status && (
        <View style={[styles.statusBadge, { backgroundColor: getActivityColor(item.type) }]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      )}
    </View>
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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Children</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Child</Text>
        </TouchableOpacity>
      </View>

      {/* Children Cards */}
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderChildCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.childrenList}
        style={styles.childrenContainer}
      />

      {/* Recent Activities Section */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        
        {/* Activity Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filters}
        >
          <ChildFilterButton child={{ id: 'all', name: 'All Children' }} />
          {children.map((child) => (
            <ChildFilterButton key={child.id} child={child} />
          ))}
        </ScrollView>

        {/* Activities List */}
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivityItem}
          scrollEnabled={false}
          contentContainerStyle={styles.activitiesList}
        />
      </View>
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
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  childrenContainer: {
    marginVertical: 20,
  },
  childrenList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  activitiesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filters: {
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
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
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
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityChild: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});
