import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Settings,
  LogOut,
  Camera,
  ChevronRight,
  Moon,
  Smartphone,
  Globe,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const user = {
    name: 'John Doe',
    email: 'john.doe@college.edu',
    phone: '+1 (555) 123-4567',
    studentId: 'CS2024001',
    department: 'Computer Science',
    year: 'Senior',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face',
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const ProfileItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onPress, 
    hasChevron = false,
    rightComponent 
  }: any) => (
    <TouchableOpacity 
      style={styles.profileItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Icon color="#6B7280" size={20} />
        </View>
        <View>
          <Text style={styles.profileItemLabel}>{label}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      {rightComponent || (hasChevron && <ChevronRight color="#9CA3AF" size={20} />)}
    </TouchableOpacity>
  );

  const SettingsToggle = ({ icon: Icon, label, value, onValueChange }: any) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Icon color="#6B7280" size={20} />
        </View>
        <Text style={styles.profileItemLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#3B82F680' }}
        thumbColor={value ? '#3B82F6' : '#F3F4F6'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraButton}>
            <Camera color="white" size={16} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.year} - {user.department}</Text>
        <Text style={styles.userId}>ID: {user.studentId}</Text>
      </View>

      <View style={styles.content}>
        <ProfileSection title="Personal Information">
          <ProfileItem
            icon={User}
            label="Full Name"
            value={user.name}
            hasChevron
            onPress={() => {}}
          />
          <ProfileItem
            icon={Mail}
            label="Email"
            value={user.email}
            hasChevron
            onPress={() => {}}
          />
          <ProfileItem
            icon={Phone}
            label="Phone"
            value={user.phone}
            hasChevron
            onPress={() => {}}
          />
          <ProfileItem
            icon={MapPin}
            label="Department"
            value={user.department}
          />
        </ProfileSection>

        <ProfileSection title="Preferences">
          <SettingsToggle
            icon={Bell}
            label="Push Notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingsToggle
            icon={Shield}
            label="Biometric Authentication"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
          />
          <SettingsToggle
            icon={Moon}
            label="Dark Mode"
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </ProfileSection>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  userId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileItemValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutSection: {
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});