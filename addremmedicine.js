import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { supabase } from "./supabaseClient";
import { MaterialIcons } from "@expo/vector-icons"; // for pencil and delete icons

export default function AddRemMedicine({ route }) {
  // If coming from props or route.params
  const { pharmacist_id, pharma_name, pharma_loc } = route.params || {};
  console.log("Route params:", route.params);

  // Section toggle state
  const [section, setSection] = useState("add");

  // Add medicine state
  const [medicineName, setMedicineName] = useState("");
  const [medicineStock, setMedicineStock] = useState("");
  const [adding, setAdding] = useState(false);

  // Remove medicine state
  const [medicines, setMedicines] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(true);

  // Editing state (medicine id and new stock)
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [editingStock, setEditingStock] = useState("");

  // Fetch medicines for Remove section
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoadingMeds(true);
    try {
      const { data, error } = await supabase
        .from("pharma_status")
        .select("*")
        .eq("Pharma_id", pharmacist_id);
      if (error) throw error;
      setMedicines(data || []);
    } catch (err) {
      Alert.alert("Error fetching medicines", err.message);
    }
    setLoadingMeds(false);
  };

  // Generate next Medicine_id
  const generateMedicineId = async () => {
    const { data, error } = await supabase
      .from("pharma_status")
      .select("Medicine_id")
      .order("Medicine_id", { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);
    let nextIdNum = 1;
    if (data && data.length > 0) {
      const lastId = data[0].Medicine_id;
      if (typeof lastId === "number") {
        nextIdNum = lastId + 1;
      } else {
        const parsed = parseInt(lastId, 10);
        nextIdNum = isNaN(parsed) ? 1 : parsed + 1;
      }
    }
    return nextIdNum;
  };

  const handleAddMedicine = async () => {
    if (!medicineName.trim() || !medicineStock.trim()) {
      Alert.alert("Error", "Please enter medicine name and stock.");
      return;
    }
    setAdding(true);
    try {
      const Medicine_id = await generateMedicineId();
      const { error } = await supabase
        .from("pharma_status")
        .insert([
          {
            Medicine_id,
            Medicine_Name: medicineName,
            medicine_Amount: parseInt(medicineStock, 10),
            Pharma_id: pharmacist_id,
            Pharma_Name: pharma_name,
            Pharmacy_Loc: pharma_loc, // should be JSON object
          },
        ]);
      if (error) throw error;

      Alert.alert("Medicine Added", `Added ${medicineName} with ID ${Medicine_id}`);
      setMedicineName("");
      setMedicineStock("");
      fetchMedicines();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to add medicine.");
    } finally {
      setAdding(false);
    }
  };

  // Start editing a medicine's stock
  const startEditing = (medicineId, currentStock) => {
    setEditingMedicineId(medicineId);
    setEditingStock(String(currentStock));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingMedicineId(null);
    setEditingStock("");
  };

  // Save edited stock to database
  const saveEditedStock = async () => {
    if (editingStock.trim() === "" || isNaN(editingStock) || parseInt(editingStock) < 0) {
      Alert.alert("Invalid Stock", "Please enter a valid stock number");
      return;
    }
    try {
      const { error } = await supabase
        .from("pharma_status")
        .update({ medicine_Amount: parseInt(editingStock) })
        .eq("Medicine_id", editingMedicineId);
      if (error) throw error;

      Alert.alert("Updated", "Stock updated successfully");
      setEditingMedicineId(null);
      setEditingStock("");
      fetchMedicines();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to update stock.");
    }
  };

  // Delete a medicine from the table
  const deleteMedicine = async (medicineId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this medicine?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("pharma_status")
                .delete()
                .eq("Medicine_id", medicineId);
              if (error) throw error;

              Alert.alert("Deleted", "Medicine deleted successfully");
              fetchMedicines();
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete medicine.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            section === "add" && styles.toggleActive,
          ]}
          onPress={() => setSection("add")}
        >
          <Text style={styles.toggleText}>Add Medicine</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            section === "remove" && styles.toggleActive,
          ]}
          onPress={() => setSection("remove")}
        >
          <Text style={styles.toggleText}>Remove Medicine</Text>
        </TouchableOpacity>
      </View>

      {section === "add" && (
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Add Medicine</Text>
          <TextInput
            style={styles.input}
            placeholder="Medicine Name"
            value={medicineName}
            onChangeText={setMedicineName}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={medicineStock}
            keyboardType="number-pad"
            onChangeText={setMedicineStock}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMedicine}
            disabled={adding}
          >
            <Text style={styles.addButtonText}>
              {adding ? "Adding..." : "Add Medicine"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {section === "remove" && (
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Available Medicines</Text>
          {loadingMeds ? (
            <Text style={{ color: "#205099", alignSelf: "center", marginTop: 10 }}>
              Loading...
            </Text>
          ) : medicines.length === 0 ? (
            <Text style={{ color: "#205099", alignSelf: "center", marginTop: 10 }}>
              No medicines available.
            </Text>
          ) : (
            medicines.map((med) => (
              <View key={med.Medicine_id} style={styles.medCard}>
                <Text style={styles.medName}>💊 {med.Medicine_Name}</Text>

                {editingMedicineId === med.Medicine_id ? (
                  <>
                    <TextInput
                      style={[styles.medStock, styles.editInput]}
                      value={editingStock}
                      keyboardType="number-pad"
                      onChangeText={setEditingStock}
                    />
                    <TouchableOpacity onPress={saveEditedStock} style={styles.iconButton}>
                      <MaterialIcons name="check" size={24} color="#38b000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEditing} style={styles.iconButton}>
                      <MaterialIcons name="close" size={24} color="#ff3b30" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.medStock}>Stock: {med.medicine_Amount}</Text>
                    <TouchableOpacity onPress={() => startEditing(med.Medicine_id, med.medicine_Amount)} style={styles.iconButton}>
                      <MaterialIcons name="edit" size={20} color="#205099" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMedicine(med.Medicine_id)} style={styles.iconButton}>
                      <MaterialIcons name="delete" size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7fa",
    paddingTop: 22,
    paddingHorizontal: 18,
  },
  sectionToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#eaf7fa",
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop:12,
    marginBottom:15,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#36b5b0",
  },
  toggleText: {
    color: "#205099",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  toggleActive: {
    backgroundColor: "#36b5b0",
    borderColor: "#2f7d80",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#205099",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#36b5b0",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  medCard: {
    backgroundColor: "#eaf7fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medName: {
    fontSize: 16,
    color: "#205099",
    fontWeight: "bold",
    flex: 1,
  },
  medStock: {
    fontSize: 15,
    color: "#36b5b0",
    marginLeft: 12,
  },
  editInput: {
    minWidth: 60,
    borderBottomWidth: 1,
    borderColor: "#205099",
    color: "#205099",
    textAlign: "center",
  },
  iconButton: {
    marginLeft: 10,
    padding: 4,
  },
});
