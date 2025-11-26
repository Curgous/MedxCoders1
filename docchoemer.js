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
} from 'react-native';
import { supabase } from './supabaseClient';

export default function DocChoEmer({ navigation,route }) {
  const [activeTab, setActiveTab] = useState('liveAlerts');
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [acceptedAlerts, setAcceptedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = route.params || {};
  console.log({ user });

  useEffect(() => {
    fetchAlerts();
    const unsubscribe = navigation.addListener('focus', () => fetchAlerts());
    return unsubscribe;
  }, [navigation]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data: liveData, error: liveError } = await supabase
        .from('p_emergency')
        .select('*')
        .eq('p_status', 'assigning')
        .order('p_time', { ascending: false });

      if (liveError) throw liveError;
      setLiveAlerts(liveData || []);

      const { data: acceptedData, error: acceptedError } = await supabase
        .from('p_emergency')
        .select('*')
        .eq('p_status', 'assigned')
        .order('p_time', { ascending: false });

      if (acceptedError) throw acceptedError;
      setAcceptedAlerts(acceptedData || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const handleAccept = async (emerId) => {
    try {
      const { error } = await supabase
        .from('p_emergency')
        .update({ p_status: 'assigned',assigned_ashaid: user.cho_id,
        assigned_ashanm: user.cho_name, })
        .eq('emer_id', emerId);

      if (error) throw error;
      Alert.alert('Success', 'Status updated successfully');
      await fetchAlerts();
    } catch (err) {
      Alert.alert('Error', 'Error updating status');
    }
  };

  const handleNotifyDoctorCho = async (emerId) => {
    try {
      const { error } = await supabase
        .from('p_emergency')
        .update({ p_status: 'assigning' })
        .eq('emer_id', emerId);

      if (error) throw error;
      Alert.alert('Success', 'Status updated successfully');
      await fetchAlerts();
    } catch (err) {
      Alert.alert('Error', 'Error updating status');
    }
  };

  const openLocation = (location) => {
    if (location && location.latitude && location.longitude) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open location');
      });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'N/A';
    }
  };

  const renderAlertBox = (alert, showAcceptButton = true) => (
    <View key={alert.emer_id} style={styles.alertBox}>
      <Text style={styles.timeDisplay}>{formatTime(alert.p_time)}</Text>
      <View style={styles.alertContent}>
        <Text style={styles.patientName}>{alert.p_name || 'N/A'}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Patient ID:</Text>
          <Text style={styles.value}>{alert.p_id || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Symptoms:</Text>
          <Text style={styles.value}>{alert.p_symptoms || 'N/A'}</Text>
        </View>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => openLocation(alert.p_loc)}
        >
          <Text style={styles.locationButtonText}>View Location</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionButtonContainer}>
        {showAcceptButton ? (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(alert.emer_id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.notifyButton}
            onPress={() => handleNotifyDoctorCho(alert.emer_id)}
          >
            <Text style={styles.notifyButtonText}>Notify Doctor/CHO</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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
            activeTab === 'liveAlerts'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('liveAlerts')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'liveAlerts' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Live Alerts ({liveAlerts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'assigned'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('assigned')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'assigned' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Accepted ({acceptedAlerts.length})
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
        {activeTab === 'liveAlerts' ? (
          liveAlerts.length > 0 ? (
            liveAlerts.map((alert) => renderAlertBox(alert, true))
          ) : (
            <Text style={styles.emptyText}>No live alerts</Text>
          )
        ) : (
          acceptedAlerts.length > 0 ? (
            acceptedAlerts.map((alert) => renderAlertBox(alert, false))
          ) : (
            <Text style={styles.emptyText}>No accepted emergencies</Text>
          )
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
    marginTop: 38,
    marginBottom: 18,
  },
  sectionButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 15,
    borderRadius: 12,
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
  alertBox: {
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
  timeDisplay: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  alertContent: {
    marginTop: 20,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#205099',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#434c59',
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  actionButtonContainer: {
    alignItems: 'stretch',
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notifyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#205099',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
