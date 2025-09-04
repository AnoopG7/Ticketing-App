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
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Zap,
  Target,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OpsStats {
  assignedTickets: number;
  completedToday: number;
  avgResolutionTime: string;
  teamRanking: number;
  myTasks: TaskItem[];
  urgentTickets: TicketItem[];
}

interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  status: 'pending' | 'in-progress' | 'review';
  timeSpent: string;
}

interface TicketItem {
  id: string;
  title: string;
  student: string;
  timeAgo: string;
  priority: 'high' | 'medium' | 'low';
}

export default function OpsWorkloadScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<OpsStats>({
    assignedTickets: 12,
    completedToday: 8,
    avgResolutionTime: '1.2 hrs',
    teamRanking: 2,
    myTasks: [
      {
        id: '1',
        title: 'Review transcript requests batch',
        category: 'Administration',
        priority: 'high',
        deadline: '2 hours',
        status: 'in-progress',
        timeSpent: '1.5 hrs'
      },
      {
        id: '2',
        title: 'Resolve library access issues',
        category: 'Library',
        priority: 'medium',
        deadline: '4 hours',
        status: 'pending',
        timeSpent: '0 hrs'
      },
    ],
    urgentTickets: [
      {
        id: '1',
        title: 'Cannot access exam portal',
        student: 'John Doe',
        timeAgo: '5 min ago',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Missing course materials',
        student: 'Sarah Smith',
        timeAgo: '12 min ago',
        priority: 'high'
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

  const TaskCard = ({ task }: { task: TaskItem }) => {
    const getPriorityColor = () => {
      switch (task.priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
      }
    };

    const getStatusIcon = () => {
      switch (task.status) {
        case 'pending': return <PlayCircle color="#6B7280" size={20} />;
        case 'in-progress': return <PauseCircle color="#F59E0B" size={20} />;
        case 'review': return <RotateCcw color="#3B82F6" size={20} />;
      }
    };

    return (
      <TouchableOpacity style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskStatus}>
            {getStatusIcon()}
            <Text style={styles.taskStatusText}>{task.status.toUpperCase()}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskCategory}>{task.category}</Text>
        <View style={styles.taskFooter}>
          <Text style={styles.deadline}>⏰ Due in {task.deadline}</Text>
          <Text style={styles.timeSpent}>🕐 {task.timeSpent}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const UrgentTicketCard = ({ ticket }: { ticket: TicketItem }) => {
    const getPriorityColor = () => {
      switch (ticket.priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
      }
    };

    return (
      <TouchableOpacity style={styles.urgentTicket}>
        <View style={styles.urgentHeader}>
          <AlertTriangle color="#EF4444" size={16} />
          <Text style={styles.urgentTime}>{ticket.timeAgo}</Text>
        </View>
        <Text style={styles.urgentTitle}>{ticket.title}</Text>
        <Text style={styles.urgentStudent}>👤 {ticket.student}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Ready to work! 💪</Text>
            <Text style={styles.userName}>Sarah Wilson</Text>
            <Text style={styles.userRole}>Operations Team • Rank #{stats.teamRanking}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="white" size={24} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>4</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Today's Performance</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Assigned"
            value={stats.assignedTickets}
            icon={Target}
            color="#16A34A"
          />
          <StatCard
            title="Completed"
            value={stats.completedToday}
            icon={CheckCircle}
            color="#10B981"
          />
          <StatCard
            title="Avg Time"
            value={stats.avgResolutionTime}
            icon={Clock}
            color="#F59E0B"
          />
          <StatCard
            title="Efficiency"
            value="92%"
            icon={TrendingUp}
            color="#8B5CF6"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Active Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {stats.myTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Tickets</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Queue</Text>
            </TouchableOpacity>
          </View>
          {stats.urgentTickets.map((ticket) => (
            <UrgentTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, styles.primaryAction]}>
              <View style={styles.actionIcon}>
                <Zap color="white" size={28} />
              </View>
              <Text style={styles.actionTitle}>Take Next</Text>
              <Text style={styles.actionSubtitle}>Auto-assign</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <Calendar color="#3B82F6" size={28} />
              </View>
              <Text style={styles.actionTitle}>Schedule</Text>
              <Text style={styles.actionSubtitle}>Plan workday</Text>
            </TouchableOpacity>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '600',
  },
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskCategory: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '500',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deadline: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  timeSpent: {
    fontSize: 12,
    color: '#6B7280',
  },
  urgentTicket: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  urgentTime: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  urgentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  urgentStudent: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#16A34A',
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
});
