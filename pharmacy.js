import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Linking,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from './supabaseClient';
import haversine from 'haversine-distance';

export default function Pharmacy() {
    const [searchText, setSearchText] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Get user location on mount
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required to find nearest pharmacies.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    // 🔹 Search handler
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        if (!userLocation) {
            Alert.alert('Error', 'Unable to get your location.');
            return;
        }

        setLoading(true);
        try {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from('pharma_status')
                .select('*')
                .ilike('Medicine_Name', `%${searchText.trim()}%`);

            if (error) throw error;

            if (!data || data.length === 0) {
                Alert.alert('No Pharmacy', 'No pharmacy found with this medicine.');
                setPharmacies([]);
                setLoading(false);
                return;
            }

            // Add distance to each pharmacy
            const withDistance = data.map((pharma) => {
                const distance = haversine(userLocation, {
                    latitude: pharma.Pharmacy_Loc.latitude,
                    longitude: pharma.Pharmacy_Loc.longitude,
                });
                return { ...pharma, distanceKm: (distance / 1000).toFixed(2) };
            });

            // Sort by distance, take 5 nearest
            const sorted = withDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
            setPharmacies(sorted);
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Open Google Maps
    const openMaps = (lat, lng) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(url);
    };

    const renderPharmacy = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.Pharma_Name}</Text>
            <Text style={styles.text}>💊 {item.Medicine_Name}</Text>
            <Text style={styles.text}>📦 Amount: {item.Medicine_Amount}</Text>
            <Text style={styles.text}>📍 Distance: {item.distanceKm} km</Text>
            <TouchableOpacity
                style={styles.mapButton}
                onPress={() => openMaps(item.Pharmacy_Loc.latitude, item.Pharmacy_Loc.longitude)}
            >
                <Text style={styles.mapButtonText}>Open in Google Maps</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Medicine Finder</Text>

            {/* Search Bar */}
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Enter medicine name..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Loader */}
            {loading && <ActivityIndicator size="large" color="#36b5b0" style={{ marginTop: 20 }} />}

            {/* Pharmacies List */}
            <FlatList
                data={pharmacies}
                keyExtractor={(item, index) => item.Medicine_Id + index}
                renderItem={renderPharmacy}
                style={{ marginTop: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#eaf7fa' },
    header: { fontSize: 24, fontWeight: 'bold', color: '#205099', marginBottom: 20, textAlign: 'center' },
    searchRow: { flexDirection: 'row', marginBottom: 10 },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        borderColor: '#6499a1',
        borderWidth: 1,
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#36b5b0',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    searchButtonText: { color: '#fff', fontWeight: 'bold' },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#3a4d5c', marginBottom: 6 },
    text: { fontSize: 14, color: '#205099', marginBottom: 4 },
    mapButton: {
        marginTop: 8,
        backgroundColor: '#36b5b0',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    mapButtonText: { color: '#fff', fontWeight: 'bold' },
});
