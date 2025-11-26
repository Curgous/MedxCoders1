import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { supabase } from './supabaseClient';
import { LanguageContext } from './LanguageContext';

const translations = {
  en: {
    title: 'Your Health. Anytime. Anywhere.',
    subtitle: 'Connecting patients, doctors, and pharmacies seamlessly.',
    consult: 'CONSULT NOW',
    healthAwareness: 'HEALTH AWARENESS',
    emergency: 'EMERGENCY CARE',
    pharmacy: 'PHARMACY',
    symptom: 'SYMPTOM CHECKER',
    report: 'HEALTH REPORTS',
    emergencyCall: 'Call 112 in one tap',
    chooseLang: 'Choose Language',
    enterSymptoms: 'Please describe your symptoms or emergency (optional):',
    placeholderSymptoms: 'Describe symptoms, emergency info, etc.',
    skip: 'Skip',
    submit: 'Submit',
    liveOverview: 'Live Overview',
    status: 'Status',
    ashaWorker: 'ASHA/ANM Worker',
    assignedExpert: 'Assigned Expert',
    expertType: 'Expert Type',
    cancel: 'Cancel',
    noEmergencyActive: 'No active emergency',
    pending: 'Pending',
    pleaseWait: 'Please wait...',
    emergencyActive: 'Emergency in Progress',
    completeCurrentEmergency: 'Please complete or cancel your current emergency first',
  },
  pa: {
    title: 'ਤੁਹਾਡੇ ਡਾਕਟਰ ਦੀ ਭਾਲ ਕਰ ਰਹੇ ਹੋ?',
    subtitle: 'ਅਸੀਂ ਤੁਹਾਨੂੰ ਉਹਨਾਂ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਦੇ ਹਾਂ ਜੋ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਬੋਲਦੇ ਹਨ',
    consult: 'ਹੁਣ ਸੰਪਰਕ ਕਰੋ',
    healthAwareness: 'ਸਿਹਤ ਜਾਗਰੂਕਤਾ',
    emergency: 'ਐਮਰਜੈਂਸੀ ਕੇਅਰ',
    pharmacy: 'ਫਾਰਮੇਸੀ',
    symptom: 'ਲੱਛਣ ਚੈੱਕਰ',
    report: 'ਮੇਰੀ ਰਿਪੋਰਟਾਂ',
    emergencyCall: '112 ਤੇ ਇਕ ਟੈਪ ਨਾਲ ਕਾਲ ਕਰੋ',
    chooseLang: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    enterSymptoms: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਜਾਂ ਐਮਰਜੈੰਸੀ ਦਾ ਵਰਣਨ ਕਰੋ:',
    placeholderSymptoms: 'ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ',
    skip: 'ਛੱਡੋ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    liveOverview: 'ਲਾਈਵ ਓਵਰਵਿਊ',
    status: 'ਸਥਿਤੀ',
    ashaWorker: 'ਆਸ਼ਾ/ਏਐਨਐਮ ਵਰਕਰ',
    assignedExpert: 'ਨਿਯੁਕਤ ਮਾਹਿਰ',
    expertType: 'ਮਾਹਿਰ ਦੀ ਕਿਸਮ',
    cancel: 'ਰੱਦ ਕਰੋ',
    noEmergencyActive: 'ਕੋਈ ਸਰਗਰਮ ਐਮਰਜੈਂਸੀ ਨਹੀਂ',
    pending: 'ਬਕਾਇਆ',
    pleaseWait: 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ...',
    emergencyActive: 'ਐਮਰਜੈਂਸੀ ਜਾਰੀ ਹੈ',
    completeCurrentEmergency: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਆਪਣੀ ਮੌਜੂਦਾ ਐਮਰਜੈਂਸੀ ਨੂੰ ਪੂਰਾ ਕਰੋ ਜਾਂ ਰੱਦ ਕਰੋ',
  },
  hi: {
    title: 'क्या आप डॉक्टर ढूंढ रहे हैं?',
    subtitle: 'हम आपको ऐसे डॉक्टरों से जोड़ते हैं जो आपकी पसंदीदा भाषा बोलते हैं',
    consult: 'अभी परामर्श करें',
    healthAwareness: 'स्वस्थ्य जागरूकता',
    emergency: 'आपातकालीन देखभाल',
    pharmacy: 'फार्मेसी',
    symptom: 'लक्षण चेकर',
    report: 'मेरी रिपोर्ट्स',
    emergencyCall: '112 पर तुरंत कॉल करें',
    chooseLang: 'भाषा चुनें',
    enterSymptoms: 'कृपया अपने लक्षणों या आपातकाल का वर्णन करें:',
    placeholderSymptoms: 'लक्षणों का वर्णन करें',
    skip: 'छोड़ें',
    submit: 'जमा करें',
    liveOverview: 'लाइव अवलोकन',
    status: 'स्थिति',
    ashaWorker: 'आशा/एएनएम कार्यकर्ता',
    assignedExpert: 'नियुक्त विशेषज्ञ',
    expertType: 'विशेषज्ञ प्रकार',
    cancel: 'रद्द करें',
    noEmergencyActive: 'कोई सक्रिय आपातकाल नहीं',
    pending: 'लंबित',
    pleaseWait: 'कृपया प्रतीक्षा करें...',
    emergencyActive: 'आपातकाल चल रहा है',
    completeCurrentEmergency: 'कृपया पहले अपने वर्तमान आपातकाल को पूरा करें या रद्द करें',
  },
  bn: {
    title: 'আপনার ডাক্তার খুঁজছেন?',
    subtitle: 'আমরা আপনাকে সেই ডাক্তারদের সাথে যুক্ত করি যারা আপনার ভাষায় কথা বলেন',
    consult: 'এখন পরামর্শ করুন',
    healthAwareness: 'স্বাস্থ্য সচেতনতা',
    emergency: 'জরুরি সেবা',
    pharmacy: 'ফার্মেসি',
    symptom: 'লক্ষণ চেকার',
    report: 'আমার রিপোর্ট',
    emergencyCall: 'এক ক্লিকে 112 এ কল করুন',
    chooseLang: 'ভাষা নির্বাচন করুন',
    enterSymptoms: 'অনুগ্রহ করে আপনার লক্ষণ বা জরুরি অবস্থা বর্ণনা করুন:',
    placeholderSymptoms: 'লক্ষণ বর্ণনা করুন',
    skip: 'এড়িয়ে যান',
    submit: 'জমা দিন',
    liveOverview: 'লাইভ ওভারভিউ',
    status: 'স্থিতি',
    ashaWorker: 'আশা/এএনএম কর্মী',
    assignedExpert: 'নিয়োজিত বিশেষজ্ঞ',
    expertType: 'বিশেষজ্ঞের ধরন',
    cancel: 'বাতিল করুন',
    noEmergencyActive: 'কোন সক্রিয় জরুরি অবস্থা নেই',
    pending: 'বিচারাধীন',
    pleaseWait: 'অনুগ্রহ করে অপেক্ষা করুন...',
    emergencyActive: 'জরুরি অবস্থা চলছে',
    completeCurrentEmergency: 'অনুগ্রহ করে প্রথমে আপনার বর্তমান জরুরি অবস্থা সম্পূর্ণ করুন বা বাতিল করুন',
  },
  ta: {
    title: 'உங்கள் மருத்துவரைத் தேடுகிறீர்களா?',
    subtitle: 'நாங்கள் உங்கள் மொழியில் பேசும் மருத்துவர்களை இணைக்கிறோம்',
    consult: 'இப்போது கலந்துரையாடவும்',
    healthAwareness: 'சுகாதார விழிப்புணர்வு',
    emergency: 'அவசர சிகிச்சை',
    pharmacy: 'மருந்தகம்',
    symptom: 'அறிகுறி சேக்கர்',
    report: 'என் அறிக்கைகள்',
    emergencyCall: '112 ஐ ஒரு தட்டலில் அழைக்கவும்',
    chooseLang: 'மொழியைத் தேர்ந்தெடு',
    enterSymptoms: 'உங்கள் அறிகுறிகள் அல்லது அவசரநிலையை விவரிக்கவும்:',
    placeholderSymptoms: 'அறிகுறிகளை விவரிக்கவும்',
    skip: 'தவிர்க்கவும்',
    submit: 'சமர்ப்பிக்கவும்',
    liveOverview: 'நேரடி கண்ணோட்டம்',
    status: 'நிலை',
    ashaWorker: 'ஆஷா/ANM பணியாளர்',
    assignedExpert: 'நியமிக்கப்பட்ட நிபுணர்',
    expertType: 'நிபுணர் வகை',
    cancel: 'ரத்து செய்',
    noEmergencyActive: 'செயலில் உள்ள அவசரநிலை இல்லை',
    pending: 'நிலுவையில்',
    pleaseWait: 'தயவு செய்து காத்திருக்கவும்...',
    emergencyActive: 'அவசரநிலை நடந்து கொண்டிருக்கிறது',
    completeCurrentEmergency: 'தயவு செய்து முதலில் உங்கள் தற்போதைய அவசரநிலையை முடிக்கவும் அல்லது ரத்து செய்யவும்',
  },
};

export default function PatientDashboard({ navigation, route }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [loadingEmergency, setLoadingEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [emerId, setEmerId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [hasActiveEmergency, setHasActiveEmergency] = useState(false);
  const [isCheckingEmergency, setIsCheckingEmergency] = useState(true);
  const t = translations[language];
  const { patient } = route.params || {};

  // patientId lookup: prefer patient_no then id
  const patientId = patient?.patient_no || patient?.id || '';

  // On mount and when patientId changes, check for any p_emergency rows where p_id == patientId
  useEffect(() => {
    checkPIdPresence();

    // Re-check when screen gains focus (in case emergency was created elsewhere)
    const unsubscribe = navigation.addListener('focus', () => {
      checkPIdPresence();
    });

    return unsubscribe;
  }, [patientId, navigation]);

  // cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setDropdownVisible(false);
  };

  /**
   * checkPIdPresence
   * - Queries p_emergency for any row where p_id == patientId.
   * - If a row exists, it displays the Live Overview using that row (and disables the button).
   * - If no row exists, Emergency button remains active and Live Overview is hidden.
   *
   * Note: To pick a single row when multiple rows exist we order by `emer_id` descending
   * (assuming emer_id increases over time). This avoids referring to a non-existent created_at.
   */
  const checkPIdPresence = async () => {
    if (!patientId) {
      console.log('No patientId available to check p_emergency');
      setHasActiveEmergency(false);
      setEmergencyData(null);
      setEmerId(null);
      setIsCheckingEmergency(false);
      return;
    }

    setIsCheckingEmergency(true);
    try {
      const { data, error } = await supabase
        .from('p_emergency')
        .select('*')
        .eq('p_id', patientId)
        .order('emer_id', { ascending: false }) // use emer_id ordering instead of created_at
        .limit(1);

      if (error) {
        console.error('Error checking p_emergency for patient:', error);
        // If column emer_id also doesn't exist, fall back to a simple select without order
        if (error.code === '42703' || error.message?.includes('does not exist')) {
          console.log('emer_id column may not exist, retrying without order...');
          const fallback = await supabase
            .from('p_emergency')
            .select('*')
            .eq('p_id', patientId)
            .limit(1);

          if (fallback.error) {
            console.error('Fallback query error:', fallback.error);
            setHasActiveEmergency(false);
            setEmergencyData(null);
            setEmerId(null);
            setIsCheckingEmergency(false);
            return;
          }

          if (fallback.data && fallback.data.length > 0) {
            const found = fallback.data[0];
            setHasActiveEmergency(true);
            setEmergencyData(found);
            setEmerId(found.emer_id || null);
            // start polling only if status exists and is active
            if (found.p_status && ['pending', 'assigned', 'in_progress'].includes(found.p_status)) {
              startPollingEmergencyData(found.emer_id || null);
            }
          } else {
            setHasActiveEmergency(false);
            setEmergencyData(null);
            setEmerId(null);
          }

          setIsCheckingEmergency(false);
          return;
        } else {
          setIsCheckingEmergency(false);
          return;
        }
      }

      // Successful primary query
      if (data && data.length > 0) {
        const found = data[0];
        setHasActiveEmergency(true);
        setEmergencyData(found);
        setEmerId(found.emer_id || null);

        // Start polling if status indicates still active
        if (found.p_status && ['pending', 'assigned', 'in_progress'].includes(found.p_status)) {
          startPollingEmergencyData(found.emer_id || null);
        }
      } else {
        setHasActiveEmergency(false);
        setEmergencyData(null);
        setEmerId(null);
      }
    } catch (err) {
      console.error('Unexpected error checking p_emergency:', err);
      setHasActiveEmergency(false);
      setEmergencyData(null);
      setEmerId(null);
    } finally {
      setIsCheckingEmergency(false);
    }
  };

  const handleEmergencyPress = () => {
    if (hasActiveEmergency) {
      Alert.alert(t.emergencyActive, t.completeCurrentEmergency);
      return;
    }
    setSymptomText('');
    setEmergencyModalVisible(true);
  };

  // fetch by emer_id if needed (used by polling)
  const fetchEmergencyData = async (id) => {
    if (!id) return null;
    try {
      const { data, error } = await supabase
        .from('p_emergency')
        .select('*')
        .eq('emer_id', id)
        .limit(1);

      if (error) {
        console.error('Error fetching emergency data:', error);
        return null;
      }
      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error('fetchEmergencyData error:', err);
      return null;
    }
  };

  const startPollingEmergencyData = (id) => {
    // clear existing
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    if (!id) {
      // If no id available, don't start polling
      return;
    }

    const interval = setInterval(async () => {
      const data = await fetchEmergencyData(id);
      if (data) {
        setEmergencyData(data);
        // Stop polling if completed or cancelled
        if (data.p_status === 'completed' || data.p_status === 'cancelled') {
          clearInterval(interval);
          setPollingInterval(null);
          // keep overview visible but mark as not actively polling
        }
      } else {
        // record deleted or not found => clear overview and stop polling
        clearInterval(interval);
        setPollingInterval(null);
        setEmergencyData(null);
        setEmerId(null);
        setHasActiveEmergency(false);
      }
    }, 3000);

    setPollingInterval(interval);
    return interval;
  };

  const handleProcessEmergency = async (symptoms) => {
    setLoadingEmergency(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for emergency.');
        setLoadingEmergency(false);
        setEmergencyModalVisible(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const patientName = patient?.name || '';
      const locationJson = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      const { data, error } = await supabase
        .from('p_emergency')
        .insert([{
          p_id: patientId,
          p_name: patientName,
          p_loc: locationJson,
          p_symptoms: symptoms || null,
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        Alert.alert('Error', 'Failed to send emergency alert.');
        setLoadingEmergency(false);
        setEmergencyModalVisible(false);
        return;
      }

      if (data && data.length > 0) {
        const inserted = data[0];
        setEmerId(inserted.emer_id || null);
        setHasActiveEmergency(true);
        setEmergencyData(inserted);
        // start polling for updates if applicable
        if (inserted.emer_id) startPollingEmergencyData(inserted.emer_id);
        Alert.alert('Emergency Alert Sent', 'Emergency team has been notified!');
      } else {
        Alert.alert('Error', 'Emergency submitted but no response record returned.');
      }
    } catch (err) {
      console.error('handleProcessEmergency error:', err);
      Alert.alert('Error', 'Could not complete emergency request.');
    } finally {
      setLoadingEmergency(false);
      setEmergencyModalVisible(false);
      Linking.openURL('tel:112');
    }
  };

  const handleCancelEmergency = async () => {
    if (!emerId) return;

    try {
      const { error } = await supabase
        .from('p_emergency')
        .delete()
        .eq('emer_id', emerId);

      if (error) {
        console.error('Error cancelling emergency:', error);
        Alert.alert('Error', 'Failed to cancel emergency.');
        return;
      }

      // clear polling and overview
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setEmergencyData(null);
      setEmerId(null);
      setHasActiveEmergency(false);
      Alert.alert('Emergency Cancelled', 'Your emergency request has been cancelled.');
    } catch (err) {
      console.error('handleCancelEmergency error:', err);
      Alert.alert('Error', 'Could not cancel emergency request.');
    }
  };

  const formatDisplayValue = (value) => {
    return value && value !== '' ? value : t.noEmergencyActive;
  };

  const formatAshaWorker = () => {
    if (emergencyData?.assigned_ashanm && emergencyData?.assigned_ashaid) {
      return `${emergencyData.assigned_ashanm} (${emergencyData.assigned_ashaid})`;
    }
    return t.noEmergencyActive;
  };

  const formatAssignedExpert = () => {
    if (emergencyData?.assigned_profnm && emergencyData?.assigned_profid) {
      return `${emergencyData.assigned_profnm} (${emergencyData.assigned_profid})`;
    }
    return t.noEmergencyActive;
  };

  if (isCheckingEmergency) {
    return (
      <LinearGradient colors={['#b3e5fc', '#ffffff']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Checking emergency status...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#b3e5fc', '#ffffff']} style={styles.container}>
      <ScrollView>
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
        <TouchableOpacity
          style={[
            styles.emergencyButton,
            hasActiveEmergency && styles.emergencyButtonDisabled
          ]}
          onPress={handleEmergencyPress}
          disabled={loadingEmergency || hasActiveEmergency}
        >
          <Image
            source={require('./assets/call.png')}
            style={[
              styles.emergencyIcon,
              hasActiveEmergency && styles.emergencyIconDisabled
            ]}
          />
          <View>
            <Text style={[
              styles.emergencyTitle,
              hasActiveEmergency && styles.emergencyTitleDisabled
            ]}>
              {t.emergency}
            </Text>
            <Text style={[
              styles.emergencySubtitle,
              hasActiveEmergency && styles.emergencySubtitleDisabled
            ]}>
              {hasActiveEmergency ? t.emergencyActive : t.emergencyCall}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Live Overview Box */}
        {hasActiveEmergency && emergencyData && (
          <View style={styles.liveOverviewBox}>
            <Text style={styles.liveOverviewTitle}>{t.liveOverview}</Text>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>{t.status}:</Text>
              <Text style={[
                styles.overviewValue,
                styles.statusValue,
                emergencyData.p_status === 'assigned' && styles.statusAssigned,
                emergencyData.p_status === 'completed' && styles.statusCompleted,
                emergencyData.p_status === 'cancelled' && styles.statusCancelled,
              ]}>
                {formatDisplayValue(emergencyData.p_status) || t.pending}
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>{t.ashaWorker}:</Text>
              <Text style={styles.overviewValue}>
                {formatAshaWorker()}
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>{t.assignedExpert}:</Text>
              <Text style={styles.overviewValue}>
                {formatAssignedExpert()}
              </Text>
            </View>

            <View style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>{t.expertType}:</Text>
              <Text style={styles.overviewValue}>
                {formatDisplayValue(emergencyData.assigned_prof)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEmergency}
            >
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Rest of the component */}
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <TouchableOpacity
          style={styles.consult}
          onPress={() => navigation.navigate('consultform', { patient })}
        >
          <Text style={styles.consultText}>{t.consult}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.healthAwarenessButton}
          onPress={() => navigation.navigate('HealthAwareness')}
        >
          <Text style={styles.healthAwarenessText}>{t.healthAwareness}</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('pharmacy')}>
            <Image source={require('./assets/Drugstore.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.pharmacy}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('symptomChecker')}>
            <Image source={require('./assets/GenerativeAI.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.symptom}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => navigation.navigate('PatientReports', {
              patient_no: patient?.patient_no || '',
              patient_name: patient?.name || '',
              age: patient?.age || '',
              gender: patient?.gender || ''
            })}
          >
            <Image source={require('./assets/report.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.report}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('EmergencyCareVideos')}>
            <Image source={require('./assets/call.png')} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{t.emergency}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.langSelectButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.langSelectText}>{t.chooseLang}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language dropdown modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
          activeOpacity={1}
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

      {/* Emergency symptom modal */}
      <Modal
        visible={emergencyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => !loadingEmergency && setEmergencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.symptomModalCard}>
            <Text style={styles.symptomModalTitle}>{t.enterSymptoms}</Text>
            <TextInput
              style={styles.symptomModalInput}
              value={symptomText}
              onChangeText={setSymptomText}
              placeholder={t.placeholderSymptoms}
              multiline
              editable={!loadingEmergency}
            />
            <View style={styles.symptomModalButtonsRow}>
              <TouchableOpacity
                style={styles.symptomModalButtonSkip}
                onPress={() => handleProcessEmergency('')}
                disabled={loadingEmergency}
              >
                <Text style={styles.symptomModalButtonText}>{t.skip}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.symptomModalButtonSubmit}
                onPress={() => handleProcessEmergency(symptomText.trim())}
                disabled={loadingEmergency}
              >
                <Text style={styles.symptomModalButtonTextWhite}>
                  {loadingEmergency ? t.pleaseWait : t.submit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eaf7fa', flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#205099',
    fontWeight: 'bold',
  },
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
    marginTop: 10,
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
  emergencyButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  emergencyIcon: { width: 40, height: 40, marginRight: 12, tintColor: '#fff' },
  emergencyIconDisabled: { tintColor: '#e0e0e0' },
  emergencyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emergencyTitleDisabled: { color: '#e0e0e0' },
  emergencySubtitle: { color: '#fff', fontSize: 14 },
  emergencySubtitleDisabled: { color: '#e0e0e0' },
  liveOverviewBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  liveOverviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 16,
    textAlign: 'center',
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingVertical: 4,
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  overviewValue: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  statusValue: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusAssigned: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusCompleted: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'left', color: '#205099', paddingHorizontal: 20 },
  subtitle: { fontSize: 14, marginBottom: 18, textAlign: 'left', color: '#434c59', paddingHorizontal: 20 },
  consult: {
    backgroundColor: '#36b5b0',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  consultText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  healthAwarenessButton: {
    backgroundColor: '#2ecc71',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  healthAwarenessText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
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
    marginTop: 15,
    marginBottom: 40,
    alignItems: 'center',
  },
  langSelectText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  dropdown: { backgroundColor: '#fff', padding: 16, borderRadius: 10, elevation: 8, minWidth: 150 },
  dropdownItem: { paddingVertical: 8 },
  dropdownText: { fontSize: 16, color: '#205099' },
  symptomModalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'stretch',
    elevation: 8,
  },
  symptomModalTitle: { fontSize: 17, fontWeight: 'bold', color: '#205099', marginBottom: 16 },
  symptomModalInput: {
    borderWidth: 1,
    borderColor: '#6499a1',
    borderRadius: 6,
    padding: 12,
    minHeight: 80,
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
    backgroundColor: '#eaf7fa',
    textAlignVertical: 'top',
  },
  symptomModalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  symptomModalButtonSkip: {
    backgroundColor: '#eee',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 26,
    alignItems: 'center',
    marginRight: 15,
  },
  symptomModalButtonSubmit: {
    backgroundColor: '#36b5b0',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 26,
    alignItems: 'center',
  },
  symptomModalButtonText: { fontWeight: 'bold', color: '#205099' },
  symptomModalButtonTextWhite: { fontWeight: 'bold', color: '#fff' },
});