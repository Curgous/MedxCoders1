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
    Alert,
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
            // Decide table based on ID prefix
            if (hprId.trim().toUpperCase().startsWith('C')) {
                tableName = 'chos';
                idColumn = 'cho_id';
                // Default destination, will be updated based on type
                destination = 'Cho';
            } else {
                tableName = 'doctors';
                idColumn = 'doc_id';
                destination = 'DoctorDashboard';
            }
            // Query the appropriate table
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
            // Verify password
            if (data.password === password) {
                Alert.alert("Login successful", `Welcome ${data.name || data.cho_name || 'User'}!`);
                
                // For CHO users, check the type column to determine destination
                if (tableName === 'chos') {
                    const userType = data.type;
                    if (userType === 'ANM/ASHA Worker') {
                        destination = 'AshaDash'; // Navigate to ashaDash.js
                    } else {
                        destination = 'Cho'; // Navigate to cho.js for other types
                    }
                }
                
                navigation.navigate(destination, { user: data });
            } else {
                Alert.alert("Invalid credentials", "Password is incorrect.");
            }
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.appName}>MediConnect</Text>
                <Text style={styles.header}>👨‍⚕️ HPR / CHO Login</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter HPR/CHO ID"
                        value={hprId}
                        onChangeText={setHprId}
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>

                    {/* Doctor's Sign up link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DocSignup')}
                        style={styles.signupLink}
                    >
                        <Text style={styles.signupLinkText}>Doctor's Sign up</Text>
                    </TouchableOpacity>

                    {/* CHO's Sign up link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChoSignup')}
                        style={styles.signupLink}
                    >
                        <Text style={styles.signupLinkText}>CHO's Sign up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 60,
        textAlign: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#205099',
        textAlign: 'center',
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
    loginButton: {
        backgroundColor: '#36b5b0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 5,
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupLink: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    signupLinkText: {
        color: '#205099',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});