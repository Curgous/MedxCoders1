import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import PatientDashboard from './patientdashboard';
import Patient from './patient';
import Doctor from './doctor';
import EmergencyCareVideos from './emergencycare';
import Signup from './signup';
import consultform from './consultform';
import pharmacy from './pharmacy';
import symptomChecker from './symptomchecker';
import DoctorDashboard from './DoctorDashboard';
import Cho from './cho';

// Import LanguageProvider and LanguageContext
import { LanguageProvider, LanguageContext } from './LanguageContext';

const Stack = createNativeStackNavigator();

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
];

// Translations specific to the Home screen UI texts
const homeTranslations = {
  en: { welcome: 'Welcome to MediConnect', patient: 'Patient', doctor: 'Doctor / CHO' },
  pa: { welcome: 'ਮੇਡੀਕਨੈਕਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ', patient: 'ਮਰੀਜ਼', doctor: 'ਡਾਕਟਰ / CHO' },
  hi: { welcome: 'मेडिकनेक्ट में आपका स्वागत है', patient: 'मरीज', doctor: 'डॉक्टर / CHO' },
  bn: { welcome: 'মেডিকনেক্টে স্বাগতম', patient: 'রোগী', doctor: 'ডাক্তার / CHO' },
  ta: { welcome: 'செயலிக்கு வருக.', patient: 'பேசுமணி', doctor: 'மருத்துவரும் / CHO' },
};

function HomeScreen({ navigation }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const t = homeTranslations[language] || homeTranslations.en;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.welcome}</Text>

      {/* Language selector button top right */}
      <View style={styles.langSelectorContainer}>
        <TouchableOpacity
          onPress={() => setDropdownVisible(true)}
          style={styles.langButton}
          activeOpacity={0.7}
        >
          <Image source={require('./assets/lang.png')} style={styles.langImage} />
        </TouchableOpacity>

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
      </View>

      {/* Patient Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Patient')}
      >
        <Text style={styles.buttonText}>{t.patient}</Text>
      </TouchableOpacity>

      {/* Doctor / CHO Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#205099' }]}
        onPress={() => navigation.navigate('Doctor')}
      >
        <Text style={styles.buttonText}>{t.doctor}</Text>
      </TouchableOpacity>
    </View>
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
    </LanguageProvider>
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

  langSelectorContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  langButton: {
    backgroundColor: '#d3d3d3',
    padding: 4,
    borderRadius: 6,
    width: 54,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  langImage: {
    width: 60,
    height: 34,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    width: 160,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#205099',
  },
});