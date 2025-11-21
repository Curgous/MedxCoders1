import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Linking,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "./supabaseClient";

export default function Counsche({ route }) {
    const { dr_name, dr_id } = route.params || {};
    console.log(dr_id);

    const [section, setSection] = useState("create"); // "create" or "schedules"

    // Create Meeting states
    const [patientId, setPatientId] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Schedule states
    const [meetings, setMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(false);

    async function fetchSchedules() {
        setLoadingMeetings(true);

        try {
            // Fetch all meetings for current doctor
            let { data: meetingsData, error: meetingsError } = await supabase
                .from("coun_sche")
                .select("*")
                .eq("dr_id", dr_id)
                .order("date", { ascending: true });

            if (meetingsError) {
                alert("Failed to fetch meetings: " + meetingsError.message);
                setMeetings([]);
                setLoadingMeetings(false);
                return;
            }

            // If no meetings found, set empty array and return
            if (!meetingsData || meetingsData.length === 0) {
                setMeetings([]);
                setLoadingMeetings(false);
                return;
            }

            // Extract unique patient IDs from meetings
            const patientIds = [...new Set(meetingsData.map(m => m.pat_id))];

            // Fetch patient info for only the patients who have meetings
            let { data: patientsData, error: patientsError } = await supabase
                .from("patients")
                .select("patient_no, name, age, gender, phone_no")
                .in("patient_no", patientIds);

            if (patientsError) {
                console.error("Failed to fetch patients:", patientsError.message);
                // Continue with meetings data even if patient fetch fails
                const meetingsWithoutPatientInfo = meetingsData.map((m) => ({
                    ...m,
                    patientInfo: null,
                }));
                setMeetings(meetingsWithoutPatientInfo);
                setLoadingMeetings(false);
                return;
            }

            // Map patients by their patient_no for quick lookup
            const patientMap = {};
            if (patientsData) {
                patientsData.forEach((patient) => {
                    patientMap[patient.patient_no] = patient;
                });
            }

            // Merge patient info into meetings by matching pat_id with patient_no
            const combinedMeetings = meetingsData.map((meeting) => ({
                ...meeting,
                patientInfo: patientMap[meeting.pat_id] || null,
            }));

            setMeetings(combinedMeetings);
        } catch (error) {
            console.error("Error in fetchSchedules:", error);
            alert("An error occurred while fetching schedules");
            setMeetings([]);
        } finally {
            setLoadingMeetings(false);
        }
    }

    async function handleCreateMeeting() {
        if (!patientId.trim() || !videoLink.trim() || !date || !time) {
            alert("Please fill all fields");
            return;
        }

        const dateStr = date.toISOString().split("T")[0];
        const timeStr = time.toTimeString().substr(0, 8);

        const newMeeting = {
            pat_id: patientId.trim(),
            vid_link: videoLink.trim(),
            date: dateStr,
            time: timeStr,
            dr_name: dr_name || "",
            dr_id: dr_id || "",
        };

        let { error } = await supabase.from("coun_sche").insert([newMeeting]);
        if (error) {
            alert("Failed to create meeting: " + error.message);
        } else {
            alert("Meeting created successfully");
            setPatientId("");
            setVideoLink("");
            setDate(null);
            setTime(null);
        }
    }

    function onDateChange(event, selectedDate) {
        setShowDatePicker(Platform.OS === "ios");
        if (selectedDate) setDate(selectedDate);
    }

    function onTimeChange(event, selectedTime) {
        setShowTimePicker(Platform.OS === "ios");
        if (selectedTime) setTime(selectedTime);
    }

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    }

    function formatTime(timeStr) {
        if (!timeStr) return "-";
        return timeStr.substring(0, 5);
    }

    // Handle clickable link press
    function openLink(url) {
        if (url) {
            Linking.openURL(url).catch(err => alert("Failed to open link: " + err.message));
        }
    }

    useEffect(() => {
        if (section === "schedules") fetchSchedules();
    }, [section]);

    return (
        <View style={{ flex: 1, backgroundColor: "#e0f0f1", paddingTop: 16 }}>
            {/* Section toggles */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16, gap: 8, paddingHorizontal: 8 }}>
                <TouchableOpacity
                    style={[styles.toggleButton, section === "create" && styles.activeToggle]}
                    onPress={() => setSection("create")}
                >
                    <Text style={[styles.toggleText, section === "create" && styles.activeToggleText]}>Create Meeting</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, section === "schedules" && styles.activeToggle]}
                    onPress={() => setSection("schedules")}
                >
                    <Text style={[styles.toggleText, section === "schedules" && styles.activeToggleText]}>Schedules</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {section === "create" && (
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                    <View style={styles.createMeetingContainer}>
                        <Text style={styles.containerTitle}>Create Meeting</Text>

                        <Text style={styles.labelText}>Patient ID</Text>
                        <TextInput
                            style={styles.input}
                            value={patientId}
                            onChangeText={setPatientId}
                            autoCapitalize="characters"
                            placeholder="Enter Patient ID"
                        />

                        <Text style={styles.labelText}>Meeting Link</Text>
                        <TextInput
                            style={styles.input}
                            value={videoLink}
                            onChangeText={setVideoLink}
                            autoCapitalize="none"
                            placeholder="Enter Meeting Link"
                        />

                        <Text style={styles.labelText}>Date</Text>
                        <TouchableOpacity style={styles.picker} onPress={() => setShowDatePicker(true)}>
                            <Text>{date ? date.toLocaleDateString() : "Select Date"}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={onDateChange}
                            />
                        )}

                        <Text style={styles.labelText}>Time</Text>
                        <TouchableOpacity style={styles.picker} onPress={() => setShowTimePicker(true)}>
                            <Text>{time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"}</Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={time || new Date()}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}

                        <TouchableOpacity style={styles.submitButton} onPress={handleCreateMeeting}>
                            <Text style={styles.submitButtonText}>Create Meeting</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {section === "schedules" && (
                loadingMeetings ? (
                    <ActivityIndicator size="large" color="#32b1b1" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={meetings}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        contentContainerStyle={{ padding: 20 }}
                        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>No schedules available</Text>}
                        renderItem={({ item }) => (
                            <View style={styles.meetingCard}>
                                <Text style={styles.title}>Patient ID: {item.pat_id}</Text>
                                <Text style={styles.patientDetail}>
                                    Name: {item.patientInfo?.name || "Patient not found"}
                                </Text>
                                <Text style={styles.patientDetail}>
                                    Age: {item.patientInfo?.age || "N/A"}
                                </Text>
                                <Text style={styles.patientDetail}>
                                    Gender: {item.patientInfo?.gender || "N/A"}
                                </Text>
                                <Text style={styles.patientDetail}>
                                    Phone: {item.patientInfo?.phone_no || "N/A"}
                                </Text>
                                <Text style={styles.meetingDetail}>Doctor: {item.dr_name}</Text>
                                <Text style={styles.meetingDetail}>Date: {formatDate(item.date)}</Text>
                                <Text style={styles.meetingDetail}>Time: {formatTime(item.time)}</Text>
                                <Text style={styles.meetingDetail}>
                                    Link:{" "}
                                    <Text
                                        style={{ color: "blue", textDecorationLine: "underline" }}
                                        onPress={() => openLink(item.vid_link)}
                                    >
                                        {item.vid_link || "N/A"}
                                    </Text>
                                </Text>
                            </View>
                        )}
                        refreshing={loadingMeetings}
                        onRefresh={fetchSchedules}
                    />
                )
            )}
        </View>
    );
}

const styles = {
    toggleButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#36b5b0",
        borderRadius: 25,
        paddingVertical: 12,
        marginTop: 20,
        alignItems: "center",

    },
    activeToggle: {
        backgroundColor: "#36b5b0",
    },
    toggleText: {
        fontSize: 18,
        color: "#205099",
        fontWeight: "bold",
    },
    activeToggleText: {
        color: "#205099",
    },
    createMeetingContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    containerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#36b5b0",
        textAlign: "center",
        marginBottom: 20,
    },
    labelText: {
        marginBottom: 6,
        marginTop: 5,
        fontWeight: "bold",
        fontSize: 16,
        color: "#205099",
    },
    input: {
        borderWidth: 1,
        borderColor: "#a1cfcf",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 14,
        marginBottom: 15,
        fontSize: 18,
    },
    picker: {
        borderWidth: 1,
        borderColor: "#a1cfcf",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 14,
        marginBottom: 15,
        justifyContent: "center",
    },
    submitButton: {
        backgroundColor: "#36b5b0",
        borderRadius: 25,
        paddingVertical: 15,
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    meetingCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginVertical: 8,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 6,
        color: "#36b5b0",
    },
    patientDetail: {
        fontSize: 16,
        color: "#333",
        marginBottom: 2,
    },
    meetingDetail: {
        fontSize: 16,
        color: "#555",
        marginTop: 4,
    },
};