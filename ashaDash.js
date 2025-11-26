import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function AshaDash({ navigation, route }) {
  const { user } = route.params || {};
  console.log({ user });
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>MediConnect</Text>

      {/* Subtitle */}
      <Text style={styles.dashboardTitle}>ASHA/ANM dashboard</Text>

      {/* Vertical actions */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AshaEmer", { user })}>
          <Image source={require('./assets/call.png')} style={styles.icon} />
          <Text style={styles.actionText}>Emergency Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}
          onPress={() => navigation.navigate("AshaRegister", { user })}>
          <Image source={require('./assets/report.png')} style={styles.icon} />
          <Text style={styles.actionText}>Assist Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AshaCon", { user })}>
          <Image source={require('./assets/verify.png')} style={[styles.icon, styles.iconLarge]} />
          <Text style={styles.actionText}>Consult Doctor/CHO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AshaLit", { user })}>
          <Image source={require('./assets/call.png')} style={styles.icon} />
          <Text style={styles.actionText}>Health Literacy Portal</Text>
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