import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { LanguageContext } from './LanguageContext';

const translations = {
  en: {
    title: 'Your Health. Anytime. Anywhere.',
    subtitle: 'Connecting patients, doctors, and pharmacies seamlessly.',
    consult: 'CONSULT NOW',
    emergency: 'EMERGENCY CARE',
    pharmacy: 'PHARMACY',
    symptom: 'SYMPTOM CHECKER',
    report: 'HEALTH REPORTS',
    emergencyCall: 'Call 112 in one tap',
    chooseLang: 'Choose Language',
  },
  pa: {
    title: 'ਤੁਹਾਡੇ ਡਾਕਟਰ ਦੀ ਭਾਲ ਕਰ ਰਹੇ ਹੋ?',
    subtitle: 'ਅਸੀਂ ਤੁਹਾਨੂੰ ਉਹਨਾਂ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਦੇ ਹਾਂ ਜੋ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਬੋਲਦੇ ਹਨ',
    consult: 'ਹੁਣ ਸੰਪਰਕ ਕਰੋ',
    emergency: 'ਐਮਰਜੈਂਸੀ ਕੇਅਰ',
    pharmacy: 'ਫਾਰਮੇਸੀ',
    symptom: 'ਲੱਛਣ ਚੈੱਕਰ',
    report: 'ਮੇਰੀ ਰਿਪੋਰਟਾਂ',
    emergencyCall: '112 ਤੇ ਇਕ ਟੈਪ ਨਾਲ ਕਾਲ ਕਰੋ',
    chooseLang: 'ਭਾਸ਼ਾ ਚੁਣੋ',
  },
  hi: {
    title: 'क्या आप डॉक्टर ढूंढ रहे हैं?',
    subtitle: 'हम आपको ऐसे डॉक्टरों से जोड़ते हैं जो आपकी पसंदीदा भाषा बोलते हैं',
    consult: 'अभी परामर्श करें',
    emergency: 'आपातकालीन देखभाल',
    pharmacy: 'फार्मेसी',
    symptom: 'लक्षण चेकर',
    report: 'मेरी रिपोर्ट्स',
    emergencyCall: '112 पर तुरंत कॉल करें',
    chooseLang: 'भाषा चुनें',
  },
  bn: {
    title: 'আপনার ডাক্তার খুঁজছেন?',
    subtitle: 'আমরা আপনাকে সেই ডাক্তারদের সাথে যুক্ত করি যারা আপনার ভাষায় কথা বলেন',
    consult: 'এখন পরামর্শ করুন',
    emergency: 'জরুরি সেবা',
    pharmacy: 'ফার্মেসি',
    symptom: 'লক্ষণ চেকার',
    report: 'আমার রিপোর্ট',
    emergencyCall: 'এক ক্লিকে 112 এ কল করুন',
    chooseLang: 'ভাষা নির্বাচন করুন',
  },
  ta: {
    title: 'உங்கள் மருத்துவரைத் தேடுகிறீர்களா?',
    subtitle: 'நாங்கள் உங்கள் மொழியில் பேசும் மருத்துவர்களை இணைக்கிறோம்',
    consult: 'இப்போது கலந்துரையாடவும்',
    emergency: 'அவசர சிகிச்சை',
    pharmacy: 'மருந்தகம்',
    symptom: 'அறிகுறி சேக்கர்',
    report: 'என் அறிக்கைகள்',
    emergencyCall: '112 ஐ ஒரு தட்டலில் அழைக்கவும்',
    chooseLang: 'மொழியைத் தேர்ந்தெடு',
  },
};

export default function PatientDashboard({ navigation, route }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const t = translations[language];
  const { patient } = route.params;

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setDropdownVisible(false);
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:112');
  };

  return (
    <LinearGradient colors={['#b3e5fc', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MediConnect</Text>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => navigation.navigate('Profile', { patient })}
          >
            <Text style={styles.profileInitial}>
              {patient?.name ? patient.name.charAt(0).toUpperCase() : "P"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency full-width button */}
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
          <Image source={require('./assets/call.png')} style={styles.emergencyIcon} />
          <View>
            <Text style={styles.emergencyTitle}>{t.emergency}</Text>
            <Text style={styles.emergencySubtitle}>{t.emergencyCall}</Text>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Consult button */}
        <TouchableOpacity style={styles.consult} onPress={() => navigation.navigate('consultform', { patient })}>
          <Text style={styles.consultText}>{t.consult}</Text>
        </TouchableOpacity>

        {/* Grid Buttons */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('pharmacy')}>
            <Image source={require('./assets/Drugstore.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.pharmacy}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('symptomChecker')}>
            <Image source={require('./assets/GenerativeAI.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.symptom}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton}>
            <Image source={require('./assets/report.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.report}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('EmergencyCareVideos')}>
            <Image source={require('./assets/call.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.emergency}</Text>
          </TouchableOpacity>
        </View>

        {/* Language selection at bottom */}
        <TouchableOpacity
          style={styles.langSelectButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.langSelectText}>{t.chooseLang}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#3a4d5c' },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#36b5b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    padding: 16,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  emergencyIcon: { width: 40, height: 40, marginRight: 12, tintColor: '#fff' },
  emergencyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emergencySubtitle: { color: '#fff', fontSize: 14 },

  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'left', color: '#205099', paddingHorizontal: 20 },
  subtitle: { fontSize: 14, marginBottom: 18, textAlign: 'left', color: '#434c59', paddingHorizontal: 20 },

  consult: {
    backgroundColor: '#36b5b0',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  consultText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  gridButton: {
    backgroundColor: '#fff',
    width: '47%',
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 18,
    elevation: 3,
    paddingVertical: 16,
  },
  buttonImage: { width: 55, height: 55, marginBottom: 8, resizeMode: 'contain' },
  buttonText: { fontWeight: 'bold', color: '#333', textAlign: 'center', fontSize: 15 },

  langSelectButton: {
    backgroundColor: '#205099',
    paddingVertical: 12,
    marginHorizontal: 80,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  langSelectText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dropdown: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 8 },
  dropdownItem: { paddingVertical: 8 },
  dropdownText: { fontSize: 16, color: '#205099' },
});
