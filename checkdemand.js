import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "./supabaseClient";

export default function CheckDemand() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemands();
  }, []);

  // Fetch all medicine demands
  const fetchDemands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("med_demand").select("*");
      if (error) throw error;
      setDemands(data || []);
    } catch (err) {
      Alert.alert("Error fetching demands", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove a demand if its medicine exists in pharma_status
  const handleRemoveDemand = async (demandItem) => {
    try {
      // Check if medicine exists in pharma_status table
      const { data: pharmaData, error: pharmaError } = await supabase
        .from("pharma_status")
        .select("Medicine_Name")
        .eq("Medicine_Name", demandItem.demand)
        .limit(1);

      if (pharmaError) throw pharmaError;

      if (pharmaData && pharmaData.length > 0) {
        // Medicine exists in pharma_status, allow removal
        Alert.alert(
          "Remove Demand",
          `Medicine "${demandItem.demand}" exists in stock. Remove from demands?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Remove",
              onPress: async () => {
                const { error } = await supabase
                  .from("med_demand")
                  .delete()
                  .eq("id", demandItem.id);
                if (error) {
                  Alert.alert("Error", error.message);
                } else {
                  Alert.alert("Removed", `Demand for "${demandItem.demand}" was removed.`);
                  fetchDemands();
                }
              },
              style: "destructive",
            },
          ]
        );
      } else {
        Alert.alert(
          "Cannot Remove",
          `Medicine "${demandItem.demand}" is not yet in stock and cannot be removed.`
        );
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to remove demand.");
    }
  };

  const renderDemandItem = ({ item }) => (
    <View style={styles.demandCard}>
      <Text style={styles.demandText}>{item.demand}</Text>
      <TouchableOpacity onPress={() => handleRemoveDemand(item)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current medicine demands</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#36b5b0" style={{ marginTop: 20 }} />
      ) : demands.length === 0 ? (
        <Text style={styles.noDemandsText}>No medicine demands found.</Text>
      ) : (
        <FlatList
          data={demands}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDemandItem}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#205099",
    marginTop:15,
    marginBottom: 15,
    textAlign: "center",
  },
  demandCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  demandText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDemandsText: {
    fontSize: 18,
    color: "#205099",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  },
});
