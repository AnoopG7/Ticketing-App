import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Calendar,
  Save,
  UserPlus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'student' | 'parent' | 'ops' | 'admin';
  department: string;
  studentId?: string;
  parentOf?: string;
}

export default function AddUserScreen() {
  const [formData, setFormData] = useState<NewUser>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    department: '',
    studentId: '',
    parentOf: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'student', label: 'Student', description: 'Can submit and track tickets' },
    { value: 'parent', label: 'Parent', description: 'Can manage child tickets and create new ones' },
    { value: 'ops', label: 'Operations', description: 'Can handle and resolve tickets' },
    { value: 'admin', label: 'Administrator', description: 'Full system access and management' },
  ];

  const departments = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Liberal Arts',
    'Sciences',
    'IT Support',
    'Academic Affairs',
    'Student Services',
    'Facilities',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.department && (formData.role === 'student' || formData.role === 'parent')) {
      newErrors.department = 'Department is required';
    }

    if (formData.role === 'student' && !formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    }

    if (formData.role === 'parent' && !formData.parentOf) {
      newErrors.parentOf = 'Student relationship is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'User has been created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const updateFormData = (field: keyof NewUser, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    error, 
    icon: Icon,
    keyboardType = 'default' 
  }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Icon color="#7C3AED" size={20} />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const RoleCard = ({ role }: { role: any }) => (
    <TouchableOpacity
      style={[
        styles.roleCard,
        formData.role === role.value && styles.roleCardSelected
      ]}
      onPress={() => updateFormData('role', role.value)}
    >
      <View style={styles.roleHeader}>
        <Shield 
          color={formData.role === role.value ? '#7C3AED' : '#6B7280'} 
          size={20} 
        />
        <Text style={[
          styles.roleTitle,
          formData.role === role.value && styles.roleSelected
        ]}>
          {role.label}
        </Text>
      </View>
      <Text style={[
        styles.roleDescription,
        formData.role === role.value && styles.roleSelected
      ]}>
        {role.description}
      </Text>
    </TouchableOpacity>
  );

  const DepartmentSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Department</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.departmentScroll}
      >
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept}
            style={[
              styles.departmentChip,
              formData.department === dept && styles.departmentChipSelected
            ]}
            onPress={() => updateFormData('department', dept)}
          >
            <Text style={[
              styles.departmentChipText,
              formData.department === dept && styles.departmentChipTextSelected
            ]}>
              {dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.department && <Text style={styles.errorText}>{errors.department}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#8B5CF6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Add New User</Text>
            <Text style={styles.headerSubtitle}>Create a new user account</Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save color="white" size={18} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <InputField
              label="First Name"
              value={formData.firstName}
              onChangeText={(value: string) => updateFormData('firstName', value)}
              placeholder="Enter first name"
              error={errors.firstName}
              icon={User}
            />

            <InputField
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value: string) => updateFormData('lastName', value)}
              placeholder="Enter last name"
              error={errors.lastName}
              icon={User}
            />

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(value: string) => updateFormData('email', value)}
              placeholder="Enter email address"
              error={errors.email}
              icon={Mail}
              keyboardType="email-address"
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value: string) => updateFormData('phone', value)}
              placeholder="Enter phone number"
              error={errors.phone}
              icon={Phone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role & Access</Text>
            <View style={styles.rolesGrid}>
              {roles.map((role) => (
                <RoleCard key={role.value} role={role} />
              ))}
            </View>
          </View>

          {/* Department */}
          {(formData.role === 'student' || formData.role === 'parent') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Academic Information</Text>
              <DepartmentSelector />
              
              {formData.role === 'student' && (
                <InputField
                  label="Student ID"
                  value={formData.studentId || ''}
                  onChangeText={(value: string) => updateFormData('studentId', value)}
                  placeholder="Enter student ID"
                  error={errors.studentId}
                  icon={Calendar}
                />
              )}

              {formData.role === 'parent' && (
                <InputField
                  label="Parent Of (Student Name/ID)"
                  value={formData.parentOf || ''}
                  onChangeText={(value: string) => updateFormData('parentOf', value)}
                  placeholder="Enter student name or ID"
                  error={errors.parentOf}
                  icon={User}
                />
              )}
            </View>
          )}

          <TouchableOpacity style={styles.createButton} onPress={handleSave}>
            <UserPlus color="white" size={20} />
            <Text style={styles.createButtonText}>Create User Account</Text>
          </TouchableOpacity>
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
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 6,
  },
  rolesGrid: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F8FAFF',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  roleSelected: {
    color: '#7C3AED',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  departmentScroll: {
    marginBottom: 8,
  },
  departmentChip: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentChipSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  departmentChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  departmentChipTextSelected: {
    color: 'white',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
