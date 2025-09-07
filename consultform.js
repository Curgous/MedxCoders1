import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Image, Modal, ScrollView, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Translations for form fields
const formTranslations = {
    en: {
        form: "Patient Consultation Form",
        name: "Patient Name",
        name_ph: "Enter name",
        age: "Age",
        age_ph: "Enter age",
        date: "Date",
        date_ph: "YYYY-MM-DD",
        time: "Time",
        time_ph: "HH:MM",
        gender: "Gender",
        select_gender: "Select Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        hosp: "Hospital Type",
        select_hosp: "Select Type",
        private: "Private",
        govt: "Government",
        submit: "SUBMIT",
    },
    pa: {
        form: "ਮਰੀਜ਼ ਸਲਾਹ ਫਾਰਮ",
        name: "ਮਰੀਜ਼ ਦਾ ਨਾਮ",
        name_ph: "ਨਾਮ ਦਿਓ",
        age: "ਉਮਰ",
        age_ph: "ਉਮਰ ਦਿਓ",
        date: "ਤਾਰੀਖ",
        date_ph: "YYYY-MM-DD",
        time: "ਸਮਾਂ",
        time_ph: "HH:MM",
        gender: "ਲਿੰਗ",
        select_gender: "ਲਿੰਗ ਚੁਣੋ",
        male: "ਮਰਦ",
        female: "ਔਰਤ",
        other: "ਹੋਰ",
        hosp: "ਹਸਪਤਾਲ ਕਿਸਮ",
        select_hosp: "ਕਿਸਮ ਚੁਣੋ",
        private: "ਨਿੱਜੀ",
        govt: "ਸਰਕਾਰੀ",
        submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
    },
    hi: {
        form: "मरीज़ परामर्श फॉर्म",
        name: "मरीज़ का नाम",
        name_ph: "नाम दर्ज करें",
        age: "आयु",
        age_ph: "आयु दर्ज करें",
        date: "तारीख",
        date_ph: "YYYY-MM-DD",
        time: "समय",
        time_ph: "HH:MM",
        gender: "लिंग",
        select_gender: "लिंग चुनें",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        hosp: "अस्पताल प्रकार",
        select_hosp: "प्रकार चुनें",
        private: "निजी",
        govt: "सरकारी",
        submit: "जमा करें",
    },
    bn: {
        form: "রোগী পরামর্শ ফর্ম",
        name: "রোগীর নাম",
        name_ph: "নাম লিখুন",
        age: "বয়স",
        age_ph: "বয়স লিখুন",
        date: "তারিখ",
        date_ph: "YYYY-MM-DD",
        time: "সময়",
        time_ph: "HH:MM",
        gender: "লিঙ্গ",
        select_gender: "লিঙ্গ নির্বাচন করুন",
        male: "পুরুষ",
        female: "নারী",
        other: "অন্যান্য",
        hosp: "হাসপাতালের ধরন",
        select_hosp: "ধরন নির্বাচন করুন",
        private: "বেসরকারি",
        govt: "সরকারি",
        submit: "জমা দিন",
    },
    ta: {
        form: "நோயாளர் ஆலோசனை படிவம்",
        name: "நோயாளர் பெயர்",
        name_ph: "பெயரை உள்ளிடவும்",
        age: "வயது",
        age_ph: "வயதை உள்ளிடவும்",
        date: "தேதி",
        date_ph: "YYYY-MM-DD",
        time: "நேரம்",
        time_ph: "HH:MM",
        gender: "பாலினம்",
        select_gender: "பாலினத்தை தேர்ந்தெடுக்கவும்",
        male: "ஆண்",
        female: "பெண்",
        other: "மற்றவை",
        hosp: "மருத்துவமனை வகை",
        select_hosp: "வகையைத் தேர்ந்தெடுக்கவும்",
        private: "தனியார்",
        govt: "அரசு",
        submit: "சமர்ப்பிக்கவும்",
    }
};

export default function ConsultForm({ navigation }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [gender, setGender] = useState('');
    const [hospitalType, setHospitalType] = useState('');
    const [langModal, setLangModal] = useState(false);
    const [formLang, setFormLang] = useState('en');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const t = formTranslations[formLang];

    const handleSubmit = () => {
        alert(`${t.submit}:\n${t.name}: ${name}\n${t.age}: ${age}\n${t.date}: ${date ? date.toLocaleDateString() : ''}\n${t.time}: ${time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}\n${t.gender}: ${gender}\n${t.hosp}: ${hospitalType}`);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerOutside}>{t.form}</Text>

            <View style={styles.inputGroup}>
                <TouchableOpacity style={styles.langButton} onPress={() => setLangModal(true)}>
                    <Image source={require('./assets/lang.png')} style={styles.langImage} />
                </TouchableOpacity>

                <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
                    <TouchableOpacity style={styles.langModalOverlay} activeOpacity={1} onPressOut={() => setLangModal(false)}>
                        <View style={styles.langDropdown}>
                            <TouchableOpacity onPress={() => { setFormLang('en'); setLangModal(false); }} style={styles.langDropdownItem}>
                                <Text style={styles.langDropdownText}>English</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setFormLang('pa'); setLangModal(false); }} style={styles.langDropdownItem}>
                                <Text style={styles.langDropdownText}>ਪੰਜਾਬੀ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setFormLang('hi'); setLangModal(false); }} style={styles.langDropdownItem}>
                                <Text style={styles.langDropdownText}>हिन्दी</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setFormLang('bn'); setLangModal(false); }} style={styles.langDropdownItem}>
                                <Text style={styles.langDropdownText}>বাংলা</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setFormLang('ta'); setLangModal(false); }} style={styles.langDropdownItem}>
                                <Text style={styles.langDropdownText}>தமிழ்</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Text style={styles.label}>{t.name}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t.name_ph}
                    placeholderTextColor="#6499a1"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>{t.age}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t.age_ph}
                    placeholderTextColor="#6499a1"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t.date}</Text>
                <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                    <TextInput
                        style={styles.input}
                        placeholder={t.date_ph}
                        placeholderTextColor="#6499a1"
                        value={date ? date.toLocaleDateString() : ''}
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(pickedDate) => { setDatePickerVisible(false); setDate(pickedDate); }}
                    onCancel={() => setDatePickerVisible(false)}
                />

                <Text style={styles.label}>{t.time}</Text>
                <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
                    <TextInput
                        style={styles.input}
                        placeholder={t.time_ph}
                        placeholderTextColor="#6499a1"
                        value={time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={(pickedTime) => { setTimePickerVisible(false); setTime(pickedTime); }}
                    onCancel={() => setTimePickerVisible(false)}
                />

                <Text style={styles.label}>{t.gender}</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={gender} style={styles.picker} onValueChange={setGender}>
                        <Picker.Item label={t.select_gender} value="" />
                        <Picker.Item label={t.male} value="male" />
                        <Picker.Item label={t.female} value="female" />
                        <Picker.Item label={t.other} value="other" />
                    </Picker>
                </View>

                <Text style={styles.label}>{t.hosp}</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={hospitalType} style={styles.picker} onValueChange={setHospitalType}>
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
        backgroundColor: '#eaf7fa',
        padding: 24,
        flexGrow: 1,
        alignItems: 'center',
    },
    headerOutside: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3a4d5c',
        marginTop: 16,
        marginBottom: 18,
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: 400,
    },
    inputGroup: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
        position: 'relative',
    },
    langButton: {
        position: 'absolute',
        top: 18,
        right: 18,
        backgroundColor: '#d3d3d3',
        padding: 5,
        borderRadius: 10,
        width: 50,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    langImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    langModalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 56,
        marginRight: 18,
    },
    langDropdown: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 8,
    },
    langDropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    langDropdownText: {
        fontSize: 16,
        color: '#205099',
    },
    label: {
        fontSize: 16,
        color: '#205099',
        marginTop: 16,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#eaf7fa',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#6499a1',
    },
    pickerContainer: {
        backgroundColor: '#eaf7fa',
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#6499a1',
    },
    picker: {
        height: 48,
        width: '100%',
        color: '#205099',
    },
    submitButton: {
        backgroundColor: '#36b5b0',
        padding: 14,
        borderRadius: 8,
        marginTop: 28,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});