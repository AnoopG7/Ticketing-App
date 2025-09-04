import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Monitor,
  Download,
  Filter,
  ArrowLeft,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface SecurityLog {
  id: string;
  timestamp: string;
  type: 'login' | 'logout' | 'failed_login' | 'permission_change' | 'data_access';
  user: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  ip: string;
}

export default function SecurityScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const securityLogs: SecurityLog[] = [
    {
      id: '1',
      timestamp: '2025-09-04 14:30:25',
      type: 'failed_login',
      user: 'admin@university.edu',
      description: 'Multiple failed login attempts detected',
      severity: 'high',
      ip: '192.168.1.105'
    },
    {
      id: '2',
      timestamp: '2025-09-04 14:25:12',
      type: 'permission_change',
      user: 'john.doe@university.edu',
      description: 'User permissions elevated to admin level',
      severity: 'medium',
      ip: '192.168.1.87'
    },
    {
      id: '3',
      timestamp: '2025-09-04 14:20:08',
      type: 'login',
      user: 'sarah.wilson@university.edu',
      description: 'Successful admin login',
      severity: 'low',
      ip: '192.168.1.92'
    },
    {
      id: '4',
      timestamp: '2025-09-04 14:15:43',
      type: 'data_access',
      user: 'mike.admin@university.edu',
      description: 'Bulk user data export performed',
      severity: 'medium',
      ip: '192.168.1.45'
    },
    {
      id: '5',
      timestamp: '2025-09-04 14:10:30',
      type: 'logout',
      user: 'lisa.martin@university.edu',
      description: 'Admin session ended',
      severity: 'low',
      ip: '192.168.1.67'
    }
  ];

  const securityStats = {
    totalLogs: 1247,
    highRisk: 12,
    mediumRisk: 45,
    lowRisk: 1190,
    activeAdmins: 8,
    lastIncident: '2 hours ago'
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return <CheckCircle color="#10B981" size={16} />;
      case 'logout': return <Clock color="#6B7280" size={16} />;
      case 'failed_login': return <AlertTriangle color="#EF4444" size={16} />;
      case 'permission_change': return <Lock color="#F59E0B" size={16} />;
      case 'data_access': return <Eye color="#3B82F6" size={16} />;
      default: return <Monitor color="#6B7280" size={16} />;
    }
  };

  const filteredLogs = selectedFilter === 'all' 
    ? securityLogs 
    : securityLogs.filter(log => log.severity === selectedFilter);

  const SecurityCard = ({ title, value, subtitle, color }: any) => (
    <View style={[styles.securityCard, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );

  const LogItem = ({ log }: { log: SecurityLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={styles.logTypeContainer}>
          {getTypeIcon(log.type)}
          <Text style={styles.logUser}>{log.user}</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(log.severity) }]}>
          <Text style={styles.severityText}>{log.severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.logDescription}>{log.description}</Text>
      <View style={styles.logFooter}>
        <Text style={styles.logTimestamp}>{log.timestamp}</Text>
        <Text style={styles.logIP}>IP: {log.ip}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Security & Audit</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.headerSubtitle}>System security monitoring and audit logs</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Download color="white" size={18} />
              <Text style={styles.headerButtonText}>Export Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter color="white" size={18} />
              <Text style={styles.headerButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Overview</Text>
          <View style={styles.cardsGrid}>
            <SecurityCard
              title="Total Logs"
              value={securityStats.totalLogs}
              subtitle="Last 30 days"
              color="#7C3AED"
            />
            <SecurityCard
              title="High Risk"
              value={securityStats.highRisk}
              subtitle="Requires attention"
              color="#EF4444"
            />
            <SecurityCard
              title="Medium Risk"
              value={securityStats.mediumRisk}
              subtitle="Monitor closely"
              color="#F59E0B"
            />
            <SecurityCard
              title="Active Admins"
              value={securityStats.activeAdmins}
              subtitle="Currently online"
              color="#10B981"
            />
          </View>
        </View>

        {/* Filter Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audit Logs</Text>
          <View style={styles.filterContainer}>
            {['all', 'high', 'medium', 'low'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && ` (${securityLogs.filter(log => log.severity === filter).length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security Logs */}
        <View style={styles.section}>
          <View style={styles.logsContainer}>
            {filteredLogs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </View>
        </View>

        {/* Security Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Recommendations</Text>
          <View style={styles.recommendationsContainer}>
            <View style={[styles.recommendationCard, { borderLeftColor: '#EF4444' }]}>
              <AlertTriangle color="#EF4444" size={20} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Failed Login Attempts</Text>
                <Text style={styles.recommendationText}>
                  Multiple failed login attempts detected from IP 192.168.1.105. Consider implementing IP blocking.
                </Text>
              </View>
            </View>
            
            <View style={[styles.recommendationCard, { borderLeftColor: '#F59E0B' }]}>
              <Lock color="#F59E0B" size={20} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Password Policy</Text>
                <Text style={styles.recommendationText}>
                  Enable two-factor authentication for all admin accounts to enhance security.
                </Text>
              </View>
            </View>

            <View style={[styles.recommendationCard, { borderLeftColor: '#10B981' }]}>
              <Shield color="#10B981" size={20} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Regular Audits</Text>
                <Text style={styles.recommendationText}>
                  Schedule monthly security audits to review user permissions and access logs.
                </Text>
              </View>
            </View>
          </View>
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
    paddingBottom: 24,
  },
  headerContent: {
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  securityCard: {
    width: (width - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#F59E0B',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  logsContainer: {
    gap: 12,
  },
  logItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  logDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  logIP: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
