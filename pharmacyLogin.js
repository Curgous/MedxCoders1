import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "./supabaseClient"; // Import your supabase client

export default function PharmacistLogin({ navigation }) {
  const [pharmacistId, setPharmacistId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!pharmacistId.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both your ID and password.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("pharmacist_login")
        .select("*")
        .eq("pharmacist_id", pharmacistId)
        .single();

      if (error) {
        Alert.alert("Invalid credentials", "Account ID or Password is incorrect.");
        return;
      }

      if (data.password === password) {
        Alert.alert("Login Successful", `Welcome ${data.p_name}!`);
        navigation.navigate('PharmacistPortal',{pharmacist_id: data.pharmacist_id,
          pharma_name: data.pharma_name,
          pharma_loc: data.pharma_loc,
          p_name: data.p_name,         // optionally pass pharmacist name
          }); // Navigate to pharmacistportal.js screen on success
      } else {
        Alert.alert("Invalid credentials", "Account ID or Password is incorrect.");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediConnect</Text>
      <Text style={styles.subtitle}>Pharmacist Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Pharmacist ID"
          value={pharmacistId}
          onChangeText={setPharmacistId}
          autoCapitalize="none"
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

        <TouchableOpacity
          style={styles.signupLinkContainer}
          onPress={() => navigation.navigate("PharmacistSignup")}
        >
          <Text style={styles.signupText}>
            Create account - <Text style={styles.signupLink}>Sign Up</Text>
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
  loginButton: {
    backgroundColor: "#36b5b0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLinkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#205099",
  },
  signupLink: {
    color: "#36b5b0",
    fontWeight: "bold",
  },
});
