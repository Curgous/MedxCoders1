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

const SPECIALIZATION_OPTIONS = [
    "Basic health-check up provider",
    "Health Education Provider",
    "ANM/ASHA Worker",
    "Patient referral and Co-ordinator"
];

function getNextChoId(currentId) {
    // currentId: "C00001"
    if (!currentId || !/^C\d{5}$/.test(currentId)) return 'C00001';
    const num = parseInt(currentId.slice(1), 10) + 1;
    return 'C' + num.toString().padStart(5, '0');
}

export default function ChoSignup({ navigation }) {
    const [choName, setChoName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        if (!choName.trim() || !specialization || !phoneNumber.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);

        try {
            // Get latest cho_id from chos table
            const { data: rows, error: fetchError } = await supabase
                .from('chos')
                .select('cho_id')
                .order('cho_id', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;

            const prevId = rows?.[0]?.cho_id;
            const newChoId = getNextChoId(prevId);

            const dataToInsert = {
                cho_id: newChoId,
                cho_name: choName.trim(),
                type: specialization,
                phone_no: phoneNumber.trim(),
                password: password,
            };

            const { error } = await supabase.from('chos').insert([dataToInsert]);
            if (error) {
                Alert.alert('Error', 'Failed to register CHO.\n' + error.message);
            } else {
                Alert.alert('Success', `CHO registered successfully!\nYour CHO ID is: ${newChoId}`);
                setChoName('');
                setSpecialization('');
                setPhoneNumber('');
                setPassword('');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to register CHO.');
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
                <Text style={styles.headerInside}>CHO Signup</Text>

                <Text style={styles.label}>CHO's Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Enter full name"
                        placeholderTextColor="#6499a1"
                        value={choName}
                        onChangeText={setChoName}
                    />
                </View>

                <Text style={styles.label}>Specialization</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={specialization}
                        onValueChange={setSpecialization}
                        style={styles.picker}
                    >
                        <Picker.Item label="Choose specialization" value="" />
                        {SPECIALIZATION_OPTIONS.map((option) => (
                            <Picker.Item key={option} label={option} value={option} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Enter 10-digit number"
                        placeholderTextColor="#6499a1"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>

                <Text style={styles.label}>Enter Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Enter password"
                        placeholderTextColor="#6499a1"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>
                        {loading ? 'Submitting...' : 'SUBMIT'}
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
    inputField: {
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