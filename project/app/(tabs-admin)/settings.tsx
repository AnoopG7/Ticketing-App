import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Settings</Text>
      <Text style={styles.subtitle}>Categories, workflows, and configurations</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
