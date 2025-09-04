import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings as SettingsIcon,
  Users,
  Tag,
  Clock,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  ticketCount: number;
}

interface Department {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  memberCount: number;
}

interface SystemSettings {
  autoAssignment: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  publicPortal: boolean;
  maintenanceMode: boolean;
  ticketExpiry: number; // days
  responseTarget: number; // hours
  escalationTime: number; // hours
}

export default function AdminSettingsScreen() {
  const [activeSection, setActiveSection] = useState<'categories' | 'departments' | 'system' | 'notifications'>('categories');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Technical Support', description: 'IT and technical issues', color: '#3B82F6', isActive: true, ticketCount: 245 },
    { id: '2', name: 'Academic Affairs', description: 'Grades, courses, and academic matters', color: '#10B981', isActive: true, ticketCount: 189 },
    { id: '3', name: 'Facilities', description: 'Building maintenance and repairs', color: '#F59E0B', isActive: true, ticketCount: 156 },
    { id: '4', name: 'Library Services', description: 'Books, resources, and library access', color: '#8B5CF6', isActive: true, ticketCount: 98 },
    { id: '5', name: 'Student Services', description: 'General student support and inquiries', color: '#EF4444', isActive: false, ticketCount: 67 },
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'IT Support', email: 'it-support@college.edu', isActive: true, memberCount: 8 },
    { id: '2', name: 'Academic Affairs', email: 'academic@college.edu', isActive: true, memberCount: 12 },
    { id: '3', name: 'Facilities Management', email: 'facilities@college.edu', isActive: true, memberCount: 6 },
    { id: '4', name: 'Library Services', email: 'library@college.edu', isActive: true, memberCount: 5 },
    { id: '5', name: 'Student Services', email: 'student-services@college.edu', isActive: false, memberCount: 4 },
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoAssignment: true,
    emailNotifications: true,
    smsNotifications: false,
    publicPortal: true,
    maintenanceMode: false,
    ticketExpiry: 30,
    responseTarget: 24,
    escalationTime: 48,
  });

  const handleCategoryToggle = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleDepartmentToggle = (id: string) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === id ? { ...dept, isActive: !dept.isActive } : dept
    ));
  };

  const handleSystemSettingToggle = (setting: keyof SystemSettings) => {
    if (typeof systemSettings[setting] === 'boolean') {
      setSystemSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const handleSaveSettings = () => {
    Alert.alert('Success', 'Settings have been saved successfully');
  };

  const SectionButton = ({ title, section, icon: Icon }: any) => (
    <TouchableOpacity
      style={[styles.sectionButton, activeSection === section && styles.sectionButtonActive]}
      onPress={() => setActiveSection(section)}
    >
      <Icon color={activeSection === section ? '#7C3AED' : '#6B7280'} size={20} />
      <Text style={[styles.sectionButtonText, activeSection === section && styles.sectionButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const CategoryCard = ({ category }: { category: Category }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{category.name}</Text>
            <Text style={styles.itemDescription}>{category.description}</Text>
            <Text style={styles.itemCount}>{category.ticketCount} tickets</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          <Switch
            value={category.isActive}
            onValueChange={() => handleCategoryToggle(category.id)}
            trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
            thumbColor={category.isActive ? '#7C3AED' : '#F3F4F6'}
          />
          <TouchableOpacity style={styles.editButton}>
            <Edit3 color="#6B7280" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const DepartmentCard = ({ department }: { department: Department }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <View style={styles.departmentIcon}>
            <Users color="#7C3AED" size={20} />
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{department.name}</Text>
            <Text style={styles.itemDescription}>{department.email}</Text>
            <Text style={styles.itemCount}>{department.memberCount} members</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          <Switch
            value={department.isActive}
            onValueChange={() => handleDepartmentToggle(department.id)}
            trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
            thumbColor={department.isActive ? '#7C3AED' : '#F3F4F6'}
          />
          <TouchableOpacity style={styles.editButton}>
            <Edit3 color="#6B7280" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const SettingRow = ({ title, description, value, onToggle, icon: Icon }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Icon color="#7C3AED" size={20} />
        <View style={styles.settingDetails}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
        thumbColor={value ? '#7C3AED' : '#F3F4F6'}
      />
    </View>
  );

  const NumberSetting = ({ title, value, unit, onUpdate }: any) => (
    <View style={styles.numberSetting}>
      <View style={styles.numberSettingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.numberUnit}>{unit}</Text>
      </View>
      <View style={styles.numberInput}>
        <TouchableOpacity 
          style={styles.numberButton}
          onPress={() => onUpdate(Math.max(1, value - 1))}
        >
          <Text style={styles.numberButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.numberValue}>{value}</Text>
        <TouchableOpacity 
          style={styles.numberButton}
          onPress={() => onUpdate(value + 1)}
        >
          <Text style={styles.numberButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'categories':
        return (
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Ticket Categories</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddCategory(true)}
              >
                <Plus color="white" size={16} />
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contentDescription}>
              Manage ticket categories and their properties
            </Text>
            <View style={styles.itemsList}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </View>
          </View>
        );

      case 'departments':
        return (
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Departments</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddDepartment(true)}
              >
                <Plus color="white" size={16} />
                <Text style={styles.addButtonText}>Add Department</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.contentDescription}>
              Configure departments and their notification settings
            </Text>
            <View style={styles.itemsList}>
              {departments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </View>
          </View>
        );

      case 'system':
        return (
          <View style={styles.content}>
            <Text style={styles.contentTitle}>System Configuration</Text>
            <Text style={styles.contentDescription}>
              Global system settings and operational parameters
            </Text>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingSectionTitle}>Automation</Text>
              <SettingRow
                title="Auto Assignment"
                description="Automatically assign tickets to available team members"
                value={systemSettings.autoAssignment}
                onToggle={() => handleSystemSettingToggle('autoAssignment')}
                icon={RefreshCw}
              />
              <SettingRow
                title="Public Portal"
                description="Allow public access to ticket submission portal"
                value={systemSettings.publicPortal}
                onToggle={() => handleSystemSettingToggle('publicPortal')}
                icon={Globe}
              />
              <SettingRow
                title="Maintenance Mode"
                description="Enable maintenance mode to prevent new ticket submissions"
                value={systemSettings.maintenanceMode}
                onToggle={() => handleSystemSettingToggle('maintenanceMode')}
                icon={SettingsIcon}
              />
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingSectionTitle}>Time Limits</Text>
              <NumberSetting
                title="Ticket Expiry"
                value={systemSettings.ticketExpiry}
                unit="days"
                onUpdate={(value: number) => setSystemSettings(prev => ({ ...prev, ticketExpiry: value }))}
              />
              <NumberSetting
                title="Response Target"
                value={systemSettings.responseTarget}
                unit="hours"
                onUpdate={(value: number) => setSystemSettings(prev => ({ ...prev, responseTarget: value }))}
              />
              <NumberSetting
                title="Escalation Time"
                value={systemSettings.escalationTime}
                unit="hours"
                onUpdate={(value: number) => setSystemSettings(prev => ({ ...prev, escalationTime: value }))}
              />
            </View>
          </View>
        );

      case 'notifications':
        return (
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Notification Settings</Text>
            <Text style={styles.contentDescription}>
              Configure how and when notifications are sent
            </Text>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingSectionTitle}>Channels</Text>
              <SettingRow
                title="Email Notifications"
                description="Send notifications via email"
                value={systemSettings.emailNotifications}
                onToggle={() => handleSystemSettingToggle('emailNotifications')}
                icon={Mail}
              />
              <SettingRow
                title="SMS Notifications"
                description="Send urgent notifications via SMS"
                value={systemSettings.smsNotifications}
                onToggle={() => handleSystemSettingToggle('smsNotifications')}
                icon={Bell}
              />
            </View>

            <View style={styles.notificationTypes}>
              <Text style={styles.settingSectionTitle}>Notification Types</Text>
              <View style={styles.notificationGrid}>
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>New Tickets</Text>
                  <Text style={styles.notificationDescription}>When new tickets are submitted</Text>
                  <Switch 
                    value={true}
                    trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
                    thumbColor="#7C3AED"
                  />
                </View>
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>Assignments</Text>
                  <Text style={styles.notificationDescription}>When tickets are assigned</Text>
                  <Switch 
                    value={true}
                    trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
                    thumbColor="#7C3AED"
                  />
                </View>
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>Escalations</Text>
                  <Text style={styles.notificationDescription}>When tickets are escalated</Text>
                  <Switch 
                    value={false}
                    trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
                    thumbColor="#F3F4F6"
                  />
                </View>
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>Resolutions</Text>
                  <Text style={styles.notificationDescription}>When tickets are resolved</Text>
                  <Switch 
                    value={true}
                    trackColor={{ false: '#E5E7EB', true: '#DDD6FE' }}
                    thumbColor="#7C3AED"
                  />
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>System Settings</Text>
          <Text style={styles.headerSubtitle}>Configure categories, departments, and system behavior</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Save color="white" size={18} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.sectionTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SectionButton title="Categories" section="categories" icon={Tag} />
          <SectionButton title="Departments" section="departments" icon={Users} />
          <SectionButton title="System" section="system" icon={SettingsIcon} />
          <SectionButton title="Notifications" section="notifications" icon={Bell} />
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
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
  headerContent: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTabs: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    gap: 8,
  },
  sectionButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionButtonTextActive: {
    color: '#7C3AED',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  contentDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  departmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  numberSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  numberSettingInfo: {
    flex: 1,
  },
  numberUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberButton: {
    width: 32,
    height: 32,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  numberValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'center',
  },
  notificationTypes: {
    marginTop: 24,
  },
  notificationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  notificationCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  notificationDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
});
