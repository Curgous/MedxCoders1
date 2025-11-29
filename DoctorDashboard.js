import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function DoctorDashboard({ navigation, route }) {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>MediConnect</Text>

      {/* Subtitle */}
      <Text style={styles.dashboardTitle}>Doctor dashboard</Text>

      {/* Scrollable Vertical actions */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to counsche.js screen, passing necessary params
              navigation.navigate('Counsche', {
                dr_name: user?.name,
                dr_id: user?.doc_id,
              });
            }}
          >
            <Image source={require('./assets/cal.png')} style={styles.icon} />
            <Text style={styles.actionText}>Counselling Schedules</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("DocEmer", { user })}
          >
            <Image source={require('./assets/call.png')} style={styles.icon} />
            <Text style={styles.actionText}>Emergency Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ReportGen", { user })}
          >
            <Image source={require('./assets/report.png')} style={styles.icon} />
            <Text style={styles.actionText}>Reports & Transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("DocConsultView", { user })}
          >
            <Image source={require('./assets/verify.png')} style={[styles.icon, styles.iconLarge]} />
            <Text style={styles.actionText}>Verify Consults & Symptoms</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate("HealthLit", { user })}
          >
            <Image source={require('./assets/cal.png')} style={styles.icon} />
            <Text style={styles.actionText}>Health Literacy Portal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf7fa',
    padding: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a4c5c',
    marginTop: 28,
    marginBottom: 18,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#205099',
    marginTop: 20,
    marginBottom: 2,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 20,
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