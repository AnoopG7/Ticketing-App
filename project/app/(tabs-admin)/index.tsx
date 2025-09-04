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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  UserPlus
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AdminStats {
  totalUsers: number;
  totalTickets: number;
  resolvedTickets: number;
  activeOpsMembers: number;
  systemUptime: string;
  avgResolutionTime: string;
  dailyTickets: number[];
  categoryBreakdown: CategoryData[];
  performanceMetrics: PerformanceData[];
}

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface PerformanceData {
  name: string;
  role: string;
  resolved: number;
  avgTime: string;
  efficiency: number;
}

export default function AdminDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1248,
    totalTickets: 342,
    resolvedTickets: 298,
    activeOpsMembers: 12,
    systemUptime: '99.8%',
    avgResolutionTime: '2.3 hrs',
    dailyTickets: [23, 31, 28, 42, 38, 29, 35],
    categoryBreakdown: [
      { category: 'Academic', count: 145, percentage: 42, color: '#3B82F6' },
      { category: 'Library', count: 89, percentage: 26, color: '#10B981' },
      { category: 'IT Support', count: 67, percentage: 20, color: '#F59E0B' },
      { category: 'Other', count: 41, percentage: 12, color: '#8B5CF6' },
    ],
    performanceMetrics: [
      { name: 'Sarah Wilson', role: 'Senior Ops', resolved: 45, avgTime: '1.8 hrs', efficiency: 94 },
      { name: 'Mike Johnson', role: 'Ops Specialist', resolved: 38, avgTime: '2.1 hrs', efficiency: 89 },
      { name: 'Lisa Chen', role: 'Academic Support', resolved: 52, avgTime: '1.5 hrs', efficiency: 96 },
    ],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={24} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && (
            <View style={styles.subtitleContainer}>
              {trend && (
                trend > 0 ? (
                  <TrendingUp color="#10B981" size={12} />
                ) : (
                  <TrendingDown color="#EF4444" size={12} />
                )
              )}
              <Text style={[
                styles.statSubtitle,
                { color: trend && trend > 0 ? '#10B981' : trend && trend < 0 ? '#EF4444' : '#9CA3AF' }
              ]}>
                {subtitle}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const CategoryCard = ({ category }: { category: CategoryData }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
        <Text style={styles.categoryName}>{category.category}</Text>
        <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
      </View>
      <View style={styles.categoryBar}>
        <View 
          style={[
            styles.categoryProgress, 
            { width: `${category.percentage}%`, backgroundColor: category.color }
          ]} 
        />
      </View>
      <Text style={styles.categoryCount}>{category.count} tickets</Text>
    </View>
  );

  const PerformanceCard = ({ member }: { member: PerformanceData }) => (
    <View style={styles.performanceCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
        </View>
        <View style={[
          styles.efficiencyBadge,
          { backgroundColor: member.efficiency > 90 ? '#10B981' : member.efficiency > 80 ? '#F59E0B' : '#EF4444' }
        ]}>
          <Text style={styles.efficiencyText}>{member.efficiency}%</Text>
        </View>
      </View>
      <View style={styles.memberStats}>
        <View style={styles.memberStat}>
          <Text style={styles.statNumber}>{member.resolved}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.memberStat}>
          <Text style={styles.statNumber}>{member.avgTime}</Text>
          <Text style={styles.statLabel}>Avg Time</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
      <LinearGradient colors={['#7C3AED', '#9333EA']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>System Overview 📊</Text>
            <Text style={styles.userName}>Michael Johnson</Text>
            <Text style={styles.userRole}>Administrator • {stats.systemUptime} Uptime</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color="white" size={24} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>System Metrics</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="#7C3AED"
            subtitle="+12 this week"
            trend={12}
          />
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets}
            icon={Ticket}
            color="#3B82F6"
            subtitle="87% resolved"
          />
          <StatCard
            title="Ops Team"
            value={stats.activeOpsMembers}
            icon={Shield}
            color="#10B981"
            subtitle="Active members"
          />
          <StatCard
            title="Avg Resolution"
            value={stats.avgResolutionTime}
            icon={Clock}
            color="#F59E0B"
            subtitle="-0.5 hrs improved"
            trend={-0.5}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Details</Text>
            </TouchableOpacity>
          </View>
          {stats.categoryBreakdown.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Performance</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Full Report</Text>
            </TouchableOpacity>
          </View>
          {stats.performanceMetrics.map((member, index) => (
            <PerformanceCard key={index} member={member} />
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.primaryAction]}
              onPress={() => router.push('/add-user')}
            >
              <View style={styles.actionIcon}>
                <UserPlus color="white" size={28} />
              </View>
              <Text style={styles.actionTitle}>Add User</Text>
              <Text style={styles.actionSubtitle}>Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/analytics')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <BarChart3 color="#3B82F6" size={28} />
              </View>
              <Text style={styles.actionTitle}>Reports</Text>
              <Text style={styles.actionSubtitle}>Generate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/settings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
                <Settings color="#10B981" size={28} />
              </View>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>System config</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/security')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Shield color="#F59E0B" size={28} />
              </View>
              <Text style={styles.actionTitle}>Security</Text>
              <Text style={styles.actionSubtitle}>Audit logs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '500',
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
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 8,
  },
  categoryProgress: {
    height: '100%',
    borderRadius: 3,
  },
  categoryCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  memberRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  efficiencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  efficiencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  memberStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
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
    backgroundColor: '#7C3AED',
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
