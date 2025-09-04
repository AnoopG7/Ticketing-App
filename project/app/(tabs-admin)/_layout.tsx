import { Tabs } from 'expo-router';
import { BarChart3, Users, Settings, Shield, MessageSquare } from 'lucide-react-native';

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'All Tickets',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Security',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Shield size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden screens - accessible only through navigation */}
      <Tabs.Screen
        name="add-user"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="ticket-detail"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
