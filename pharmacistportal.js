import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function PharmacistPortal({ navigation, route }) {
  // Pass pharmacy details to AddRemMedicine via navigation
  const { pharmacist_id, pharma_name, pharma_loc } = route.params || {};
  console.log("Route params:", route.params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediConnect</Text>
      <Text style={styles.subtitle}>Pharmacist Portal</Text>
      <View style={styles.buttonList}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() =>
            navigation.navigate("AddRemMedicine", {
              pharmacist_id,
              pharma_name,
              pharma_loc,
            })
          }
        >
          <Image
            source={require("./assets/medicine.png")}
            style={styles.medicineIcon}
          />
          <Text style={styles.buttonText}>Add / Remove Medicines</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("CheckDemand")}
        >
          <Image
            source={require("./assets/demand.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Check Demands</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7fa",
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3a4d5c",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: 20,
    color: "#205099",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 25,
    alignSelf: "flex-start",
  },
  buttonList: {
    width: "100%",
    marginTop: 14,
  },
  optionButton: {
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 22,
    shadowColor: "#3a4d5c",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  medicineIcon: {
    width: 70,
    height: 70,
    marginBottom: 8,
    resizeMode: "contain",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 20,
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 2,
  },
});
