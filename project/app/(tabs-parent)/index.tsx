import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, CheckCircle, AlertTriangle, Users, Calendar, Ticket, BookOpen } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface FamilyStats {
  totalTickets: number;
  openTickets: number;
  childrenCount: number;
  upcomingEvents: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  childName: string;
  type: 'created' | 'updated' | 'resolved';
  title: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
}

export default function ParentDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<FamilyStats>({
    totalTickets: 12,
    openTickets: 3,
    childrenCount: 2,
    upcomingEvents: 5,
    recentActivity: [
      {
        id: '1',
        childName: 'Emma Doe',
        type: 'created',
        title: 'Permission for Field Trip',
        time: '2 hours ago',
        priority: 'medium',
      },
      {
        id: '2',
        childName: 'Alex Doe',
        type: 'resolved',
        title: 'Exam Schedule Clarification',
        time: '1 day ago',
        priority: 'low',
      },
    ],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={24} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'created':
          return <Clock color="#F59E0B" size={16} />;
        case 'resolved':
          return <CheckCircle color="#10B981" size={16} />;
        case 'updated':
          return <AlertTriangle color="#3B82F6" size={16} />;
      }
    };

    const getPriorityColor = () => {
      switch (activity.priority) {
        case 'high':
          return '#EF4444';
        case 'medium':
          return '#F59E0B';
        case 'low':
          return '#10B981';
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>
          {getActivityIcon()}
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.childName}>{activity.childName}</Text>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <View style={styles.activityMeta}>
            <Text style={styles.activityTime}>{activity.time}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>{activity.priority.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.userName}>Jane Smith</Text>
            <Text style={styles.userRole}>Parent - 2 Children</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="white" size={24} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Family Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Family Tickets"
            value={stats.totalTickets}
            icon={Ticket}
            color="#059669"
          />
          <StatCard
            title="Open Issues"
            value={stats.openTickets}
            icon={Clock}
            color="#F59E0B"
          />
          <StatCard
            title="Children"
            value={stats.childrenCount}
            icon={Users}
            color="#3B82F6"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={Calendar}
            color="#8B5CF6"
          />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, styles.primaryAction]}>
              <View style={styles.actionIcon}>
                <Ticket color="white" size={28} />
              </View>
              <Text style={styles.actionTitle}>New Request</Text>
              <Text style={styles.actionSubtitle}>Submit for child</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <Users color="#3B82F6" size={28} />
              </View>
              <Text style={styles.actionTitle}>Children</Text>
              <Text style={styles.actionSubtitle}>Manage profiles</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Calendar color="#F59E0B" size={28} />
              </View>
              <Text style={styles.actionTitle}>Schedule</Text>
              <Text style={styles.actionSubtitle}>View events</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF620' }]}>
                <BookOpen color="#8B5CF6" size={28} />
              </View>
              <Text style={styles.actionTitle}>Academic</Text>
              <Text style={styles.actionSubtitle}>Progress & grades</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentActivity}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {stats.recentActivity.map((activity) => (
            <ActivityItemComponent key={activity.id} activity={activity} />
          ))}
        </View>
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
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  quickActions: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#059669',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recentActivity: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});
