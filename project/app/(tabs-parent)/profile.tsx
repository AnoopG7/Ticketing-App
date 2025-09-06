import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  children: {
    id: string;
    name: string;
    grade: string;
    school: string;
  }[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  accountCreated: string;
  lastLogin: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  gradeUpdates: boolean;
  ticketUpdates: boolean;
  schoolEvents: boolean;
  emergencyAlerts: boolean;
}

const mockProfile: ParentProfile = {
  id: 'parent1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Oak Street, Springfield, IL 62701',
  children: [
    {
      id: 'child1',
      name: 'Emma Johnson',
      grade: '10th Grade',
      school: 'Springfield High School',
    },
    {
      id: 'child2',
      name: 'Alex Johnson',
      grade: '8th Grade',
      school: 'Springfield Middle School',
    },
  ],
  emergencyContact: {
    name: 'John Johnson',
    phone: '+1 (555) 987-6543',
    relationship: 'Spouse',
  },
  accountCreated: '2023-08-15T10:30:00Z',
  lastLogin: '2024-01-16T08:45:00Z',
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  gradeUpdates: true,
  ticketUpdates: true,
  schoolEvents: true,
  emergencyAlerts: true,
};

export default function ParentProfileScreen() {
  const { logout } = useAuth();
  const [profile] = useState<ParentProfile>(mockProfile);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [activeSection, setActiveSection] = useState<'profile' | 'settings' | 'notifications'>('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const ProfileSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#059669" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Edit size={16} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <Text style={styles.profileId}>Parent ID: {profile.id.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Edit size={20} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Mail size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profile.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Children Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Children</Text>
        {profile.children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childAvatar}>
              <User size={24} color="#059669" />
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childDetails}>{child.grade} • {child.school}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        ))}
      </View>

      {/* Emergency Contact */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <User size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile.emergencyContact.name}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.emergencyContact.phone}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Users size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Relationship</Text>
              <Text style={styles.infoValue}>{profile.emergencyContact.relationship}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Calendar size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Account Created</Text>
              <Text style={styles.infoValue}>{formatDate(profile.accountCreated)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Clock size={20} color="#059669" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>{formatDate(profile.lastLogin)}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const NotificationSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Communication Preferences</Text>
        <View style={styles.infoCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Switch
              value={notificationSettings.emailNotifications}
              onValueChange={(value) => updateNotificationSetting('emailNotifications', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notificationSettings.pushNotifications}
              onValueChange={(value) => updateNotificationSetting('pushNotifications', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>SMS Notifications</Text>
            <Switch
              value={notificationSettings.smsNotifications}
              onValueChange={(value) => updateNotificationSetting('smsNotifications', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Content Preferences</Text>
        <View style={styles.infoCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Grade Updates</Text>
            <Switch
              value={notificationSettings.gradeUpdates}
              onValueChange={(value) => updateNotificationSetting('gradeUpdates', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Support Ticket Updates</Text>
            <Switch
              value={notificationSettings.ticketUpdates}
              onValueChange={(value) => updateNotificationSetting('ticketUpdates', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>School Events</Text>
            <Switch
              value={notificationSettings.schoolEvents}
              onValueChange={(value) => updateNotificationSetting('schoolEvents', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Emergency Alerts</Text>
            <Switch
              value={notificationSettings.emergencyAlerts}
              onValueChange={(value) => updateNotificationSetting('emergencyAlerts', value)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="white"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const SettingsSection = () => (
    <ScrollView style={styles.sectionContent} showsVerticalScrollIndicator={false}>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color="#059669" />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Bell size={20} color="#059669" />
            <Text style={styles.menuText}>Notification Settings</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#059669" />
            <Text style={styles.menuText}>Help & Support</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#059669', '#047857']} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </LinearGradient>

      {/* Section Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'profile' && styles.activeTab]}
          onPress={() => setActiveSection('profile')}
        >
          <User size={18} color={activeSection === 'profile' ? '#059669' : '#6B7280'} />
          <Text style={[styles.tabText, activeSection === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'notifications' && styles.activeTab]}
          onPress={() => setActiveSection('notifications')}
        >
          <Bell size={18} color={activeSection === 'notifications' ? '#059669' : '#6B7280'} />
          <Text style={[styles.tabText, activeSection === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'settings' && styles.activeTab]}
          onPress={() => setActiveSection('settings')}
        >
          <Settings size={18} color={activeSection === 'settings' ? '#059669' : '#6B7280'} />
          <Text style={[styles.tabText, activeSection === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Content */}
      {activeSection === 'profile' && <ProfileSection />}
      {activeSection === 'notifications' && <NotificationSection />}
      {activeSection === 'settings' && <SettingsSection />}

      {/* Custom Logout Modal for Web */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sign Out</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={cancelLogout}
              >
                <X color="#6B7280" size={20} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.modalIcon}>
                <LogOut color="#EF4444" size={32} />
              </View>
              <Text style={styles.modalMessage}>
                Are you sure you want to sign out?
              </Text>
              <Text style={styles.modalSubMessage}>
                Logged in as: {profile.name}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={cancelLogout}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmLogout}
              >
                <LogOut color="white" size={16} />
                <Text style={styles.modalConfirmText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
  },
  sectionContent: {
    flex: 1,
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#059669',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editProfileButton: {
    padding: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
  // Modal styles for web logout
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  modalSubMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    gap: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
