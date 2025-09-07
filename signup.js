// signup.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { supabase } from './supabaseClient';


export default function Signup({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            // 1️⃣ Get last patient_no
            let { data: lastPatient, error: fetchError } = await supabase
                .from('patients')
                .select('patient_no')
                .order('patient_no', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;

            // 2️⃣ Generate new patient_no
            let newPatientNo = 'P00001'; // default if no rows
            if (lastPatient.length > 0) {
                const lastId = lastPatient[0].patient_no; // e.g. "P00012"
                const num = parseInt(lastId.slice(1)) + 1;
                newPatientNo = 'P' + num.toString().padStart(5, '0');
            }

            // 3️⃣ Insert new patient
            // 3️⃣ Insert new patient
            const { data, error } = await supabase
                .from('patients')
                .insert([{ patient_no: newPatientNo, password, phone_no: phone, name }])
                .select('*'); // make sure patient_no is included

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

            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* App Branding */}
                <Text style={styles.appName}>MediConnect</Text>

                {/* Section title */}
                <Text style={styles.header}>Patient Registration</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginLink}>Already have an account? Login</Text>
                    </TouchableOpacity>
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
        padding: 20
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
        color: '#205099'
    },
    form: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16
    },
    signupButton: {
        backgroundColor: '#36b5b0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15
    },
    signupText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    loginLink: {
        fontSize: 14,
        textAlign: 'center',
        color: '#205099',
        fontWeight: 'bold'
    }
});
