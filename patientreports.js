import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PatientReports({ route }) {
  const { patient_name = "Unknown", age = "N/A", gender = "N/A" } =
    route.params || {};

  // Sample reports with added titles for each
  const reports = [
    {
      id: "1",
      title: "Headache Remedy",
      remedy: "Stay hydrated and rest well. Avoid heavy meals.",
      medication: "Paracetamol 500mg - 3 times a day for 5 days",
      nextConsultation: "2025-09-14",
    },
    {
      id: "2",
      title: "Asthma Follow-up",
      remedy: "Practice breathing exercises. Avoid exposure to dust.",
      medication: "Salbutamol inhaler - as needed",
      nextConsultation: "2025-09-20",
    },
    {
      id: "3",
      title: "Monthly Checkup",
      remedy: "Maintain a balanced diet and monitor sugar levels.",
      medication: "Metformin 500mg - twice daily",
      nextConsultation: "2025-10-01",
    },
  ];

  const [expandedIds, setExpandedIds] = useState([]);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((i) => i !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  // Generate HTML content for PDF
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
        <h1>${report.title}</h1>
        <div class="header">
          <div class="left">
            <strong>Patient Name:</strong> ${patient_name}
            <strong>Age:</strong> ${age}
            <strong>Gender:</strong> ${gender}
          </div>
          <div class="right">
            <strong>Doctor:</strong> Dr. Vickram
            <strong>Date:</strong> 07/09/2025
          </div>
        </div>
        <h2>Doctor's Remedy:</h2>
        <p>${report.remedy}</p>
        <h2>Prescribed Medication:</h2>
        <p>${report.medication}</p>
        <h2>Next Consultation:</h2>
        <p>${report.nextConsultation}</p>
      </body>
    </html>
  `;

  // Print or Save as PDF
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

      {reports.map((report) => {
        const expanded = expandedIds.includes(report.id);
        return (
          <View key={report.id} style={styles.reportContainer}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.reportTitle}>{report.title}</Text>
              </View>
              <View style={styles.rightTop}>
                <Text style={styles.doctorName}>Dr. Vickram</Text>
                <Text style={styles.date}>07/09/2025</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => toggleExpand(report.id)}
            >
              <Text style={styles.expandButtonText}>{expanded ? "Hide Details" : "Show Details"}</Text>
            </TouchableOpacity>

            {expanded && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Patient:</Text>
                  <Text style={styles.sectionText}>
                    {report.patientName ?? patient_name}, {age} years, {gender}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Doctor's Remedy:</Text>
                  <Text style={styles.sectionText}>{report.remedy}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Prescribed Medication:</Text>
                  <Text style={styles.sectionText}>{report.medication}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Next Consultation:</Text>
                  <Text style={styles.sectionText}>{report.nextConsultation}</Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => printPDF(report)}
                >
                  <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      })}
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
    marginTop:12,
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
