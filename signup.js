import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabaseClient';
import { LanguageContext } from './LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

const translations = {
  en: {
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    password: 'Password',
    age: 'Age',
    selectGender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    signUp: 'Sign Up',
    alreadyHaveAccount: 'Already have an account? Login',
    patientRegistration: 'Patient Registration',
  },
  pa: {
    fullName: 'ਪੂਰਾ ਨਾਮ',
    phoneNumber: 'ਫੋਨ ਨੰਬਰ',
    password: 'ਪਾਸਵਰਡ',
    age: 'ਉਮਰ',
    selectGender: 'ਲਿੰਗ ਚੁਣੋ',
    male: 'ਮਰਦ',
    female: 'ਔਰਤ',
    signUp: 'ਰਜਿਸਟਰ ਕਰੋ',
    alreadyHaveAccount: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ਲੌਗਿਨ',
    patientRegistration: 'ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
  },
  hi: {
    fullName: 'पूरा नाम',
    phoneNumber: 'फ़ोन नंबर',
    password: 'पासवर्ड',
    age: 'आयु',
    selectGender: 'लिंग चुनें',
    male: 'पुरुष',
    female: 'महिला',
    signUp: 'साइन अप',
    alreadyHaveAccount: 'पहले से खाता है? लॉगिन',
    patientRegistration: 'रोगी पंजीकरण',
  },
  bn: {
    fullName: 'পুরো নাম',
    phoneNumber: 'ফোন নম্বর',
    password: 'পাসওয়ার্ড',
    age: 'বয়স',
    selectGender: 'লিঙ্গ নির্বাচন করুন',
    male: 'পুরুষ',
    female: 'মহিলা',
    signUp: 'সাইন আপ',
    alreadyHaveAccount: 'অ্যাকাউন্ট আছে? লগইন করুন',
    patientRegistration: 'রোগীর নিবন্ধন',
  },
  ta: {
    fullName: 'முழு பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    password: 'கடவுச்சொல்',
    age: 'வயது',
    selectGender: 'பாலினம் தேர்வு செய்க',
    male: 'ஆண்',
    female: 'பெண்',
    signUp: 'சைன் அப்',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு இருக்கிறதா? உள்நுழைய',
    patientRegistration: 'மருத்துவர் பதிவு',
  },
};

export default function Signup({ navigation }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const t = translations[language] || translations.en;

  const handleSignup = async () => {
    try {
      let { data: lastPatient, error: fetchError } = await supabase
        .from('patients')
        .select('patient_no')
        .order('patient_no', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      let newPatientNo = 'P00001';
      if (lastPatient.length > 0) {
        const lastId = lastPatient[0].patient_no;
        const num = parseInt(lastId.slice(1)) + 1;
        newPatientNo = 'P' + num.toString().padStart(5, '0');
      }

      const { data, error } = await supabase
        .from('patients')
        .insert([
          {
            patient_no: newPatientNo,
            password,
            phone_no: phone,
            name,
            age,
            gender,
          },
        ])
        .select('*');

      if (error) {
        alert('Signup failed: ' + error.message);
      } else if (data && data.length > 0) {
        alert('Signup successful! Your Patient ID is ' + data[0].patient_no);
        navigation.goBack();
      } else {
        alert('Signup successful, but could not fetch Patient ID');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.langButtonContainer}>
        <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.langButton}>
          <Image source={require('./assets/lang.png')} style={styles.langIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.appName}>MediConnect</Text>
        <Text style={styles.header}>{t.patientRegistration}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t.fullName}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder={t.phoneNumber}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder={t.password}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder={t.age}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label={t.selectGender} value="" />
              <Picker.Item label={t.male} value="Male" />
              <Picker.Item label={t.female} value="Female" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupText}>{t.signUp}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>{t.alreadyHaveAccount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLangModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.langOption}
                  onPress={() => {
                    changeLanguage(item.code);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={styles.langText}>
                    {item.label} ({item.native})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  langButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  langButton: {
    backgroundColor: '#ccc',
    padding: 8,
    borderRadius: 8,

  },
  langIcon: {
    width: 60,
    height: 34,
    resizeMode: 'contain',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000044',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '70%',
    paddingVertical: 20,
  },
  langOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  langText: {
    fontSize: 16,
  },
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
    marginBottom: 80,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  signupButton: {
    backgroundColor: '#36b5b0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    fontSize: 14,
    textAlign: 'center',
    color: '#205099',
    fontWeight: 'bold',
  },

});
