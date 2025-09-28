import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function DoctorDashboard({ navigation, route }) {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>MediConnect</Text>

      {/* Subtitle */}
      <Text style={styles.dashboardTitle}>Doctor / CHO dashboard</Text>

      {/* Vertical actions */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={() => { /* navigation logic */ }}>
          <Image source={require('./assets/cal.png')} style={styles.icon} />
          <Text style={styles.actionText}>Counselling Schedules</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} 
          onPress={() => navigation.navigate("ReportGen", { user })}>
          <Image source={require('./assets/report.png')} style={styles.icon} />
          <Text style={styles.actionText}>Reports & Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => { /* navigation logic */ }}>
          <Image source={require('./assets/verify.png')} style={[styles.icon, styles.iconLarge]} />
          <Text style={styles.actionText}>Verify Symptoms</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf7fa',
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a4d5c',
    marginTop: 28,
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#205099',
    marginTop: 20,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  buttonGroup: {
    width: '100%',
    marginTop: 38,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '95%',
    paddingVertical: 18,
    marginBottom: 22,
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  iconLarge: {
    width: 62,
    height: 62,
  },
  actionText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 18,
  },
});