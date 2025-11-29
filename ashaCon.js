import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { supabase } from './supabaseClient';

export default function AshaCon({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('counselling');
  const [counsellingData, setCounsellingData] = useState([]);
  const [professionalsData, setProfessionalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);

  const { user } = route.params || {};

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', () => fetchData());
    return unsubscribe;
  }, [navigation]);

  // Fetch counselling schedules and patient names
  const fetchCounsellingData = async () => {
    try {
      const { data: schedules, error: scheduleError } = await supabase
        .from('coun_sche')
        .select('*')
        .eq('asha_id', user?.cho_id)
        .order('date', { ascending: false });

      if (scheduleError) throw scheduleError;

      // For each schedule, fetch patient name
      const enrichedData = await Promise.all(
        (schedules || []).map(async (schedule) => {
          const { data: patient, error: patientError } = await supabase
            .from('asha_aidregis')
            .select('p_name')
            .eq('p_id', schedule.pat_id)
            .single();

          if (patientError) {
            console.log('Patient not found for ID:', schedule.pat_id);
            return { ...schedule, patient_name: 'N/A' };
          }
          console.log('Fetched patient:', patient);
          return { ...schedule, patient_name: patient?.p_name || 'N/A' };
        })
      );

      setCounsellingData(enrichedData);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch counselling data');
    }
  };

  // Fetch all professionals (doctors)
  const fetchProfessionalsData = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProfessionalsData(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch professionals');
    }
  };

  // Fetch both
  const fetchData = async () => {
    setLoading(true);
    await fetchCounsellingData();
    await fetchProfessionalsData();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Handle voice call
  const handleVoiceCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Could not initiate call');
    });
  };

  // Handle open link
  const handleOpenLink = (link) => {
    if (!link) {
      Alert.alert('Error', 'Link not available');
      return;
    }
    Linking.openURL(link).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  // Render counselling schedule box
  const renderCounsellingBox = (schedule) => {
    const isExpanded = expandedScheduleId === schedule.id;

    return (
      <View key={schedule.id} style={styles.counsellingBox}>
        <View style={styles.counsellingHeader}>
          <View style={styles.leftHeader}>
            <Text style={styles.counsellingBoxTitle}>
              {schedule.patient_name}
            </Text>
            <Text style={styles.boxSubLabel}>Patient Name</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.counsellingBoxTitle}>{schedule.dr_name}</Text>
            <Text style={styles.boxSubLabel}>Professional Name</Text>
          </View>
        </View>

        <View style={styles.counsellingContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Professional Type:</Text>
            <Text style={styles.infoValue}>{schedule.she_type}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Professional Id:</Text>
              <Text style={styles.infoValue}>{schedule.dr_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patient Id:</Text>
              <Text style={styles.infoValue}>{schedule.pat_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Schedule:</Text>
              <Text style={styles.infoValue}>{formatDate(schedule.date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time of Schedule:</Text>
              <Text style={styles.infoValue}>{schedule.time || 'N/A'}</Text>
            </View>
            {schedule.vid_link && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleOpenLink(schedule.vid_link)}
              >
                <Text style={styles.linkButtonText}>Open Link</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.showDetailsButton}
          onPress={() =>
            setExpandedScheduleId(isExpanded ? null : schedule.id)
          }
        >
          <Text style={styles.showDetailsText}>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render professional (doctor) box
  const renderProfessionalBox = (professional) => {
    return (
      <View key={professional.id} style={styles.professionalBox}>
        <View style={styles.professionalHeader}>
          <View style={styles.professionalNameSection}>
            <Text style={styles.professionalBoxTitle}>
              {professional.name}
            </Text>
            <Text style={styles.boxSubLabel}>Doctor Name</Text>
          </View>
          <View style={styles.professionalIdSection}>
            <Text style={styles.professionalId}>{professional.doc_id}</Text>
            <Text style={styles.boxSubLabel}>Doctor ID</Text>
          </View>
        </View>

        <View style={styles.professionalContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Professional Type:</Text>
            <Text style={styles.infoValue}>{professional.specialist}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.voiceCallButton}
          onPress={() => handleVoiceCall(professional.phone_no)}
        >
          <Text style={styles.voiceCallButtonText}>Voice Call</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#36b5b0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Buttons */}
      <View style={styles.sectionButtonRow}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'counselling'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('counselling')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'counselling' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Counselling ({counsellingData.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'professionals'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('professionals')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'professionals'
                ? styles.sectionButtonTextActive
                : {},
            ]}
          >
            Professionals ({professionalsData.length})
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
        {activeTab === 'counselling' ? (
          counsellingData.length > 0 ? (
            counsellingData.map((schedule) => renderCounsellingBox(schedule))
          ) : (
            <Text style={styles.emptyText}>No counselling schedules</Text>
          )
        ) : professionalsData.length > 0 ? (
          professionalsData.map((professional) =>
            renderProfessionalBox(professional)
          )
        ) : (
          <Text style={styles.emptyText}>No professionals available</Text>
        )}
      </ScrollView>
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
    paddingHorizontal: 8,
  },
  sectionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
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
    fontSize: 13,
    color: '#205099',
  },
  sectionButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Counselling Styles
  counsellingBox: {
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
  counsellingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  leftHeader: {
    flex: 1,
  },
  rightHeader: {
    flex: 1,
    alignItems: 'flex-end',
  },
  counsellingBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#205099',
  },
  boxSubLabel: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  counsellingContent: {
    marginBottom: 12,
  },
  expandedContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#205099',
    width: 130,
  },
  infoValue: {
    fontSize: 12,
    color: '#434c59',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  showDetailsButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  showDetailsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // Professional Styles
  professionalBox: {
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
  professionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  professionalNameSection: {
    flex: 1,
  },
  professionalIdSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  professionalBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#205099',
  },
  professionalId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#36b5b0',
  },
  professionalContent: {
    marginBottom: 14,
  },
  voiceCallButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  voiceCallButtonText: {
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
});
