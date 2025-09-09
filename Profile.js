// Profile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Profile({ route }) {
    const { patient } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Patient Profile</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Patient ID:</Text>
                <Text style={styles.value}>{patient.patient_no}</Text>

                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{patient.name}</Text>

                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{patient.phone_no}</Text>

                {patient.age && (
                    <>
                        <Text style={styles.label}>Age:</Text>
                        <Text style={styles.value}>{patient.age}</Text>
                    </>
                )}

                {patient.gender && (
                    <>
                        <Text style={styles.label}>Gender:</Text>
                        <Text style={styles.value}>{patient.gender}</Text>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eaf7fa', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#205099' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 3,
    },
    label: { fontWeight: 'bold', marginTop: 10, color: '#333' },
    value: { fontSize: 16, marginBottom: 6 },
});
