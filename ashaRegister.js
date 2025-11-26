import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabaseClient';

export default function AshaRegister({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('register');
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [aidedUsers, setAidedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states for Create Consult
  const [consultModalVisible, setConsultModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [profType, setProfType] = useState('Doctor');
  const [symptoms, setSymptoms] = useState('');
  const [consultLoading, setConsultLoading] = useState(false);

  const { user } = route.params || {};

  useEffect(() => {
    fetchAidedUsers();
    const unsubscribe = navigation.addListener('focus', () => fetchAidedUsers());
    return unsubscribe;
  }, [navigation]);

  // Fetch aided users registered by this ASHA/CHO
  const fetchAidedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('asha_aidregis')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setAidedUsers(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch aided users');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAidedUsers();
    setRefreshing(false);
  };

  // Generate next patient ID
  const generateNextPatientId = async () => {
    try {
      const { data, error } = await supabase
        .from('asha_aidregis')
        .select('p_id')
        .order('p_id', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextId = 'AP0001';
      if (data && data.length > 0) {
        const lastId = data[0].p_id;
        const numPart = parseInt(lastId.replace('AP', ''), 10);
        const nextNum = numPart + 1;
        nextId = 'AP' + String(nextNum).padStart(4, '0');
      }
      return nextId;
    } catch (err) {
      throw err;
    }
  };

  // Sign up patient
  const handleSignUp = async () => {
    if (!patientName.trim()) {
      Alert.alert('Error', 'Patient name is required');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Error', 'Age is required');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Address is required');
      return;
    }

    setLoading(true);
    try {
      const nextPatientId = await generateNextPatientId();

      const { error } = await supabase.from('asha_aidregis').insert([
        {
          p_id: nextPatientId,
          p_name: patientName,
          p_phone: phoneNumber || null,
          p_age: parseInt(age),
          p_gender: gender,
          p_address: address,
          asha_id: user?.cho_id,
          asha_name: user?.cho_name,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Patient registered successfully');
      setPatientName('');
      setPhoneNumber('');
      setAge('');
      setGender('Male');
      setAddress('');
      await fetchAidedUsers();
    } catch (err) {
      Alert.alert('Error', 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  // Open Create Consult Modal
  const handleCreateConsult = (patient) => {
    setSelectedPatient(patient);
    setProfType('Doctor');
    setSymptoms('');
    setConsultModalVisible(true);
  };

  // Create consultation and insert to database
  const handleCreateConsultation = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Symptoms field is required');
      return;
    }

    setConsultLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_records')
        .insert([
          {
            patient_name: selectedPatient.p_name,
            patient_id: selectedPatient.p_id,
            phone_number: selectedPatient.p_phone || null,
            age: selectedPatient.p_age,
            gender: selectedPatient.p_gender,
            asha_id: user?.cho_id,
            asha_name: user?.cho_name,
            asha_pref: profType,
            asha_symptoms: symptoms,
            asha_aid: 'Yes',
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Consultation created successfully');
      setConsultModalVisible(false);
      setSelectedPatient(null);
      setProfType('Doctor');
      setSymptoms('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create consultation');
    } finally {
      setConsultLoading(false);
    }
  };

  const renderRegisterSection = () => (
    <View style={styles.registerBox}>
      <Text style={styles.registerBoxHeading}>Register Patient</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={patientName}
          onChangeText={setPatientName}
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            enabled={!loading}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient's Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient address"
          value={address}
          onChangeText={setAddress}
          multiline
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[styles.signupButton, loading && styles.signupButtonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAidedUserBox = (aidedUser) => (
    <View key={aidedUser.id} style={styles.aidedUserBox}>
      <Text style={styles.aidedUserName}>{aidedUser.p_name}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Patient ID:</Text>
        <Text style={styles.infoValue}>{aidedUser.p_id}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Age:</Text>
        <Text style={styles.infoValue}>{aidedUser.p_age}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Gender:</Text>
        <Text style={styles.infoValue}>{aidedUser.p_gender}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone No:</Text>
        <Text style={styles.infoValue}>{aidedUser.p_phone || 'N/A'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Address:</Text>
        <Text style={styles.infoValue}>{aidedUser.p_address}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Registered by:</Text>
        <Text style={styles.infoValue}>
          {aidedUser.asha_name} ({aidedUser.asha_id})
        </Text>
      </View>
      <TouchableOpacity
        style={styles.consultButton}
        onPress={() => handleCreateConsult(aidedUser)}
      >
        <Text style={styles.consultButtonText}>Create Consult</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Section Buttons */}
      <View style={styles.sectionButtonRow}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'register'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('register')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'register' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Register
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'aidedUsers'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('aidedUsers')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'aidedUsers' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Aided Users ({aidedUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'register' ? (
          renderRegisterSection()
        ) : aidedUsers.length > 0 ? (
          aidedUsers.map((aUser) => renderAidedUserBox(aUser))
        ) : (
          <Text style={styles.emptyText}>No aided users yet</Text>
        )}
      </ScrollView>

      {/* Create Consult Modal */}
      <Modal
        visible={consultModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !consultLoading && setConsultModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create Consultation</Text>

            {/* Professional Type - Radio Buttons */}
            <Text style={styles.modalLabel}>Enter Professional Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setProfType('Doctor')}
              >
                <View
                  style={[
                    styles.radioButton,
                    profType === 'Doctor' && styles.radioButtonSelected,
                  ]}
                >
                  {profType === 'Doctor' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Doctor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setProfType('CHO')}
              >
                <View
                  style={[
                    styles.radioButton,
                    profType === 'CHO' && styles.radioButtonSelected,
                  ]}
                >
                  {profType === 'CHO' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>CHO</Text>
              </TouchableOpacity>
            </View>

            {/* Symptoms Input */}
            <Text style={styles.modalLabel}>Enter Symptoms</Text>
            <TextInput
              style={styles.symptomsInput}
              placeholder="Describe symptoms"
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              editable={!consultLoading}
            />

            {/* Action Buttons */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => !consultLoading && setConsultModalVisible(false)}
                disabled={consultLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCreateButton,
                  consultLoading && styles.modalCreateButtonDisabled,
                ]}
                onPress={handleCreateConsultation}
                disabled={consultLoading}
              >
                <Text style={styles.modalCreateText}>
                  {consultLoading ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf7fa',
  },
  sectionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    marginBottom: 18,
  },
  sectionButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 2,
  },
  sectionButtonActive: {
    backgroundColor: '#36b5b0',
    borderColor: '#36b5b0',
    elevation: 4,
  },
  sectionButtonOutline: {
    backgroundColor: '#eaf7fa',
    borderColor: '#36b5b0',
  },
  sectionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#205099',
  },
  sectionButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  registerBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  registerBoxHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#36b5b0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#36b5b0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aidedUserBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  aidedUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#205099',
    width: 100,
  },
  infoValue: {
    fontSize: 13,
    color: '#434c59',
    flex: 1,
  },
  consultButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  consultButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#36b5b0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#36b5b0',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#36b5b0',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  symptomsInput: {
    borderWidth: 1,
    borderColor: '#36b5b0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#205099',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalCreateButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  modalCreateButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  modalCreateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
