import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface PerformanceMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  dateEarned: string;
  icon: string;
}

export default function OpsProfileScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Resolution Rate',
      value: '94%',
      trend: 'up',
      icon: Target,
      color: '#10B981',
    },
    {
      label: 'Avg Response Time',
      value: '1.2h',
      trend: 'down',
      icon: Clock,
      color: '#F59E0B',
    },
    {
      label: 'Tickets Resolved',
      value: '127',
      trend: 'up',
      icon: Trophy,
      color: '#8B5CF6',
    },
    {
      label: 'Customer Rating',
      value: '4.8',
      trend: 'up',
      icon: Star,
      color: '#F59E0B',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Speed Demon',
      description: 'Resolved 10 tickets in under 30 minutes',
      dateEarned: '2024-01-15',
      icon: '⚡',
    },
    {
      id: '2',
      title: 'Customer Champion',
      description: 'Maintained 5-star rating for 30 days',
      dateEarned: '2024-01-10',
      icon: '🌟',
    },
    {
      id: '3',
      title: 'Team Player',
      description: 'Helped 5 colleagues with their tickets',
      dateEarned: '2024-01-08',
      icon: '🤝',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const StatCard = ({ metric }: { metric: PerformanceMetric }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${metric.color}20` }]}>
        <metric.icon color={metric.color} size={20} />
      </View>
      <Text style={styles.statValue}>{metric.value}</Text>
      <Text style={styles.statLabel}>{metric.label}</Text>
      <View style={styles.trendIndicator}>
        <TrendingUp 
          color={metric.trend === 'up' ? '#10B981' : metric.trend === 'down' ? '#EF4444' : '#6B7280'} 
          size={12} 
        />
      </View>
    </View>
  );

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <View style={styles.achievementCard}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        <Text style={styles.achievementDate}>
          Earned {new Date(achievement.dateEarned).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange 
  }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={showSwitch}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon color="#F59E0B" size={20} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
          thumbColor={switchValue ? '#F59E0B' : '#F3F4F6'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color="white" size={40} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Wilson</Text>
            <Text style={styles.profileRole}>Senior Operations Specialist</Text>
            <Text style={styles.profileDepartment}>Support Team • Employee ID: OP001</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 color="white" size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Mail color="#6B7280" size={16} />
              <Text style={styles.contactText}>sarah.wilson@college.edu</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone color="#6B7280" size={16} />
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactItem}>
              <MapPin color="#6B7280" size={16} />
              <Text style={styles.contactText}>Building A, Office 205</Text>
            </View>
            <View style={styles.contactItem}>
              <Calendar color="#6B7280" size={16} />
              <Text style={styles.contactText}>Joined January 2023</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance This Month</Text>
          <View style={styles.metricsGrid}>
            {performanceMetrics.map((metric, index) => (
              <StatCard key={index} metric={metric} />
            ))}
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Receive alerts for new tickets"
              showSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingItem
              icon={Target}
              title="Auto-Assign"
              subtitle="Automatically receive new tickets"
              showSwitch={true}
              switchValue={autoAssignEnabled}
              onSwitchChange={setAutoAssignEnabled}
            />
            <SettingItem
              icon={Shield}
              title="Privacy & Security"
              subtitle="Manage your account security"
              onPress={() => Alert.alert('Settings', 'Privacy settings would open here')}
            />
            <SettingItem
              icon={Settings}
              title="App Preferences"
              subtitle="Customize your experience"
              onPress={() => Alert.alert('Settings', 'App preferences would open here')}
            />
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => Alert.alert('Help', 'Help center would open here')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  trendIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  achievementCard: {
    flexDirection: 'row',
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
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  achievementDate: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});
