// App.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import PatientDashboard from './patientdashboard';
import Patient from './patient';
import Doctor from './doctor';
import EmergencyCareVideos from './emergencycare';
import Signup from './signup';
import consultform from './consultform';     // Consultation Form component
import pharmacy from './pharmacy';           // Pharmacy component
import symptomChecker from './symptomchecker'; // Symptom Checker component
import DoctorDashboard from './DoctorDashboard';
import Cho from './cho';
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MediConnect</Text>

      {/* Patient Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Patient')}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>

      {/* Doctor Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#205099' }]}
        onPress={() => navigation.navigate('Doctor')}
      >
        <Text style={styles.buttonText}>Doctor / CHO</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patient" component={Patient} />
        <Stack.Screen name="Doctor" component={Doctor} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
        <Stack.Screen name="consultform" component={consultform} />
        <Stack.Screen name="pharmacy" component={pharmacy} />
        <Stack.Screen name="symptomChecker" component={symptomChecker} />
        <Stack.Screen name="Cho" component={Cho} />
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="EmergencyCareVideos" component={EmergencyCareVideos} options={{ title: "Emergency Care Videos" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: {
    backgroundColor: '#36b5b0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
