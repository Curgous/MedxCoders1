import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import emergencycare from './emergencycare'; // Import the videos screen component

const translations = {
  en: {
    title: 'Your Doctor, Anytime. Anywhere.',
    subtitle: 'WE CONNECT YOU WITH DOCTORS WHO SPEAK YOUR PREFERRED LANGUAGE.',
    consult: 'CONSULT NOW',
    emergency: 'EMERGENCY CARE',
    pharmacy: 'PHARMACY',
    symptom: 'SYMPTOM CHECKER',
    report: 'REPORT',
  },
  // ... other languages as before ...
  pa: {
    title: 'ਤੁਹਾਡਾ ਡਾਕਟਰ, ਕਦੇ ਵੀ। ਕਿਤੇ ਵੀ।',
    subtitle: 'ਅਸੀਂ ਤੁਹਾਡੇ ਨਾਲ ਉਹ ਡਾਕਟਰ ਜੋੜਦੇ ਹਾਂ ਜੋ ਤੁਹਾਡੇ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਬੋਲਦੇ ਹਨ।',
    consult: 'ਹੁਣ ਸੰਪਰਕ ਕਰੋ',
    emergency: 'ਐਮਰਜੈਂਸੀ ਕੇਅਰ',
    pharmacy: 'ਫਾਰਮੇਸੀ',
    symptom: 'ਲੱਛਣ ਚੈੱਕਰ',
    report: 'ਰਿਪੋਰਟ',
  },
  hi: {
    title: 'आपका डॉक्टर, कभी भी। कहीं भी।',
    subtitle: 'हम आपको ऐसे डॉक्टरों से जोड़ते हैं जो आपकी पसंदीदा भाषा बोलते हैं।',
    consult: 'अभी परामर्श करें',
    emergency: 'आपातकालीन देखभाल',
    pharmacy: 'फार्मेसी',
    symptom: 'लक्षण चेक',
    report: 'रिपोर्ट',
  },
  bn: {
    title: 'আপনার ডাক্তারের সেবা, যেকোনো সময়। যেকোনো জায়গায়।',
    subtitle: 'আমরা আপনাকে সেই ডাক্তারদের সাথে সংযুক্ত করি যারা আপনার পছন্দের ভাষায় কথা বলেন।',
    consult: 'এখন পরামর্শ করুন',
    emergency: 'আপাতকালীন যত্ন',
    pharmacy: 'ফার্মেসি',
    symptom: 'লক্ষণ চেকার',
    report: 'রিপোর্ট',
  },
  ta: {
    title: 'உங்கள் மருத்துவர், எப்போதும். எங்கும்.',
    subtitle: 'நாங்கள் உங்கள் விருப்ப மொழியில் பேசும் மருத்துவர்களை இணைக்கிறோம்.',
    consult: 'இப்போது கலந்தாய்வு செய்',
    emergency: 'அசாதாரண சிகிச்சை',
    pharmacy: 'மருந்தகம்',
    symptom: 'அறிகுறி சோதனை',
    report: 'அறிக்கை',
  },
};

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MediConnect</Text>
        <TouchableOpacity style={styles.langButton} onPress={() => setDropdownVisible(true)}>
          <Image source={require('./assets/lang.png')} style={styles.langImage} />
        </TouchableOpacity>
      </View>

      {/* Dropdown menu */}
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
            <TouchableOpacity onPress={() => selectLanguage('en')} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLanguage('pa')} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>ਪੰਜਾਬੀ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLanguage('hi')} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>हिन्दी</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLanguage('bn')} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>বাংলা</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLanguage('ta')} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>தமிழ்</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content with dynamic translation */}
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <TouchableOpacity style={styles.consult}>
        <Text style={styles.consultText}>{t.consult}</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate('emergencycare')}
        >
          <Image source={require('./assets/call.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>{t.emergency}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <Image source={require('./assets/Drugstore.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>{t.pharmacy}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <Image source={require('./assets/GenerativeAI.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>{t.symptom}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridButton}>
          <Image source={require('./assets/report.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>{t.report}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="emergencycare" component={emergencycare} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf7fa', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 22 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#3a4d5c' },
  langButton: {
    marginLeft: 'auto',
    backgroundColor: '#d3d3d3',
    padding: 4,
    borderRadius: 6,
  },
  langImage: { width: 60, height: 34, resizeMode: 'contain' },
  modalOverlay: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: 54, marginRight: 12 },
  dropdown: { backgroundColor: '#fff', padding: 10, borderRadius: 8, elevation: 8 },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdownText: { fontSize: 16, color: '#205099' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6, marginTop: 20 },
  subtitle: { fontSize: 14, marginBottom: 18, color: '#434c59' },
  consult: { backgroundColor: '#36b5b0', alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, marginBottom: 20 },
  consultText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20, gap: 16 },
  gridButton: {
    backgroundColor: '#fff',
    width: '47%',
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 18,
    elevation: 2,
    paddingVertical: 14,
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  buttonText: { fontWeight: 'bold', color: '#333', textAlign: 'center' },
});
