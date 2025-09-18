// doctor.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert
} from 'react-native';
import { supabase } from './supabaseClient';

export default function Doctor({ navigation }) {
    const [hprId, setHprId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            let tableName = '';
            let idColumn = '';
            let destination = '';

            // 🔹 Decide table based on ID prefix
            if (hprId.trim().toUpperCase().startsWith('C')) {
                tableName = 'chos';
                idColumn = 'cho_id';
                destination = 'Cho'; // make sure Cho.js is added in your navigator
            } else {
                tableName = 'doctors';
                idColumn = 'doc_id';
                destination = 'DoctorDashboard';
            }

            // 1️⃣ Query the appropriate table
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq(idColumn, hprId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    Alert.alert("Not registered", `${hprId} not found in ${tableName}.`);
                } else {
                    Alert.alert("Error", error.message);
                }
                return;
            }

            // 2️⃣ Verify password
            if (data.password === password) {
                Alert.alert("Login successful", `Welcome ${data.name || 'User'}!`);
                navigation.navigate(destination, { user: data });
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
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.appName}>MediConnect</Text>
                <Text style={styles.header}>👨‍⚕️ HPR / CHO Login</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter HPR ID / CHO ID"
                        value={hprId}
                        onChangeText={setHprId}
                        autoCapitalize="characters"
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
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    appName: { fontSize: 32, fontWeight: 'bold', color: '#36b5b0', marginBottom: 80 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, color: '#205099' },
    form: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    loginButton: { backgroundColor: '#36b5b0', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
    loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
