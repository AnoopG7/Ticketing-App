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
  TextInput,
} from 'react-native';
import { 
  User,
  Users,
  Shield,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  UserPlus,
} from 'lucide-react-native';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'operations' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  stats: {
    ticketsCreated: number;
    ticketsResolved: number;
    loginCount: number;
  };
}

const mockUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Emma Doe',
    email: 'emma.doe@student.edu',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['create_ticket', 'view_own_tickets'],
    stats: { ticketsCreated: 12, ticketsResolved: 0, loginCount: 45 },
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@parent.edu',
    role: 'parent',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['create_ticket', 'view_children_tickets', 'manage_children'],
    stats: { ticketsCreated: 8, ticketsResolved: 0, loginCount: 32 },
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@staff.edu',
    role: 'operations',
    status: 'active',
    lastLogin: '2024-01-15T14:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['view_all_tickets', 'assign_tickets', 'resolve_tickets', 'manage_team'],
    stats: { ticketsCreated: 5, ticketsResolved: 89, loginCount: 156 },
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike.johnson@staff.edu',
    role: 'operations',
    status: 'active',
    lastLogin: '2024-01-15T11:20:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['view_all_tickets', 'assign_tickets', 'resolve_tickets'],
    stats: { ticketsCreated: 3, ticketsResolved: 124, loginCount: 198 },
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@system.edu',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T15:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['full_access'],
    stats: { ticketsCreated: 2, ticketsResolved: 15, loginCount: 89 },
  },
  {
    id: '6',
    name: 'Inactive Student',
    email: 'inactive@student.edu',
    role: 'student',
    status: 'inactive',
    lastLogin: '2024-01-10T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['create_ticket', 'view_own_tickets'],
    stats: { ticketsCreated: 3, ticketsResolved: 0, loginCount: 12 },
  },
];

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return '#10B981';
      case 'parent': return '#059669';
      case 'operations': return '#6366F1';
      case 'admin': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'suspended': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle color="#10B981" size={16} />;
      case 'inactive': return <Clock color="#6B7280" size={16} />;
      case 'suspended': return <XCircle color="#EF4444" size={16} />;
      default: return <Clock color="#6B7280" size={16} />;
    }
  };

  const handleUserAction = (user: SystemUser, action: 'edit' | 'suspend' | 'activate' | 'delete') => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit User', `Edit details for ${user.name}`);
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Suspend', 
              style: 'destructive',
              onPress: () => {
                setUsers(prevUsers =>
                  prevUsers.map(u => 
                    u.id === user.id ? { ...u, status: 'suspended' } : u
                  )
                );
              }
            },
          ]
        );
        break;
      case 'activate':
        setUsers(prevUsers =>
          prevUsers.map(u => 
            u.id === user.id ? { ...u, status: 'active' } : u
          )
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
              }
            },
          ]
        );
        break;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    students: users.filter(u => u.role === 'student').length,
    staff: users.filter(u => u.role === 'operations' || u.role === 'admin').length,
  };

  const renderUserCard = ({ item }: { item: SystemUser }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <User color={getRoleColor(item.role)} size={20} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.userMeta}>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
                <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(item.status)}
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => {
            Alert.alert(
              'User Actions',
              `Actions for ${item.name}`,
              [
                { text: 'Edit Profile', onPress: () => handleUserAction(item, 'edit') },
                { 
                  text: item.status === 'active' ? 'Suspend' : 'Activate', 
                  onPress: () => handleUserAction(item, item.status === 'active' ? 'suspend' : 'activate') 
                },
                { text: 'Delete User', onPress: () => handleUserAction(item, 'delete'), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <MoreVertical color="#6B7280" size={16} />
        </TouchableOpacity>
      </View>

      <View style={styles.userStats}>
        <View style={styles.userStatItem}>
          <Text style={styles.userStatNumber}>{item.stats.ticketsCreated}</Text>
          <Text style={styles.userStatLabel}>Created</Text>
        </View>
        <View style={styles.userStatItem}>
          <Text style={styles.userStatNumber}>{item.stats.ticketsResolved}</Text>
          <Text style={styles.userStatLabel}>Resolved</Text>
        </View>
        <View style={styles.userStatItem}>
          <Text style={styles.userStatNumber}>{item.stats.loginCount}</Text>
          <Text style={styles.userStatLabel}>Logins</Text>
        </View>
      </View>

      <View style={styles.userFooter}>
        <Text style={styles.lastLogin}>
          Last login: {new Date(item.lastLogin).toLocaleDateString()}
        </Text>
        <Text style={styles.permissions}>
          {item.permissions.length} permissions
        </Text>
      </View>
    </View>
  );

  const FilterButton = ({ label, value, type }: { label: string; value: string; type: 'role' | 'status' }) => {
    const isSelected = type === 'role' ? selectedRole === value : selectedStatus === value;
    const onPress = () => {
      if (type === 'role') {
        setSelectedRole(value);
      } else {
        setSelectedStatus(value);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.filterButton, isSelected && styles.filterButtonActive]}
        onPress={onPress}
      >
        <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <UserPlus color="white" size={20} />
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userStats.total}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{userStats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#059669' }]}>{userStats.students}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#6366F1' }]}>{userStats.staff}</Text>
          <Text style={styles.statLabel}>Staff</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Filters</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <FilterButton label="All Roles" value="all" type="role" />
          <FilterButton label="Students" value="student" type="role" />
          <FilterButton label="Parents" value="parent" type="role" />
          <FilterButton label="Operations" value="operations" type="role" />
          <FilterButton label="Admins" value="admin" type="role" />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <FilterButton label="All Status" value="all" type="status" />
          <FilterButton label="Active" value="active" type="status" />
          <FilterButton label="Inactive" value="inactive" type="status" />
          <FilterButton label="Suspended" value="suspended" type="status" />
        </ScrollView>
      </View>

      {/* Users List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Users ({filteredUsers.length})</Text>
          <TouchableOpacity style={styles.bulkButton}>
            <Settings color="#6366F1" size={16} />
            <Text style={styles.bulkButtonText}>Bulk Actions</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          scrollEnabled={false}
          contentContainerStyle={styles.usersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Users color="#9CA3AF" size={48} />
              <Text style={styles.emptyStateTitle}>No users found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
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
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filtersSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 12,
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
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 8,
  },
  bulkButtonText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  userStatItem: {
    alignItems: 'center',
  },
  userStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 2,
  },
  userStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastLogin: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  permissions: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
