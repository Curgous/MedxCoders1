// vidcon.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
} from "react-native";
import { supabase } from "./supabaseClient";

export default function Vidcon({ route }) {
    const { patient_no } = route.params || {};
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(patient_no);

    // Fetch scheduled meetings for the specific patient
    async function fetchMeetings() {
        setLoading(true);

        if (!patient_no) {
            alert("Patient ID not found");
            setLoading(false);
            setMeetings([]);
            return;
        }

        let { data, error } = await supabase
            .from("coun_sche")
            .select("id, dr_name, date, time, vid_link, pat_id")
            .eq("pat_id", patient_no)
            .order("date", { ascending: true });

        if (error) {
            alert("Failed to fetch meetings: " + error.message);
            setMeetings([]);
        } else {
            setMeetings(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchMeetings();
    }, [patient_no]);

    // Open link in browser
    const openLink = (url) => {
        if (url) {
            // Ensure URL has a scheme
            let validUrl = url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;
            Linking.openURL(validUrl).catch((err) =>
                alert("Failed to open link: " + err.message)
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Scheduled Meetings</Text>
            <Text style={styles.patientInfo}>Patient ID: {patient_no || "N/A"}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#36b5b0" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={meetings}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No scheduled meetings found for this patient.
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.meetingCard}>
                            <Text style={styles.doctorName}>Doctor: {item.dr_name || "Unknown"}</Text>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{item.date || "-"}</Text>
                            <Text style={styles.label}>Time:</Text>
                            <Text style={styles.value}>{item.time || "-"}</Text>
                            <Text style={styles.label}>Meeting Link:</Text>
                            <TouchableOpacity onPress={() => openLink(item.vid_link)}>
                                <Text style={[styles.value, styles.link]} numberOfLines={1} ellipsizeMode="tail">
                                    {item.vid_link || "N/A"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eaf7fa",
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#205099",
        marginTop: 14,
        marginBottom: 10,
        textAlign: "center",
    },
    patientInfo: {
        fontSize: 16,
        fontWeight: "600",
        color: "#36b5b0",
        textAlign: "center",
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    meetingCard: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 18,
        marginBottom: 15,
        elevation: 3,
    },
    doctorName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#3182ce",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#205099",
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },
    link: {
        color: "#3182ce",
        textDecorationLine: "underline",
    },
});