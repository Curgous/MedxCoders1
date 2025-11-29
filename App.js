import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // for WhatsApp logo
import HealthAwareness from './healthawareness';
// Import screens
import PatientDashboard from './patientdashboard';
import Patient from './patient';
import Doctor from './doctor';
import EmergencyCareVideos from './emergencycare';
import Signup from './signup';
import DocSignup from './docSignup';
import DocConsultView from './docConsultView';
import ChoSignup from './ChoSignup';

import consultform from './consultform';
import pharmacy from './pharmacy';
import Counsche from './counsche';
import Vidcon from './vidcon';

import symptomChecker from './symptomchecker';
import DoctorDashboard from './DoctorDashboard';
import Cho from './cho';
import Profile from './Profile';
import PharmacyLogin from './pharmacyLogin';
import PatientReports from './patientreports';
import PharmacistSignup from './pharmacistsignup';
import PharmacistPortal from './pharmacistportal';
import AddRemMedicine from './addremmedicine';
import CheckDemand from './checkdemand';
import ReportGen from "./reportgen";
import AshaDash from './ashaDash';
import AshaEmer from './ashaemer';
import AshaRegister from './ashaRegister';
import AshaLit from './ashaLit';
import AshaCon from './ashaCon';
import HealthLit from './healthLit';
import DocChoEmer from './docchoemer';
import DocEmer from './docemer';
import ChoCounsche from './chocounsche';
import ChoConsultView from './choConsultView';

// Import LanguageProvider and LanguageContext
import { LanguageProvider, LanguageContext } from './LanguageContext';
import ViewLit from './viewLit';

const Stack = createNativeStackNavigator();

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
];

const homeTranslations = {
  en: { welcome: 'Connecting You to Healthcare,\nAnytime, Anywhere', patient: 'Patient', doctor: 'Doctor / CHO', pharmacy: 'Pharmacy' },
  pa: { welcome: 'ਤੁਹਾਨੂੰ ਸਿਹਤ ਸੇਵਾਵਾਂ ਨਾਲ ਜੋੜ ਰਹੇ ਹਾਂ,\nਕਦੇ ਵੀ, ਕਿਤੇ ਵੀ', patient: 'ਮਰੀਜ਼', doctor: 'ਡਾਕਟਰ / CHO', pharmacy: 'ਫਾਰਮੇਸੀ' },
  hi: { welcome: 'आपको स्वास्थ्य सेवा से जोड़ना,\nकभी भी, कहीं भी', patient: 'मरीज', doctor: 'डॉक्टर / CHO', pharmacy: 'फਾਰਮੇਸੀ' },
  bn: { welcome: 'আপনাকে স্বাস্থ্যসেবার সাথে যুক্ত করা,\nযেকোনো সময়, যেকোনো জায়গায়', patient: 'রোগী', doctor: 'ডাক্তার / CHO', pharmacy: 'ফার্মেসি' },
  ta: { welcome: 'உங்களை சுகாதாரத்துடன் இணைக்கிறோம்,\nஎப்போதும், எங்கும்', patient: 'நோயாளர்', doctor: 'மருத்துவர் / CHO', pharmacy: 'மருந்தகம்' },
};

function HomeScreen({ navigation }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const t = homeTranslations[language] || homeTranslations.en;

  return (
    <LinearGradient colors={['#B0E0E6', '#FFFFFF']} style={styles.container}>
      {/* App name + tagline */}
      <Text style={styles.appName}>MediConnect</Text>
      <Text style={styles.tagline}>{t.welcome}</Text>

      {/* Patient Button */}
      <TouchableOpacity style={styles.patientButton} onPress={() => navigation.navigate('Patient')}>
        <Text style={styles.buttonText}>{t.patient}</Text>
      </TouchableOpacity>

      {/* Doctor Button */}
      <TouchableOpacity style={styles.doctorButton} onPress={() => navigation.navigate('Doctor')}>
        <Text style={styles.buttonText}>{t.doctor}</Text>
      </TouchableOpacity>

      {/* Pharmacy Button */}
      <TouchableOpacity style={styles.pharmacyButton} onPress={() => navigation.navigate('PharmacyLogin')}>
        <Text style={styles.buttonText}>{t.pharmacy}</Text>
      </TouchableOpacity>

      {/* Change Language */}
      <TouchableOpacity onPress={() => setDropdownVisible(true)} style={styles.langSelector}>
        <Text style={styles.langSelectorText}>Change Language ▼</Text>
      </TouchableOpacity>
      {/* WhatsApp Floating Button */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => Linking.openURL("https://wa.me/+917395922435")} // replace with your number
      >
        <FontAwesome name="whatsapp" size={28} color="#fff" />
      </TouchableOpacity>
      {/* Dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    changeLanguage(item.code);
                    setDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      item.code === language && { fontWeight: 'bold', color: '#36b5b0' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>


      </Modal>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Patient" component={Patient} />
          <Stack.Screen name="Doctor" component={Doctor} />
          <Stack.Screen name="PharmacyLogin" component={PharmacyLogin} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
          <Stack.Screen name="consultform" component={consultform} />
          <Stack.Screen name="pharmacy" component={pharmacy} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="symptomChecker" component={symptomChecker} />
          <Stack.Screen name="Cho" component={Cho} />
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
          <Stack.Screen name="PatientReports" component={PatientReports} options={{ headerShown: false, title: 'Patient Reports' }} />

          <Stack.Screen
            name="EmergencyCareVideos"
            component={EmergencyCareVideos}
            options={{ title: 'Emergency Care Videos' }}
          />

          <Stack.Screen
            name="PharmacistSignup"
            component={PharmacistSignup}
            options={{ title: 'Pharmacist Signup' }}
          />

          <Stack.Screen
            name="PharmacistPortal"
            component={PharmacistPortal}
            options={{ title: "Pharmacist Portal" }}
          />

          <Stack.Screen
            name="AddRemMedicine"
            component={AddRemMedicine}
            options={{ title: "Add/Remove Medicine" }}
          />

          <Stack.Screen
            name="CheckDemand"
            component={CheckDemand}
            options={{ title: "Current Medicine Demands" }}
          />

          <Stack.Screen name="ReportGen" component={ReportGen} />
          <Stack.Screen name="Counsche" component={Counsche} />
          <Stack.Screen name="Vidcon" component={Vidcon} />
          <Stack.Screen name="HealthAwareness" component={HealthAwareness} />
          <Stack.Screen name="DocSignup" component={DocSignup} />

          <Stack.Screen
            name="DocConsultView"
            component={DocConsultView}
            options={{ headerShown: false, title: 'Consults' }}
          />

          <Stack.Screen name="ChoSignup" component={ChoSignup} />
          <Stack.Screen name="AshaDash" component={AshaDash} />
          <Stack.Screen name="AshaEmer" component={AshaEmer} />
          <Stack.Screen name="AshaRegister" component={AshaRegister} />
          <Stack.Screen name="AshaLit" component={AshaLit} />
          <Stack.Screen name="AshaCon" component={AshaCon} />
          <Stack.Screen name="HealthLit" component={HealthLit} />
          <Stack.Screen name="ViewLit" component={ViewLit} />
          <Stack.Screen name="DocChoEmer" component={DocChoEmer} />
          <Stack.Screen name="DocEmer" component={DocEmer} />
          <Stack.Screen name="ChoCounsche" component={ChoCounsche} />
          <Stack.Screen name="ChoConsultView" component={ChoConsultView} />
        </Stack.Navigator>

      </NavigationContainer>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  appName: { fontSize: 26, fontWeight: 'bold', color: '#205099', marginBottom: 8 },
  tagline: { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 40 },

  patientButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    marginBottom: 16,
    alignItems: 'center',
  },
  doctorButton: {
    backgroundColor: '#205099',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    marginBottom: 16,
    alignItems: 'center',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  pharmacyButton: {
    backgroundColor: '#5f91c7ff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  langSelector: { marginTop: 10 },
  langSelectorText: { fontSize: 14, color: '#205099', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: { backgroundColor: '#fff', borderRadius: 8, padding: 12, width: 180 },
  dropdownItem: { paddingVertical: 8 },
  dropdownText: { fontSize: 16, color: '#205099' },
});
