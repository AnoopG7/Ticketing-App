import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Camera,
  Paperclip,
  Send,
  MapPin,
  User,
  Tag,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function CreateTicketScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Academic',
    'Library',
    'Administration',
    'Facilities',
    'IT Support',
    'Financial Aid',
    'Housing',
    'Health Services',
    'Other',
  ];

  const priorities = [
    { key: 'low', label: 'Low', color: '#10B981' },
    { key: 'medium', label: 'Medium', color: '#F59E0B' },
    { key: 'high', label: 'High', color: '#EF4444' },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your ticket has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 1500);
  };

  const PriorityButton = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        { borderColor: item.color },
        priority === item.key && { backgroundColor: `${item.color}20` }
      ]}
      onPress={() => setPriority(item.key)}
    >
      <Text style={[styles.priorityText, { color: item.color }]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const CategoryButton = ({ cat }: { cat: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        category === cat && styles.categoryButtonActive
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text style={[
        styles.categoryText,
        category === cat && styles.categoryTextActive
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Ticket</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Title <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Tag color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Brief description of your issue"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <CategoryButton key={cat} cat={cat} />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((item) => (
                <PriorityButton key={item.key} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location (Optional)</Text>
            <View style={styles.inputContainer}>
              <MapPin color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Building, room, or area"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <User color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Please provide detailed information about your issue..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachments</Text>
            <View style={styles.attachmentActions}>
              <TouchableOpacity style={styles.attachmentButton}>
                <Camera color="#3B82F6" size={20} />
                <Text style={styles.attachmentText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.attachmentButton}>
                <Paperclip color="#3B82F6" size={20} />
                <Text style={styles.attachmentText}>Add File</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Send color="white" size={20} style={styles.submitIcon} />
          <Text style={styles.submitText}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    minHeight: 120,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  textArea: {
    paddingTop: 0,
    minHeight: 96,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  attachmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 8,
  },
  attachmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});