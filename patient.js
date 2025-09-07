// patient.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { supabase } from './supabaseClient';

export default function Patient({ navigation }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // 1️⃣ Query patients table for this phone
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('phone_no', phone)
                .single(); // expect only 1 row

            if (error) {
                if (error.code === "PGRST116") {
                    // no record found
                    Alert.alert("Not registered", "This phone number is not registered.");
                } else {
                    Alert.alert("Error", error.message);
                }
                return;
            }

            // 2️⃣ Check password
            if (data.password === password) {
                if (data.password === password) {
                    Alert.alert("Login successful", `Welcome ${data.name}!`);
                    navigation.navigate('PatientDashboard', { patient: data }); // 👈 pass patient data to dashboard
                }
            } else {
                Alert.alert("Invalid credentials", "Password is incorrect.");
            }

        } catch (err) {
            Alert.alert("Error", err.message);
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
                <Text style={styles.appName}>MediConnect</Text>
                <Text style={styles.header}>Patient Login</Text>

                <View style={styles.form}>
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

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>

                    <Text style={styles.signupText}>
                        Don’t have an account?{' '}
                        <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
                            Sign up
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
        padding: 20
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#36b5b0',
        marginBottom: 100,
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
    loginButton: {
        backgroundColor: '#36b5b0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    signupText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333'
    },
    signupLink: {
        color: '#36b5b0',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',

    },
});
