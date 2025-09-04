import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Star,
  Target,
  Calendar,
  Filter,
  Download,
  Zap,
  Award,
  AlertTriangle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  ticketVolume: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
  resolutionTime: {
    average: number;
    target: number;
    trend: 'up' | 'down';
  };
  satisfaction: {
    average: number;
    trend: 'up' | 'down';
    distribution: { rating: number; count: number }[];
  };
  departmentPerformance: {
    name: string;
    tickets: number;
    avgResolution: number;
    satisfaction: number;
    efficiency: number;
  }[];
  weeklyTrends: {
    day: string;
    tickets: number;
    resolved: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export default function AdminAnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'resolution' | 'satisfaction'>('volume');

  const analyticsData: AnalyticsData = {
    ticketVolume: {
      thisMonth: 1247,
      lastMonth: 1098,
      percentChange: 13.6,
    },
    resolutionTime: {
      average: 18.5,
      target: 24,
      trend: 'down',
    },
    satisfaction: {
      average: 4.2,
      trend: 'up',
      distribution: [
        { rating: 5, count: 45 },
        { rating: 4, count: 32 },
        { rating: 3, count: 15 },
        { rating: 2, count: 6 },
        { rating: 1, count: 2 },
      ],
    },
    departmentPerformance: [
      { name: 'IT Support', tickets: 385, avgResolution: 15.2, satisfaction: 4.3, efficiency: 92 },
      { name: 'Academic Affairs', tickets: 298, avgResolution: 22.8, satisfaction: 4.1, efficiency: 87 },
      { name: 'Facilities', tickets: 224, avgResolution: 28.5, satisfaction: 3.9, efficiency: 78 },
      { name: 'Library', tickets: 186, avgResolution: 12.3, satisfaction: 4.5, efficiency: 95 },
      { name: 'Student Services', tickets: 154, avgResolution: 19.7, satisfaction: 4.2, efficiency: 89 },
    ],
    weeklyTrends: [
      { day: 'Mon', tickets: 45, resolved: 38 },
      { day: 'Tue', tickets: 52, resolved: 45 },
      { day: 'Wed', tickets: 48, resolved: 41 },
      { day: 'Thu', tickets: 58, resolved: 49 },
      { day: 'Fri', tickets: 42, resolved: 39 },
      { day: 'Sat', tickets: 18, resolved: 16 },
      { day: 'Sun', tickets: 12, resolved: 11 },
    ],
    categoryBreakdown: [
      { category: 'Technical', count: 445, percentage: 35.7, color: '#3B82F6' },
      { category: 'Academic', count: 312, percentage: 25.0, color: '#10B981' },
      { category: 'Facilities', count: 267, percentage: 21.4, color: '#F59E0B' },
      { category: 'Library', count: 148, percentage: 11.9, color: '#8B5CF6' },
      { category: 'Other', count: 75, percentage: 6.0, color: '#6B7280' },
    ],
  };

  const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color }: any) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Icon color={color} size={20} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <View style={styles.metricFooter}>
        <Text style={styles.metricSubtitle}>{subtitle}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            {trend === 'up' ? (
              <TrendingUp color="#10B981" size={12} />
            ) : (
              <TrendingDown color="#EF4444" size={12} />
            )}
          </View>
        )}
      </View>
    </View>
  );

  const ChartBar = ({ label, value, maxValue, color }: any) => (
    <View style={styles.chartBar}>
      <Text style={styles.chartLabel}>{label}</Text>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.bar, 
            { 
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: color,
            }
          ]} 
        />
        <Text style={styles.barValue}>{value}</Text>
      </View>
    </View>
  );

  const DepartmentCard = ({ department }: { department: any }) => (
    <View style={styles.departmentCard}>
      <View style={styles.departmentHeader}>
        <Text style={styles.departmentName}>{department.name}</Text>
        <View style={[styles.efficiencyBadge, { 
          backgroundColor: department.efficiency >= 90 ? '#10B981' : 
                          department.efficiency >= 80 ? '#F59E0B' : '#EF4444'
        }]}>
          <Text style={styles.efficiencyText}>{department.efficiency}%</Text>
        </View>
      </View>
      <View style={styles.departmentStats}>
        <View style={styles.departmentStat}>
          <Text style={styles.statValue}>{department.tickets}</Text>
          <Text style={styles.statLabel}>Tickets</Text>
        </View>
        <View style={styles.departmentStat}>
          <Text style={styles.statValue}>{department.avgResolution}h</Text>
          <Text style={styles.statLabel}>Avg Time</Text>
        </View>
        <View style={styles.departmentStat}>
          <Text style={styles.statValue}>{department.satisfaction}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  const CategoryCard = ({ category }: { category: any }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
        <Text style={styles.categoryName}>{category.category}</Text>
        <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
      </View>
      <Text style={styles.categoryCount}>{category.count} tickets</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Advanced Analytics</Text>
          <Text style={styles.headerSubtitle}>Performance insights and trends</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Download color="white" size={18} />
              <Text style={styles.headerButtonText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter color="white" size={18} />
              <Text style={styles.headerButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'quarter'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Ticket Volume"
              value={analyticsData.ticketVolume.thisMonth}
              subtitle={`+${analyticsData.ticketVolume.percentChange}% from last month`}
              trend="up"
              icon={BarChart3}
              color="#7C3AED"
            />
            <MetricCard
              title="Avg Resolution"
              value={`${analyticsData.resolutionTime.average}h`}
              subtitle={`Target: ${analyticsData.resolutionTime.target}h`}
              trend={analyticsData.resolutionTime.trend}
              icon={Clock}
              color="#10B981"
            />
            <MetricCard
              title="Satisfaction"
              value={analyticsData.satisfaction.average}
              subtitle="Customer rating"
              trend={analyticsData.satisfaction.trend}
              icon={Star}
              color="#F59E0B"
            />
            <MetricCard
              title="Efficiency"
              value="87%"
              subtitle="Overall performance"
              trend="up"
              icon={Target}
              color="#3B82F6"
            />
          </View>
        </View>

        {/* Weekly Trends Chart */}
        <View style={styles.section}>
          <View style={styles.trendsHeaderSimple}>
            <Text style={styles.sectionTitle}>Weekly Ticket Trends</Text>
            <View style={styles.weeklyStatsContainer}>
              <View style={styles.weeklyStatItem}>
                <Text style={styles.weeklyStatNumber}>275</Text>
                <Text style={styles.weeklyStatLabel}>This Week</Text>
              </View>
              <View style={styles.weeklyStatItem}>
                <Text style={[styles.weeklyStatNumber, { color: '#10B981' }]}>+12%</Text>
                <Text style={styles.weeklyStatLabel}>vs Last Week</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.enhancedChartContainer}>
            {/* Chart Header */}
            <View style={styles.chartHeaderRow}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItemEnhanced}>
                  <LinearGradient
                    colors={['#A855F7', '#7C3AED']}
                    style={styles.legendDotGradient}
                  />
                  <Text style={styles.legendTextEnhanced}>Submitted</Text>
                </View>
                <View style={styles.legendItemEnhanced}>
                  <LinearGradient
                    colors={['#34D399', '#10B981']}
                    style={styles.legendDotGradient}
                  />
                  <Text style={styles.legendTextEnhanced}>Resolved</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.timeframeButton}>
                <Text style={styles.timeframeText}>7 Days</Text>
              </TouchableOpacity>
            </View>

            {/* Chart Area */}
            <View style={styles.chartMainArea}>
              {/* Y-axis */}
              <View style={styles.yAxis}>
                {[60, 45, 30, 15, 0].map((value, index) => (
                  <Text key={index} style={styles.yAxisText}>{value}</Text>
                ))}
              </View>

              {/* Bars Section */}
              <View style={styles.barsArea}>
                {/* Grid background */}
                <View style={styles.chartGridBackground}>
                  {[0, 1, 2, 3, 4].map((line) => (
                    <View key={line} style={styles.gridLineHorizontal} />
                  ))}
                </View>

                {/* Data bars */}
                <View style={styles.dataSection}>
                  {analyticsData.weeklyTrends.map((day, index) => (
                    <View key={index} style={styles.dayColumn}>
                      <View style={styles.barGroup}>
                        {/* Submitted bar */}
                        <LinearGradient
                          colors={['#A855F7', '#7C3AED']}
                          style={[
                            styles.gradientBar,
                            { height: Math.max((day.tickets / 60) * 100, 3) }
                          ]}
                        />
                        {/* Resolved bar */}
                        <LinearGradient
                          colors={['#34D399', '#10B981']}
                          style={[
                            styles.gradientBar,
                            { height: Math.max((day.resolved / 60) * 100, 3) }
                          ]}
                        />
                      </View>
                      
                      {/* Values display */}
                      <View style={styles.valueDisplay}>
                        <Text style={styles.submittedText}>{day.tickets}</Text>
                        <Text style={styles.resolvedText}>{day.resolved}</Text>
                      </View>
                      
                      {/* Day label */}
                      <View style={styles.dayLabelContainer}>
                        <Text style={[
                          styles.dayLabelText,
                          index === new Date().getDay() && styles.todayLabel
                        ]}>
                          {day.day}
                        </Text>
                        {index === new Date().getDay() && (
                          <View style={styles.todayDot} />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Performance Summary */}
            <View style={styles.performanceSummary}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <TrendingUp color="#10B981" size={14} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>87.3%</Text>
                  <Text style={styles.summaryLabel}>Resolution Rate</Text>
                </View>
              </View>
              
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Clock color="#F59E0B" size={14} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>10-11 AM</Text>
                  <Text style={styles.summaryLabel}>Peak Hours</Text>
                </View>
              </View>
              
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Target color="#7C3AED" size={14} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>92%</Text>
                  <Text style={styles.summaryLabel}>Weekly Goal</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Categories</Text>
          <View style={styles.categoriesContainer}>
            {analyticsData.categoryBreakdown.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </View>
        </View>

        {/* Department Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Performance</Text>
          <View style={styles.departmentsContainer}>
            {analyticsData.departmentPerformance.map((department, index) => (
              <DepartmentCard key={index} department={department} />
            ))}
          </View>
        </View>

        {/* Satisfaction Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Satisfaction Rating Distribution</Text>
          <View style={styles.satisfactionChart}>
            {analyticsData.satisfaction.distribution.map((rating, index) => (
              <ChartBar
                key={index}
                label={`${rating.rating} ⭐`}
                value={rating.count}
                maxValue={Math.max(...analyticsData.satisfaction.distribution.map(r => r.count))}
                color="#F59E0B"
              />
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={[styles.insightCard, { borderLeftColor: '#10B981' }]}>
              <Award color="#10B981" size={20} />
              <Text style={styles.insightText}>
                Library department maintains highest satisfaction rating at 4.5/5
              </Text>
            </View>
            <View style={[styles.insightCard, { borderLeftColor: '#F59E0B' }]}>
              <Zap color="#F59E0B" size={20} />
              <Text style={styles.insightText}>
                Technical tickets increased 24% this month, mostly WiFi-related
              </Text>
            </View>
            <View style={[styles.insightCard, { borderLeftColor: '#EF4444' }]}>
              <AlertTriangle color="#EF4444" size={20} />
              <Text style={styles.insightText}>
                Facilities department resolution time above target by 4.5 hours
              </Text>
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
  } as const,
  headerContent: {
    gap: 8,
  } as const,
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: 'white',
  } as const,
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  } as const,
  headerActions: {
    flexDirection: 'row' as const,
    gap: 12,
  } as const,
  headerButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  } as const,
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  } as const,
  content: {
    flex: 1,
    paddingHorizontal: 20,
  } as const,
  periodSelector: {
    flexDirection: 'row' as const,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center' as const,
    borderRadius: 8,
  } as const,
  periodButtonActive: {
    backgroundColor: '#7C3AED',
  } as const,
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  } as const,
  periodButtonTextActive: {
    color: 'white',
  } as const,
  section: {
    marginBottom: 32,
  } as const,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 16,
  } as const,
  metricsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  } as const,
  metricCard: {
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
  } as const,
  metricHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 8,
  } as const,
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600' as const,
  } as const,
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 8,
  } as const,
  metricFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  } as const,
  metricSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    flex: 1,
  } as const,
  trendContainer: {
    marginLeft: 8,
  } as const,
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  chartLegend: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 24,
    marginBottom: 16,
  } as const,
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  } as const,
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  } as const,
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  } as const,
  chartRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  } as const,
  dayLabel: {
    width: 40,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500' as const,
  } as const,
  barsContainer: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  } as const,
  barPair: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 4,
    height: 40,
  } as const,
  chartBarItem: {
    width: 16,
    borderRadius: 2,
  } as const,
  dayValue: {
    fontSize: 11,
    color: '#9CA3AF',
    minWidth: 40,
  } as const,
  categoriesContainer: {
    gap: 12,
  } as const,
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  categoryHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 8,
  } as const,
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  } as const,
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
  } as const,
  categoryPercentage: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#7C3AED',
  } as const,
  categoryCount: {
    fontSize: 14,
    color: '#6B7280',
  } as const,
  departmentsContainer: {
    gap: 12,
  } as const,
  departmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  departmentHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as const,
  departmentName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1F2937',
  } as const,
  efficiencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  } as const,
  efficiencyText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: 'white',
  } as const,
  departmentStats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  } as const,
  departmentStat: {
    alignItems: 'center' as const,
  } as const,
  statValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#7C3AED',
    marginBottom: 4,
  } as const,
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  } as const,
  satisfactionChart: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  chartBar: {
    marginBottom: 16,
  } as const,
  chartLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 8,
  } as const,
  barContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  } as const,
  bar: {
    height: 20,
    borderRadius: 10,
    minWidth: 2,
  } as const,
  barValue: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#6B7280',
    minWidth: 30,
  } as const,
  insightsContainer: {
    gap: 12,
  } as const,
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  } as const,
  // Enhanced Weekly Trends Styles
  trendsHeaderSimple: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 20,
  } as const,
  weeklyStatsContainer: {
    flexDirection: 'row' as const,
    gap: 16,
  } as const,
  weeklyStatItem: {
    alignItems: 'flex-end' as const,
  } as const,
  weeklyStatNumber: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#7C3AED',
  } as const,
  weeklyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  } as const,
  enhancedChartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  } as const,
  chartHeaderRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
  } as const,
  legendContainer: {
    flexDirection: 'row' as const,
    gap: 20,
  } as const,
  legendItemEnhanced: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  } as const,
  legendDotGradient: {
    width: 12,
    height: 12,
    borderRadius: 6,
  } as const,
  legendTextEnhanced: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500' as const,
  } as const,
  timeframeButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  } as const,
  timeframeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600' as const,
  } as const,
  chartMainArea: {
    flexDirection: 'row' as const,
    height: 140,
    marginBottom: 24,
  } as const,
  yAxis: {
    justifyContent: 'space-between' as const,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 28,
  } as const,
  yAxisText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500' as const,
  } as const,
  barsArea: {
    flex: 1,
    position: 'relative' as const,
  } as const,
  chartGridBackground: {
    position: 'absolute' as const,
    top: 8,
    left: 0,
    right: 0,
    height: 104,
    justifyContent: 'space-between' as const,
  } as const,
  gridLineHorizontal: {
    height: 1,
    backgroundColor: '#F3F4F6',
  } as const,
  dataSection: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    paddingTop: 8,
    paddingBottom: 28,
    height: '100%',
  } as const,
  dayColumn: {
    alignItems: 'center' as const,
    flex: 1,
  } as const,
  barGroup: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    gap: 4,
    height: 104,
  } as const,
  gradientBar: {
    width: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  } as const,
  valueDisplay: {
    flexDirection: 'row' as const,
    gap: 6,
    marginTop: 8,
    marginBottom: 6,
  } as const,
  submittedText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#7C3AED',
  } as const,
  resolvedText: {
    fontSize: 10,
    fontWeight: 'bold' as const,
    color: '#10B981',
  } as const,
  dayLabelContainer: {
    alignItems: 'center' as const,
  } as const,
  dayLabelText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600' as const,
  } as const,
  todayLabel: {
    color: '#7C3AED',
    fontWeight: 'bold' as const,
  } as const,
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7C3AED',
    marginTop: 4,
  } as const,
  performanceSummary: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
  } as const,
  summaryCard: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  } as const,
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as const,
  summaryContent: {
    flex: 1,
  } as const,
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 2,
  } as const,
  summaryLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500' as const,
  } as const,
});
