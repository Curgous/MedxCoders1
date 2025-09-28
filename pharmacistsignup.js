import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { supabase } from "./supabaseClient";

export default function PharmacistSignup({ navigation }) {
  const [pName, setPName] = useState("");
  const [phone, setPhone] = useState("");
  const [pharmaName, setPharmaName] = useState("");
  const [pharmaLoc, setPharmaLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Generate next unique integer pharmacist_id = max + 1
  const generatePharmacistId = async () => {
    const { data, error } = await supabase
      .from("pharmacist_login")
      .select("pharmacist_id")
      .order("pharmacist_id", { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);

    let nextIdNum = 1;
    if (data && data.length > 0) {
      const lastId = data[0].pharmacist_id;
      if (typeof lastId === "number") {
        nextIdNum = lastId + 1;
      } else {
        const parsed = parseInt(lastId, 10);
        nextIdNum = isNaN(parsed) ? 1 : parsed + 1;
      }
    }
    return nextIdNum;
  };

  // Generate next unique integer pharma_id = max + 1
  const generatePharmaId = async () => {
    const { data, error } = await supabase
      .from("pharmacist_login")
      .select("pharma_id")
      .order("pharma_id", { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);

    let nextIdNum = 1;
    if (data && data.length > 0) {
      const lastId = data[0].pharma_id;
      if (typeof lastId === "number") {
        nextIdNum = lastId + 1;
      } else {
        const parsed = parseInt(lastId, 10);
        nextIdNum = isNaN(parsed) ? 1 : parsed + 1;
      }
    }
    return nextIdNum;
  };

  const handleLocation = async () => {
    setLocLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to set your pharmacy's location."
        );
        setLocLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setPharmaLoc({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert("Location Captured", `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`);
    } catch (err) {
      Alert.alert("Error", "Failed to get location.");
    } finally {
      setLocLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!pName.trim() || !phone.trim() || !pharmaName.trim() ||
        !pharmaLoc || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill all fields and set location.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setCreating(true);

    try {
      const pharmacist_id = await generatePharmacistId();
      const pharma_id = await generatePharmaId();

      const { error } = await supabase
        .from("pharmacist_login")
        .insert([
          {
            pharmacist_id,
            pharma_id,
            p_name: pName,
            phone_no: phone,
            password,
            pharma_name: pharmaName,
            pharma_loc: pharmaLoc, // Stored as JSON: {latitude, longitude}
          },
        ]);
      if (error) throw error;

      Alert.alert(
        "Account Created",
        `Pharmacist ID: ${pharmacist_id}\nPharmacy ID: ${pharma_id}\nSignup successful!`
      );
      setPName("");
      setPhone("");
      setPharmaName("");
      setPharmaLoc(null);
      setPassword("");
      setConfirmPassword("");
      // navigation.navigate('PharmacistLogin'); // Optional: go to login
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to create account.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediConnect</Text>
      <Text style={styles.subtitle}>Pharmacist Signup</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Pharmacist Name"
          value={pName}
          onChangeText={setPName}
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
          placeholder="Pharmacy Name"
          value={pharmaName}
          onChangeText={setPharmaName}
        />
        <TouchableOpacity
          style={[
            styles.locationButton,
            pharmaLoc ? styles.locationSet : styles.locationUnset,
          ]}
          onPress={handleLocation}
          disabled={locLoading}
        >
          <Text style={styles.locationText}>
            {pharmaLoc
              ? `Location Set (${pharmaLoc.latitude.toFixed(4)}, ${pharmaLoc.longitude.toFixed(4)})`
              : locLoading ? "Getting location..." : "Set Pharmacy Location"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={creating}
        >
          <Text style={styles.signupText}>
            {creating ? "Creating..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#36b5b0",
    marginBottom: 28,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#205099",
    marginBottom: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  locationButton: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#205099",
  },
  locationUnset: {
    borderColor: "#36b5b0",
    backgroundColor: "#eaf7fa",
  },
  locationSet: {
    borderColor: "#38b000",
    backgroundColor: "#e7fce7",
  },
  signupButton: {
    backgroundColor: "#36b5b0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
