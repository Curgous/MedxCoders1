import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, Alert, Modal, FlatList, Image
} from 'react-native';
import { supabase } from './supabaseClient';
import { LanguageContext } from './LanguageContext'; // Import global language context

const translations = {
  en: {
    appName: 'MediConnect',
    header: 'Patient Login',
    phonePlaceholder: 'Phone Number',
    passwordPlaceholder: 'Password',
    login: 'Login',
    loginSuccess: (name) => `Login successful\nWelcome ${name}!`,
    notRegistered: 'This phone number is not registered.',
    invalidCreds: 'Password is incorrect.',
    error: 'Error',
    signupText: "Don’t have an account? ",
    signupLink: 'Sign up',
  },
  pa: {
    appName: 'ਮੇਡੀਕਨੈਕਟ',
    header: 'ਮਰੀਜ਼ ਲੌਗਇਨ',
    phonePlaceholder: 'ਫੋਨ ਨੰਬਰ',
    passwordPlaceholder: 'ਪਾਸਵਰਡ',
    login: 'ਲੌਗਇਨ',
    loginSuccess: (name) => `ਲੌਗਇਨ ਸਫਲ\nਸੁਆਗਤ ਹੈ ${name}!`,
    notRegistered: 'ਇਹ ਫੋਨ ਨੰਬਰ ਦਰਜ ਨਹੀਂ ਹੈ।',
    invalidCreds: 'ਪਾਸਵਰਡ ਗਲਤ ਹੈ।',
    error: 'ਗਲਤੀ',
    signupText: "ਅਕਾਊਂਟ ਨਹੀਂ ਹੈ? ",
    signupLink: 'ਸਾਈਨ ਅੱਪ',
  },
  hi: {
    appName: 'मेडिकनेक्ट',
    header: 'मरीज लॉगिन',
    phonePlaceholder: 'फोन नंबर',
    passwordPlaceholder: 'पासवर्ड',
    login: 'लॉगिन',
    loginSuccess: (name) => `लॉगिन सफल\nस्वागत है ${name}!`,
    notRegistered: 'यह फोन नंबर पंजीकृत नहीं है।',
    invalidCreds: 'पासवर्ड गलत है।',
    error: 'त्रुटि',
    signupText: "खाता नहीं है? ",
    signupLink: 'साइन अप',
  },
  bn: {
    appName: 'মেডিকনেক্ট',
    header: 'রোগীর লগইন',
    phonePlaceholder: 'ফোন নম্বর',
    passwordPlaceholder: 'পাসওয়ার্ড',
    login: 'লগইন',
    loginSuccess: (name) => `লগইন সফল\nআপনাকে স্বাগতম ${name}!`,
    notRegistered: 'এই ফোন নম্বর নিবন্ধিত নয়।',
    invalidCreds: 'পাসওয়ার্ড সঠিক নয়।',
    error: 'ত্রুটি',
    signupText: "একাউন্ট নেই? ",
    signupLink: 'সাইন আপ',
  },
  ta: {
    appName: 'மெடிக்நெக்ட்',
    header: 'பேசுமணி நுழைவு',
    phonePlaceholder: 'தொலைபேசி எண்',
    passwordPlaceholder: 'கடவுச்சொல்',
    login: 'நுழைவு',
    loginSuccess: (name) => `நுழைவு வெற்றிகரமாக நடைபெற்றது\nவரவேற்கிறோம் ${name}!`,
    notRegistered: 'இந்த தொலைபேசி எண் பதிவு செய்யப்படவில்லை.',
    invalidCreds: 'கடவுச்சொல் தவறானது.',
    error: 'பிழை',
    signupText: "கணக்கு இல்லையா? ",
    signupLink: 'பதிவு செய்யவும்',
  },
};

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function Patient({ navigation }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone_no', phone)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          Alert.alert(t.error, t.notRegistered);
        } else {
          Alert.alert(t.error, error.message);
        }
        return;
      }

      if (data.password === password) {
        Alert.alert(t.login, t.loginSuccess(data.name));
        navigation.navigate('PatientDashboard', { patient: data });
      } else {
        Alert.alert(t.error, t.invalidCreds);
      }
    } catch (err) {
      Alert.alert(t.error, err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Language button and dropdown */}
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

        <Text style={styles.appName}>{t.appName}</Text>
        <Text style={styles.header}>{t.header}</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t.phonePlaceholder}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder={t.passwordPlaceholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>{t.login}</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>
            {t.signupText}
            <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
              {t.signupLink}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#36b5b0',
    marginBottom: 60,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#205099',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#36b5b0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  signupLink: {
    color: '#36b5b0',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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