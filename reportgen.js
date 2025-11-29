import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "./supabaseClient";

export default function ReportGen({ route }) {
  const { user } = route.params || {};
  console.log({ user });
  const doctorName = user?.name || "";

  // Form states
  const [patientId, setPatientId] = useState("");
  const [subject, setSubject] = useState("");
  const [drRemedy, setDrRemedy] = useState("");
  const [presMed, setPresMed] = useState("");
  const [nextConsult, setNextConsult] = useState(new Date());

  // DatePicker visibility for Android
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle date selection
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setNextConsult(selectedDate);
    }
  };

  // Submit form data
  const handleSubmit = async () => {
    if (!patientId.trim() || !subject.trim() || !drRemedy.trim() || !presMed.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const { error } = await supabase.from("reports").insert([
        {
          patient_id: patientId.trim(),
          subject: subject.trim(),
          dr_rmdy: drRemedy.trim(),
          pres_med: presMed.trim(),
          next_con: nextConsult.toISOString(),
          dr_name: doctorName,
        },
      ]);
      if (error) throw error;

      // ✅ Call backend to send SMS
      // Replace 'YOUR_IP_ADDRESS' with your computer's actual IP address.
      const twilioResponse = await fetch(`http://abc:3000/twilio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId.trim(),
          subject: subject.trim(),
          drRemedy: drRemedy.trim(),
          presMed: presMed.trim(),
          drName: doctorName,
          toPhone: '+918778997804', // Replace with the actual patient's phone number
        }),
      });
      const twilioData = await twilioResponse.json();

      if (!twilioResponse.ok) {
        throw new Error(twilioData.error || "Failed to send SMS.");
      }

      Alert.alert("Success", "Report submitted & SMS sent.");
      setPatientId("");
      setSubject("");
      setDrRemedy("");
      setPresMed("");
      setNextConsult(new Date());
    } catch (err) {
      console.error("Error submitting report:", err);
      Alert.alert("Error", err.message || "Failed to submit report.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Generate Report</Text>

      <Text style={styles.label}>Patient's ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Patient ID"
        value={patientId}
        onChangeText={setPatientId}
        keyboardType="default"
      />

      <Text style={styles.label}>Report Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter report subject"
        value={subject}
        onChangeText={setSubject}
        keyboardType="default"
      />

      <Text style={styles.label}>Doctor's Remedy</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Enter doctor's remedy details"
        value={drRemedy}
        onChangeText={setDrRemedy}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Prescribed Medication</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        placeholder="Enter prescribed medications"
        value={presMed}
        onChangeText={setPresMed}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Next Consultation Date</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>{nextConsult.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={nextConsult}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eaf7fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#205099",
    marginTop: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#6499a1",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  largeInput: {
    height: 100,
  },
  label: {
    color: "#205099",
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6499a1",
    marginBottom: 24,
  },
  datePickerText: {
    fontSize: 16,
    color: "#33475b",
  },
  submitButton: {
    backgroundColor: "#36b5b0",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
