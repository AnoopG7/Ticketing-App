import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OpsProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ops Profile</Text>
      <Text style={styles.subtitle}>Performance metrics and settings</Text>
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
