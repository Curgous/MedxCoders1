import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, Modal, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LanguageContext } from './LanguageContext';
import { supabase } from './supabaseClient'; // your supabase client import
import { RotateOutDownLeft } from 'react-native-reanimated';

const formTranslations = {
  en: {
    form: "Patient Consultation Form",
    reason: "Reason for visit",
    reason_ph: "E.g. Fever since 2 days",
    symptom_cat: "Symptom category",
    symptom_cat_opts: ["General", "Respiratory", "Cardiac", "Gastro", "Other"],
    category_type: "Type",
    category_type_opts: ["Primary", "Recurring", "Chronic", "Other"],
    symptoms: "Symptoms",
    symptoms_ph: "E.g. Headache",
    duration: "Duration",
    duration_opts: ["Hours", "Days", "Weeks"],
    severity: "Severity",
    severity_opts: ["Mild", "Moderate", "Severe"],
    health_history: "Health History",
    diabetes: "Diabetes",
    bp: "BP",
    tb: "TB",
    asthma: "Asthma",
    other: "Other",
    cur_meds: "Current medicines",
    cur_meds_ph: "Yes/No or list names",
    date: "Date",
    date_ph: "YYYY-MM-DD",
    time: "Time",
    time_ph: "HH:MM",
    hosp: "Hospital Type",
    select_hosp: "Select Type",
    private: "Private",
    govt: "Government",
    submit: "SUBMIT",
  },
  pa: {
    form: "ਮਰੀਜ਼ ਸਲਾਹ ਫਾਰਮ",
    reason: "ਮੁਲਾਕਾਤ ਦਾ ਕਾਰਨ",
    reason_ph: "ਉਦਾਹ: 2 ਦਿਨ ਤੋਂ ਬੁਖ਼ਾਰ",
    symptom_cat: "ਲੱਛਣ ਦੀ ਸ਼੍ਰੇਣੀ",
    symptom_cat_opts: ["ਸਧਾਰਨ", "ਸਾਹ ਲੈਣ ਵਾਲੀ ਤਕਲੀਫ਼", "ਦਿਲ ਦੀ ਬਿਮਾਰੀ", "ਪੇਟ", "ਹੋਰ"],
    category_type: "ਕਿਸਮ",
    category_type_opts: ["ਮੁੱਖ", "ਦੋਹਰਾਏ ਗਏ", "ਦੀਰਘਕਾਲੀ", "ਹੋਰ"],
    symptoms: "ਲੱਛਣ",
    symptoms_ph: "ਉਦਾਹ: ਸਿਰ ਦਰਦ",
    duration: "ਅਵਧੀ",
    duration_opts: ["ਘੰਟੇ", "ਦਿਨ", "ਹਫ਼ਤੇ"],
    severity: "ਤੀਬਰਤਾ",
    severity_opts: ["ਹਲਕੀ", "ਦਰਮਿਆਨੀ", "ਤਿਖੀ"],
    health_history: "ਸਿਹਤ ਇਤਿਹਾਸ",
    diabetes: "ਸ਼ੂਗਰ",
    bp: "ਬੀ.ਪੀ.",
    tb: "ਟੀ.ਬੀ.",
    asthma: "ਦਮ",
    other: "ਹੋਰ",
    cur_meds: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ",
    cur_meds_ph: "ਹਾਂ/ਨਹੀਂ ਜਾਂ ਨਾਮ ਲਿਖੋ",
    date: "ਤਾਰੀਖ",
    date_ph: "ਸਾਲ-ਮਹੀਨਾ-ਦਿਨ",
    time: "ਸਮਾਂ",
    time_ph: "ਘੰਟੇ:ਮਿੰਟ",
    hosp: "ਹਸਪਤਾਲ ਦੀ ਕਿਸਮ",
    select_hosp: "ਕਿਸਮ ਚੁਣੋ",
    private: "ਨਿੱਜੀ",
    govt: "ਸਰਕਾਰੀ",
    submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
  },
  hi: {
    form: "रोगी परामर्श प्रपत्र",
    reason: "मुलाकात का कारण",
    reason_ph: "उदा: 2 दिन से बुखार",
    symptom_cat: "लक्षण श्रेणी",
    symptom_cat_opts: ["सामान्य", "सांस संबंधी", "हृदय", "पाचन", "अन्य"],
    category_type: "प्रकार",
    category_type_opts: ["प्राथमिक", "पुनरावर्ती", "दीर्घकालिक", "अन्य"],
    symptoms: "लक्षण",
    symptoms_ph: "उदा: सिरदर्द",
    duration: "अवधि",
    duration_opts: ["घंटे", "दिन", "सप्ताह"],
    severity: "तीव्रता",
    severity_opts: ["माइल्ड", "मध्यम", "तीव्र"],
    health_history: "स्वास्थ्य इतिहास",
    diabetes: "मधुमेह",
    bp: "रक्तचाप",
    tb: "क्षय रोग",
    asthma: "अस्थमा",
    other: "अन्य",
    cur_meds: "वर्तमान दवाएं",
    cur_meds_ph: "हाँ/ना या नाम लिखें",
    date: "तारीख",
    date_ph: "साल-माह-दिन",
    time: "समय",
    time_ph: "घंटा:मिनट",
    hosp: "अस्पताल का प्रकार",
    select_hosp: "प्रकार चुनें",
    private: "निजी",
    govt: "सरकारी",
    submit: "सबमिट करें",
  },
  bn: {
    form: "রোগীর পরামর্শ ফর্ম",
    reason: "আসার কারণ",
    reason_ph: "উদা: ২ দিন ধরে জ্বর",
    symptom_cat: "লক্ষণ শ্রেণী",
    symptom_cat_opts: ["সাধারণ", "শ্বাসজনিত", "হার্ট", "পাচন", "অন্যান্য"],
    category_type: "প্রকার",
    category_type_opts: ["প্রাথমিক", "বারবার হওয়া", "দীর্ঘস্থায়ী", "অন্যান্য"],
    symptoms: "লক্ষণ",
    symptoms_ph: "উদা: মাথাব্যথা",
    duration: "সময়কাল",
    duration_opts: ["ঘণ্টা", "দিন", "সপ্তাহ"],
    severity: "তীব্রতা",
    severity_opts: ["হালকা", "মধ্যম", "তীব্র"],
    health_history: "স্বাস্থ্য ইতিহাস",
    diabetes: "ডায়াবেটিস",
    bp: "রক্তচাপ",
    tb: "ক্ষয়রোগ",
    asthma: "হাঁপানি",
    other: "অন্যান্য",
    cur_meds: "বর্তমান ওষুধ",
    cur_meds_ph: "হ্যাঁ/না বা নাম লিখুন",
    date: "তারিখ",
    date_ph: "বছর-মাস-দিন",
    time: "সময়",
    time_ph: "ঘণ্টা:মিনিট",
    hosp: "হাসপাতালের ধরণ",
    select_hosp: "ধরণ নির্বাচন করুন",
    private: "বেসরকারি",
    govt: "সরকারি",
    submit: "জমা দিন",
  },
  ta: {
    form: "நோயாளியின் ஆலோசனை படிவம்",
    reason: "பார்வை காரணம்",
    reason_ph: "உதா: 2 நாட்கள் காய்ச்சல்",
    symptom_cat: "குறிப்பு வகை",
    symptom_cat_opts: ["தொகுதி", "மூச்சுவர்க்கு", "இதயம்", "அஹாரம்", "மற்றவை"],
    category_type: "வகை",
    category_type_opts: ["முதன்மை", "மீண்டும்", "நோய்ப்பு", "மற்றவை"],
    symptoms: "குறிப்புகள்",
    symptoms_ph: "உதா: தலைவலி",
    duration: "நாட்கள்",
    duration_opts: ["மணி", "நாள்", "வாரம்"],
    severity: "கடுமை",
    severity_opts: ["மிதமான", "நெருக்கமான", "கடுமையான"],
    health_history: "ஆரோக்கிய வரலாறு",
    diabetes: "நீரிழிவு",
    bp: "இரத்த அழுத்தம்",
    tb: "பசிப்பரிதாபம்",
    asthma: "உடல் மூச்சுத்திணறல்",
    other: "மற்றவை",
    cur_meds: "தற்போதைய மருந்துகள்",
    cur_meds_ph: "ஆம்/இல்லை அல்லது பெயர்கள்",
    date: "தேதி",
    date_ph: "ஆண்டு-மாதம்-நாள்",
    time: "நேரம்",
    time_ph: "மணி:நிமிடம்",
    hosp: "மருத்துவமனை வகை",
    select_hosp: "வகையைத் தேர்ந்தெடு",
    private: "வர்த்தக",
    govt: "அரசு",
    submit: "சமர்ப்பி",
  }
};

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
        alert('Consultation submitted successfully!');
        // Clear form fields
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
