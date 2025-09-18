import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Modal, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LanguageContext } from './LanguageContext';
import { supabase } from './supabaseClient'; // your supabase client import

// ...existing code...
import { RotateOutDownLeft } from 'react-native-reanimated';

// Add your formTranslations object here (example with English only, add more languages as needed)
const formTranslations = {
  en: {
    form: "Consultation Form",
    reason: "Reason for Visit",
    reason_ph: "Describe the reason...",
    symptom_cat: "Symptom Category",
    symptom_cat_opts: ["Fever", "Cough", "Pain", "Other"],
    category_type: "Category Type",
    category_type_opts: ["Acute", "Chronic"],
    symptoms: "Symptoms",
    symptoms_ph: "List symptoms...",
    duration: "Duration",
    duration_opts: ["Days", "Weeks", "Months"],
    severity: "Severity",
    severity_opts: ["Mild", "Moderate", "Severe"],
    health_history: "Health History",
    diabetes: "Diabetes",
    bp: "Blood Pressure",
    tb: "Tuberculosis",
    asthma: "Asthma",
    other: "Other",
    cur_meds: "Current Medicines",
    cur_meds_ph: "List current medicines...",
    date: "Date of Visit",
    date_ph: "Select date...",
    time: "Time of Visit",
    time_ph: "Select time...",
    hosp: "Hospital Type",
    select_hosp: "Select hospital type...",
    private: "Private",
    govt: "Government",
    submit: "Submit"
  }
  // Add other languages here as needed
};

// Google Meet link generation using backend Express endpoint
const generateGoogleMeetLink = async () => {
  try {
    // Use current date/time for event, or customize as needed
    const now = new Date();
    const startTime = new Date(now.getTime() + 5 * 60000).toISOString(); // 5 min from now
    const endTime = new Date(now.getTime() + 35 * 60000).toISOString(); // 30 min duration
  const response = await fetch('http://172.16.10.212:3000/create-meet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: 'Doctor Consultation',
        description: 'Video consultation with doctor',
        startTime,
        endTime,
        attendees: [], // Optionally add patient/doctor emails
      }),
    });
    const data = await response.json();
    if (response.ok && data.meetLink) {
      alert(`Google Meet Link: ${data.meetLink}`);
      // Optionally: Linking.openURL(data.meetLink);
    } else {
      alert('Failed to generate Google Meet link.');
    }
  } catch (error) {
    alert('Error generating Google Meet link.');
    console.error(error);
  }
};

function ConsultThankYou({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaf7fa' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#205099', marginBottom: 16 }}>Thank You!</Text>
      <Text style={{ fontSize: 18, color: '#205099', marginBottom: 24, textAlign: 'center', paddingHorizontal: 24 }}>
        Your consultation has been sent successfully. Our team will review your information and contact you soon.
      </Text>
      <TouchableOpacity style={{ backgroundColor: '#36b5b0', padding: 14, borderRadius: 10 }} onPress={() => navigation.navigate('patientdashboard')}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ConsultForm({ navigation, route }) {
  const { language, changeLanguage } = useContext(LanguageContext);
  const t = formTranslations[language];

  // Access patient info from route paramsconst { patient } = route.params || {};
  const { patient } = route.params || {};
  const patient_id = patient?.id;
  const patient_name = patient?.name;
  const phone_number = patient?.phone_no;
  const age = patient?.age;
  const gender = patient?.gender;

  const [reason, setReason] = useState('');
  const [symptomCat, setSymptomCat] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [durationUnit, setDurationUnit] = useState('');
  const [severity, setSeverity] = useState('');
  const [healthHistory, setHealthHistory] = useState({
    diabetes: false,
    bp: false,
    tb: false,
    asthma: false,
    other: false
  });
  const [curMeds, setCurMeds] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [hospitalType, setHospitalType] = useState('');
  const [langModal, setLangModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

const handleHistoryToggle = (field) => {
  setHealthHistory(prev => ({ ...prev, [field]: !prev[field] }));
};

  // Function to map translated values back to English
  const mapToEnglish = (category, value) => {
    if (!value) return '';
    const index = formTranslations[language][`${category}_opts`].indexOf(value);
    return index !== -1 ? formTranslations['en'][`${category}_opts`][index] : '';
  };

  const handleSubmit = async () => {
    // Map localized selections to English for DB storage
    const symptomCategoryEng = mapToEnglish('symptom_cat', symptomCat);
    const categoryTypeEng = mapToEnglish('category_type', categoryType);
    const durationUnitEng = mapToEnglish('duration', durationUnit);
    const severityEng = mapToEnglish('severity', severity);
    const hospitalTypeEng = hospitalType === 'private' ? 'Private' : hospitalType === 'government' ? 'Government' : '';

    const isoDate = date ? date.toISOString().slice(0, 10) : null;
    const isoTime = time ? time.toTimeString().substr(0, 8) : null;

    const healthHistoryEng = {
      diabetes: healthHistory.diabetes,
      bp: healthHistory.bp,
      tb: healthHistory.tb,
      asthma: healthHistory.asthma,
      other: healthHistory.other
    };

    const dataToInsert = {
      patient_id,
      patient_name,
      phone_number,
      age,
      gender,
      reason: reason.trim(),
      symptom_category: symptomCategoryEng,
      category_type: categoryTypeEng,
      symptoms: symptoms.trim(),
      duration_unit: durationUnitEng,
      severity: severityEng,
      health_history: healthHistoryEng,
      current_medicines: curMeds.trim(),
      date_of_visit: isoDate,
      time_of_visit: isoTime,
      hospital_type: hospitalTypeEng
    };

    try {
      const { error } = await supabase.from('consultation_records').insert([dataToInsert]);
      if (error) {
        alert('Submission failed: ' + error.message);
        console.error(error);
      } else {
        // Navigate to Thank You page
        setReason('');
        setSymptomCat('');
        setCategoryType('');
        setSymptoms('');
        setDurationUnit('');
        setSeverity('');
        setHealthHistory({
          diabetes: false,
          bp: false,
          tb: false,
          asthma: false,
          other: false
        });
        setCurMeds('');
        setDate(null);
        setTime(null);
        setHospitalType('');
        navigation.replace('ConsultThankYou');
      }
    } catch (err) {
      alert('An unexpected error occurred.');
      console.error(err);
    }
  };

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setLangModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.headerOutside}>{t.form}</Text>
      <View style={styles.inputGroup}>
        <View style={styles.patientInfoCard}>
          <Text style={styles.patientInfoText}>Name: {patient_name || "-"}</Text>
          <Text style={styles.patientInfoText}>Age: {age || "-"}</Text>
          <Text style={styles.patientInfoText}>Gender: {gender || "-"}</Text>
          <Text style={styles.patientInfoText}>Phone: {phone_number || "-"}</Text>
        </View>

        <TouchableOpacity style={styles.langButton} onPress={() => setLangModal(true)}>
          <Image source={require('./assets/lang.png')} style={styles.langImage} />
        </TouchableOpacity>

        <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
          <TouchableOpacity style={styles.langModalOverlay} activeOpacity={1} onPressOut={() => setLangModal(false)}>
            <View style={styles.langDropdown}>
              {Object.keys(formTranslations).map((langKey) => (
                <TouchableOpacity key={langKey} onPress={() => selectLanguage(langKey)} style={styles.langDropdownItem}>
                  <Text style={styles.langDropdownText}>{langKey.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Text style={styles.label}>{t.reason}</Text>
        <TextInput style={styles.input} placeholder={t.reason_ph} placeholderTextColor="#6499a1" value={reason} onChangeText={setReason} />

        <View style={styles.rowWrap}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>{t.symptom_cat}</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={symptomCat} onValueChange={setSymptomCat} style={styles.picker}>
                <Picker.Item label={t.symptom_cat} value="" />
                {t.symptom_cat_opts.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
              </Picker>
            </View>
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>{t.category_type}</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={categoryType} onValueChange={setCategoryType} style={styles.picker}>
                <Picker.Item label={t.category_type} value="" />
                {t.category_type_opts.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.label}>{t.symptoms}</Text>
        <TextInput style={styles.input} placeholder={t.symptoms_ph} placeholderTextColor="#6499a1" value={symptoms} onChangeText={setSymptoms} />

        <Text style={styles.label}>{t.duration}</Text>
        <View style={styles.radioGroup}>
          {t.duration_opts.map(opt => (
            <TouchableOpacity key={opt} style={styles.radioOption} onPress={() => setDurationUnit(opt)}>
              <View style={[styles.radioCircle, durationUnit === opt && styles.radioCircleSelected]} />
              <Text style={styles.radioLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t.severity}</Text>
        <View style={styles.severityGroup}>
          {t.severity_opts.map(opt => (
            <TouchableOpacity key={opt} style={[styles.severityButton, severity === opt && styles.severitySelected]} onPress={() => setSeverity(opt)}>
              <Text style={[styles.severityText, severity === opt && styles.severityTextSelected]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t.health_history}</Text>
        <View style={styles.checkboxGroup}>
          {['diabetes', 'bp', 'tb', 'asthma', 'other'].map(key => (
            <TouchableOpacity key={key} style={styles.checkboxRow} onPress={() => handleHistoryToggle(key)}>
              <View style={[styles.checkbox, healthHistory[key] && styles.checkboxChecked]} />
              <Text style={styles.checkboxLabel}>{t[key]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t.cur_meds}</Text>
        <TextInput style={styles.input} placeholder={t.cur_meds_ph} placeholderTextColor="#6499a1" value={curMeds} onChangeText={setCurMeds} />

        <Text style={styles.label}>{t.date}</Text>
        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
          <TextInput style={styles.input} placeholder={t.date_ph} placeholderTextColor="#6499a1" value={date ? date.toLocaleDateString() : ''} editable={false} pointerEvents="none" />
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={(pickedDate) => { setDatePickerVisible(false); setDate(pickedDate); }} onCancel={() => setDatePickerVisible(false)} />

        <Text style={styles.label}>{t.time}</Text>
        <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
          <TextInput style={styles.input} placeholder={t.time_ph} placeholderTextColor="#6499a1" value={time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} editable={false} pointerEvents="none" />
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={(pickedTime) => { setTimePickerVisible(false); setTime(pickedTime); }} onCancel={() => setTimePickerVisible(false)} />

        <Text style={styles.label}>{t.hosp}</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={hospitalType} onValueChange={setHospitalType} style={styles.picker}>
            <Picker.Item label={t.select_hosp} value="" />
            <Picker.Item label={t.private} value="private" />
            <Picker.Item label={t.govt} value="government" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>{t.submit}</Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eaf7fa",
    padding: 24,
    flexGrow: 1,
    alignItems: "center"
  },
  headerOutside: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3a4d5c",
    marginTop: 16,
    marginBottom: 18,
    alignSelf: "flex-start",
    width: "100%",
    maxWidth: 400,
    flexWrap: "wrap"
  },
  inputGroup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
    position: "relative"
  },
  langButton: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#d3d3d3",
    padding: 5,
    borderRadius: 10,
    width: 50,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  langImage: {
    width: 50,
    height: 50,
    resizeMode: "contain"
  },
  langModalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 56,
    marginRight: 18
  },
  langDropdown: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 8
  },
  langDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  langDropdownText: {
    fontSize: 16,
    color: "#205099"
  },
  label: {
    fontSize: 16,
    color: "#205099",
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "bold",
    flexWrap: "wrap"
  },
  input: {
    backgroundColor: "#eaf7fa",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#6499a1",
    minWidth: 160,
    flexShrink: 1
  },
  pickerContainer: {
    backgroundColor: "#eaf7fa",
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#6499a1"
  },
  picker: {
    height: 48,
    width: "100%",
    color: "#205099"
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  halfWidth: {
    flexBasis: "48%",
    minWidth: 160,
    marginBottom: 12
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#205099",
    marginRight: 6,
    backgroundColor: "#fff"
  },
  radioCircleSelected: {
    backgroundColor: "#36b5b0",
    borderColor: "#36b5b0"
  },
  radioLabel: {
    fontSize: 15,
    color: "#205099"
  },
  severityGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 6
  },
  severityButton: {
    backgroundColor: "#eaf7fa",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#6499a1",
    marginRight: 12,
    marginBottom: 8
  },
  severitySelected: {
    backgroundColor: "#36b5b0",
    borderColor: "#36b5b0"
  },
  severityText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#205099"
  },
  severityTextSelected: {
    color: "#fff"
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 7
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#205099",
    marginRight: 7,
    backgroundColor: "#fff"
  },
  checkboxChecked: {
    backgroundColor: "#36b5b0",
    borderColor: "#36b5b0"
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#205099"
  },
  submitButton: {
    backgroundColor: "#36b5b0",
    padding: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center"
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});