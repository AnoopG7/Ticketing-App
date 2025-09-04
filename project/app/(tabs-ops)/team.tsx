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
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Users, 
  MoreVertical,
  User,
  ArrowUp,
  ArrowDown,
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

export default function OpsTeamScreen() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
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

  const getSortedTeamMembers = () => {
    switch (viewMode) {
      case 'workload':
        return [...teamMembers].sort((a, b) => b.workloadCapacity - a.workloadCapacity);
      case 'performance':
        return [...teamMembers].sort((a, b) => b.performance.thisWeek - a.performance.thisWeek);
      case 'overview':
      default:
        return teamMembers;
    }
  };

  const sortedTeamMembers = getSortedTeamMembers();

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'online').length,
    avgWorkload: Math.round(teamMembers.reduce((sum, member) => sum + member.workloadCapacity, 0) / teamMembers.length),
    totalAssigned: teamMembers.reduce((sum, member) => sum + member.assignedTickets, 0),
  };

  const renderTeamMemberCard = ({ item }: { item: TeamMember }) => {
    const performanceTrend = getPerformanceTrend(item.performance.thisWeek, item.performance.lastWeek);
    const isVertical = viewMode !== 'overview';
    
    return (
      <TouchableOpacity style={[styles.memberCard, isVertical && styles.memberCardVertical]}>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <View style={styles.avatarContainer}>
              <User color="#F59E0B" size={20} />
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
            {/* Show sorting indicator for workload/performance view */}
            {viewMode === 'workload' && (
              <View style={styles.sortIndicator}>
                <Text style={styles.sortValue}>{item.workloadCapacity}%</Text>
                <Text style={styles.sortLabel}>Workload</Text>
              </View>
            )}
            {viewMode === 'performance' && (
              <View style={styles.sortIndicator}>
                <Text style={styles.sortValue}>{item.performance.thisWeek}</Text>
                <Text style={styles.sortLabel}>This Week</Text>
              </View>
            )}
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
      </TouchableOpacity>
    );
  };

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
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{teamStats.totalAssigned}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
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
          data={sortedTeamMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderTeamMemberCard}
          horizontal={viewMode === 'overview'}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={viewMode === 'overview'}
          numColumns={viewMode === 'overview' ? 1 : 1}
          contentContainerStyle={viewMode === 'overview' ? styles.membersList : styles.membersListVertical}
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
    backgroundColor: '#F59E0B',
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
    backgroundColor: '#F59E0B',
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
  membersListVertical: {
    gap: 16,
    paddingBottom: 20,
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
  memberCardVertical: {
    width: '100%',
    marginBottom: 0,
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
    color: '#F59E0B',
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
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expertiseText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '500',
  },
  sortIndicator: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  sortLabel: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '500',
  },
});
