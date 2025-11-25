import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabaseClient';

const t = {
    form: "Doctor Signup",
    doctorName: "Doctor's Name",
    doctorName_ph: "Enter full name",
    specialization: "Specialization",
    specialization_ph: "E.g. Cardiologist, Pediatrician",
    phoneNumber: "Phone Number",
    phoneNumber_ph: "Enter 10-digit number",
    hospitalType: "Type of Hospital",
    select_hosp: "Select Type",
    private: "Private",
    govt: "Government",
    password: "Password",
    password_ph: "Enter password",
    submit: "SUBMIT",
    submitting: "Submitting...",
    success: "Doctor registered successfully!",
    failed: "Failed to register doctor. Please try again.",
    fillAll: "Please fill in all fields.",
    invalidPhone: "Please enter a valid 10-digit phone number.",
};

function getNextDocId(currentId) {
    // currentId: "D00001"
    if (!currentId || !/^D\d{5}$/.test(currentId)) return 'D00001';
    const num = parseInt(currentId.slice(1), 10) + 1;
    return 'D' + num.toString().padStart(5, '0');
}

export default function DocSignup({ navigation }) {
    const [doctorName, setDoctorName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [hospitalType, setHospitalType] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        if (
            !doctorName.trim() ||
            !specialization.trim() ||
            !phoneNumber.trim() ||
            !hospitalType ||
            !password.trim()
        ) {
            Alert.alert('Error', t.fillAll);
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            Alert.alert('Error', t.invalidPhone);
            return;
        }
        setLoading(true);
        const hospitalTypeEng = hospitalType === 'private' ? 'Private' : 'Government';

        try {
            // 1. Get latest doc_id from doctors table
            const { data: rows, error: fetchError } = await supabase
                .from('doctors')
                .select('doc_id')
                .order('doc_id', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;
            const prevId = rows?.[0]?.doc_id;
            const newDocId = getNextDocId(prevId);

            const dataToInsert = {
                doc_id: newDocId,
                name: doctorName.trim(),
                specialist: specialization.trim(),
                phone_no: phoneNumber.trim(),
                d_type: hospitalTypeEng,
                password: password,
            };

            const { error } = await supabase.from('doctors').insert([dataToInsert]);

            if (error) {
                Alert.alert('Error', t.failed + '\n' + error.message);
                console.error('Supabase error:', error);
            } else {
                Alert.alert('Success', t.success + `\nYour ID: ${newDocId}`);
                setDoctorName('');
                setSpecialization('');
                setPhoneNumber('');
                setHospitalType('');
                setPassword('');
            }
        } catch (err) {
            Alert.alert('Error', t.failed);
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
                <Text style={styles.headerInside}>{t.form}</Text>
                {/* Doctor's Name */}
                <Text style={styles.label}>{t.doctorName}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithMic}
                        placeholder={t.doctorName_ph}
                        placeholderTextColor="#6499a1"
                        value={doctorName}
                        onChangeText={setDoctorName}
                    />
                </View>
                {/* Specialization */}
                <Text style={styles.label}>{t.specialization}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithMic}
                        placeholder={t.specialization_ph}
                        placeholderTextColor="#6499a1"
                        value={specialization}
                        onChangeText={setSpecialization}
                    />
                </View>
                {/* Phone Number */}
                <Text style={styles.label}>{t.phoneNumber}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithMic}
                        placeholder={t.phoneNumber_ph}
                        placeholderTextColor="#6499a1"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>
                {/* Hospital Type */}
                <Text style={styles.label}>{t.hospitalType}</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={hospitalType}
                        onValueChange={setHospitalType}
                        style={styles.picker}
                    >
                        <Picker.Item label={t.select_hosp} value="" />
                        <Picker.Item label={t.private} value="private" />
                        <Picker.Item label={t.govt} value="government" />
                    </Picker>
                </View>
                {/* Password */}
                <Text style={styles.label}>{t.password}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithMic}
                        placeholder={t.password_ph}
                        placeholderTextColor="#6499a1"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>
                        {loading ? t.submitting : t.submit}
                    </Text>
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
        alignItems: "center",
    },
    inputGroup: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
        padding: 20,
        width: "100%",
        maxWidth: 400,
        marginBottom: 20,
        marginTop: 20,
    },
    headerInside: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#3a4c5c',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: "#205099",
        marginTop: 16,
        marginBottom: 6,
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputWithMic: {
        flex: 1,
        backgroundColor: "#eaf7fa",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        color: "#333",
        borderWidth: 1,
        borderColor: "#6499a1",
    },
    pickerContainer: {
        backgroundColor: "#eaf7fa",
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#6499a1",
    },
    picker: {
        height: 48,
        width: "100%",
        color: "#205099",
    },
    submitButton: {
        backgroundColor: "#36b5b0",
        padding: 14,
        borderRadius: 10,
        marginTop: 28,
        alignItems: "center",
    },
    submitButtonDisabled: {
        backgroundColor: "#7ac4c1",
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});