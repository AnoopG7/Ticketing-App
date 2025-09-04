import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { 
  ArrowLeft, 
  Send,
  AlertCircle,
  Clock,
  Zap,
  Flag,
  User,
  FileText,
  Tag,
} from 'lucide-react-native';
import { router } from 'expo-router';

interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  childName: string;
  childId: string;
}

const categories = [
  { id: 'academic', label: 'Academic Support', icon: '📚' },
  { id: 'health', label: 'Health Services', icon: '🏥' },
  { id: 'library', label: 'Library Services', icon: '📖' },
  { id: 'technical', label: 'Technical Support', icon: '💻' },
  { id: 'facilities', label: 'Facilities', icon: '🏢' },
  { id: 'transportation', label: 'Transportation', icon: '🚌' },
  { id: 'financial', label: 'Financial Services', icon: '💳' },
  { id: 'other', label: 'Other', icon: '📝' },
];

const priorities = [
  { 
    id: 'low', 
    label: 'Low Priority', 
    description: 'General inquiry or non-urgent matter',
    color: '#10B981',
    icon: Clock,
  },
  { 
    id: 'medium', 
    label: 'Medium Priority', 
    description: 'Important but not time-sensitive',
    color: '#F59E0B',
    icon: Flag,
  },
  { 
    id: 'high', 
    label: 'High Priority', 
    description: 'Urgent matter requiring quick attention',
    color: '#EF4444',
    icon: AlertCircle,
  },
  { 
    id: 'urgent', 
    label: 'Urgent', 
    description: 'Critical issue requiring immediate attention',
    color: '#DC2626',
    icon: Zap,
  },
];

const children = [
  { id: 'student1', name: 'Emma Doe', grade: '10th' },
  { id: 'student2', name: 'Alex Doe', grade: '8th' },
];

export default function CreateParentTicketScreen() {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    childName: '',
    childId: '',
  });

  const [errors, setErrors] = useState<Partial<TicketFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.childId) {
      newErrors.childId = 'Child selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Here you would typically send the data to your backend
    Alert.alert(
      'Ticket Created Successfully!',
      `Your ${formData.priority} priority ticket has been submitted for ${formData.childName}. You will receive updates on its progress.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getPriorityById = (id: string) => priorities.find(p => p.id === id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#059669" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Support Ticket</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        {/* Child Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <User color="#059669" size={16} /> Select Child
          </Text>
          <Text style={styles.sectionDescription}>
            Choose which child this ticket is for
          </Text>
          <View style={styles.childGrid}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.childCard,
                  formData.childId === child.id && styles.childCardSelected,
                ]}
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    childId: child.id,
                    childName: child.name,
                  }));
                  setErrors(prev => ({ ...prev, childId: undefined }));
                }}
              >
                <Text style={[
                  styles.childName,
                  formData.childId === child.id && styles.childNameSelected,
                ]}>
                  {child.name}
                </Text>
                <Text style={[
                  styles.childGrade,
                  formData.childId === child.id && styles.childGradeSelected,
                ]}>
                  Grade {child.grade}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.childId && <Text style={styles.errorText}>{errors.childId}</Text>}
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FileText color="#059669" size={16} /> Ticket Title
          </Text>
          <TextInput
            style={[styles.textInput, errors.title && styles.textInputError]}
            placeholder="Brief description of your request..."
            value={formData.title}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, title: text }));
              setErrors(prev => ({ ...prev, title: undefined }));
            }}
            multiline={false}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Tag color="#059669" size={16} /> Category
          </Text>
          <Text style={styles.sectionDescription}>
            Select the most appropriate category for your request
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  formData.category === category.id && styles.categoryCardSelected,
                ]}
                onPress={() => {
                  setFormData(prev => ({ ...prev, category: category.id }));
                  setErrors(prev => ({ ...prev, category: undefined }));
                }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  formData.category === category.id && styles.categoryLabelSelected,
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Flag color="#059669" size={16} /> Priority Level
          </Text>
          <Text style={styles.sectionDescription}>
            How urgent is this matter?
          </Text>
          <View style={styles.priorityList}>
            {priorities.map((priority) => {
              const IconComponent = priority.icon;
              return (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityCard,
                    formData.priority === priority.id && styles.priorityCardSelected,
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, priority: priority.id as any }));
                  }}
                >
                  <View style={styles.priorityHeader}>
                    <IconComponent color={priority.color} size={20} />
                    <Text style={[
                      styles.priorityLabel,
                      { color: priority.color },
                    ]}>
                      {priority.label}
                    </Text>
                  </View>
                  <Text style={styles.priorityDescription}>
                    {priority.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FileText color="#059669" size={16} /> Detailed Description
          </Text>
          <Text style={styles.sectionDescription}>
            Please provide as much detail as possible to help us assist you
          </Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.textInputError]}
            placeholder="Describe your request in detail..."
            value={formData.description}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, description: text }));
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Preview */}
        {formData.title && formData.category && formData.childId && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Ticket Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTicketTitle}>{formData.title}</Text>
                <View style={[
                  styles.previewPriorityBadge,
                  { backgroundColor: getPriorityById(formData.priority)?.color },
                ]}>
                  <Text style={styles.previewPriorityText}>
                    {formData.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewChild}>For: {formData.childName}</Text>
              <Text style={styles.previewCategory}>
                {getCategoryById(formData.category)?.icon} {getCategoryById(formData.category)?.label}
              </Text>
              {formData.description && (
                <Text style={styles.previewDescription} numberOfLines={3}>
                  {formData.description}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Send color="white" size={20} />
          <Text style={styles.submitButtonText}>Submit Ticket</Text>
        </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  childGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  childCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  childCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  childNameSelected: {
    color: '#059669',
  },
  childGrade: {
    fontSize: 12,
    color: '#6B7280',
  },
  childGradeSelected: {
    color: '#047857',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
    minHeight: 120,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 80,
  },
  categoryCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#059669',
  },
  priorityList: {
    gap: 12,
  },
  priorityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  priorityCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  previewTicketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  previewPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewPriorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  previewChild: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
