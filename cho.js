// Cho.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Cho({ route }) {
    const { user } = route.params || {}; // receive user details from navigation

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CHO Dashboard</Text>
            {user ? (
                <>
                    <Text style={styles.welcome}>Welcome {user.name}!</Text>
                    <Text style={styles.details}>CHO ID: {user.cho_id}</Text>
                    <Text style={styles.details}>Phone: {user.phone_no}</Text>
                    <Text style={styles.details}>Specialization: {user.specialist || 'N/A'}</Text>
                </>
            ) : (
                <Text style={styles.details}>No user data available.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#205099',
        marginBottom: 20,
    },
    welcome: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#36b5b0',
    },
    details: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
});
