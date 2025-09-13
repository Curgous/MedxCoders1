import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from "react-native";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from "./supabaseClient";
// Adjust as needed

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PatientReports({ route }) {
  const {
    patient_name = "Unknown",
    age = "N/A",
    gender = "N/A",
    patient_no // Extract patient_no from route params
  } = route.params || {};
  console.log(patient_no);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      let query = supabase.from("reports").select("*").order("id", { ascending: true });

      if (patient_no) {
        query = query.eq("patient_id", patient_no);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error.message);
      } else {
        setReports(data);
      }
      setLoading(false);
    };
    fetchReports();
  }, [patient_no]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((i) => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const generateHTML = (report) => `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #205099; }
          h2 { color: #647D8F; }
          p { font-size: 14px; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .left, .right { width: 45%; }
          .left strong, .right strong { display: block; margin-bottom: 5px; color: #3a3a3a; }
        </style>
      </head>
      <body>
        <h1>${report.subject}</h1>
        <div class="header">
          <div class="left">
            <strong>Patient ID:</strong> ${report.patient_id}
            <strong>Patient Name:</strong> ${patient_name}
            <strong>Age:</strong> ${age}
            <strong>Gender:</strong> ${gender}
          </div>
          <div class="right">
            <strong>Doctor:</strong> ${report.dr_name}
            <strong>Next Consultation:</strong> ${report.next_con}
          </div>
        </div>
        <h2>Doctor's Remedy:</h2>
        <p>${report.dr_rmdy}</p>
        <h2>Prescribed Medication:</h2>
        <p>${report.pres_med}</p>
      </body>
    </html>
  `;

  const printPDF = async (report) => {
    const html = generateHTML(report);
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Patient Report',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      alert("Error generating PDF");
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Patient Reports</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#205099" />
      ) : (
        reports
          // Optionally filter out unwanted subjects here
          .filter(report => report.subject?.trim().toLowerCase() !== "you're having a heart attack")
          .map((report) => {
            const expanded = expandedIds.includes(report.id);
            return (
              <View key={report.id} style={styles.reportContainer}>
                <View style={styles.topRow}>
                  <View>
                    <Text style={styles.reportTitle}>{report.subject}</Text>
                  </View>
                  <View style={styles.rightTop}>
                    <Text style={styles.doctorName}>{report.dr_name}</Text>
                    <Text style={styles.date}>{report.next_con}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.expandButton} onPress={() => toggleExpand(report.id)}>
                  <Text style={styles.expandButtonText}>
                    {expanded ? "Hide Details" : "Show Details"}
                  </Text>
                </TouchableOpacity>
                {expanded && (
                  <>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Patient:</Text>
                      <Text style={styles.sectionText}>
                        {report.patient_id}, {patient_name}, {age} years, {gender}
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Doctor's Remedy:</Text>
                      <Text style={styles.sectionText}>{report.dr_rmdy}</Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Prescribed Medication:</Text>
                      <Text style={styles.sectionText}>{report.pres_med}</Text>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>Next Consultation:</Text>
                      <Text style={styles.sectionText}>{report.next_con}</Text>
                    </View>
                    <TouchableOpacity style={styles.downloadButton} onPress={() => printPDF(report)}>
                      <Text style={styles.downloadButtonText}>Download PDF</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#eaf7fa",
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3a4c5a",
    marginTop: 12,
  },
  reportContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#205099",
  },
  rightTop: {
    alignItems: "flex-end",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F5D62",
  },
  date: {
    fontSize: 14,
    color: "#647D8F",
  },
  section: {
    marginTop: 8,
  },
  sectionLabel: {
    fontWeight: "bold",
    color: "#3a3a3a",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: "#647D8F",
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 10,
    backgroundColor: "#36b0a6",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  expandButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  downloadButton: {
    marginTop: 12,
    backgroundColor: "#448cff",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
