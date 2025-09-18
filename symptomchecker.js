import React, { useState, useContext, useRef } from 'react';
import { Platform, Alert, View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import { LanguageContext } from './LanguageContext';
import { GEMINI_API_KEY } from '@env';
import Tts from 'react-native-tts'; // Import TTS

// Voice input handler (same as your code)
/*
const useVoiceInput = (onResult) => {
  const recognizing = useRef(false);
  const startVoice = () => {
    if (Platform.OS === 'web') {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
      }
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      recognition.onerror = () => alert('Voice recognition error.');
      recognition.start();
    } else if (Voice) {
      Voice.onSpeechResults = (e) => {
        if (e.value && e.value.length > 0) onResult(e.value[0]);
      };
      Voice.start('en-US');
    } else {
      Alert.alert('Voice recognition not available.');
    }
  };
  return startVoice;
};
*/
// the next part of the code is edited ------------------------------------------------
const useVoiceInput = (onResult) => {
  const recognizing = useRef(false);
  const startVoice = () => {
    if (Platform.OS === 'web') {
      if (!('webkitSpeechRecognition' in window)) {
        console.error('Voice recognition not supported in this browser.');
        return;
      }
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Web Speech API error:', event.error, event);
      };
      recognition.start();
    } else if (Voice) {
      Voice.onSpeechResults = (e) => {
        if (e.value && e.value.length > 0) onResult(e.value[0]);
      };
      Voice.onSpeechError = (e) => {
        console.error('React Native Voice error:', e);
      };
      Voice.start('en-US');
    } else {
      console.error('Voice recognition not available on this platform.');
    }
  };
  return startVoice;
};

const allSymptoms = {
  en: [
    { id: 'cough', name: 'Cough' },
    { id: 'whooping_cough', name: 'Whooping cough' },
    { id: 'high_temperature', name: 'High temperature' },
    { id: 'low_temperature', name: 'Low temperature' },
    { id: 'acidity', name: 'Acidity' },
    { id: 'running_nose', name: 'Running nose' },
    { id: 'headache', name: 'Headache' },
  ],
  // add other languages...
};

const GOOGLE_GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function SymptomChecker() {
  const { language, changeLanguage } = useContext(LanguageContext);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [voiceInput, setVoiceInput] = useState('');
  const startVoice = useVoiceInput((text) => setVoiceInput(text));
  const [possibleIllnesses, setPossibleIllnesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const translations = {
    en: {
      symptomChecker: 'Symptom checker',
      selectSymptoms: 'Select symptoms',
      pickSymptoms: 'Pick Symptoms',
      searchPlaceholder: 'Search Symptoms...',
      checkIllnesses: 'Check Illnesses',
      checking: 'Checking...',
      possibleIllnesses: 'Possible Illnesses',
      selectAtLeastOne: 'Please select at least one symptom to check.',
      unauthorized: 'Invalid API key or unauthorized access.',
      fetchFailed: 'Failed to fetch illnesses from Google Gemini API.',
      confirm: 'Confirm',
      listenIllnesses: 'Listen to Illnesses',
    },
    // other language translations...
  };

  const t = translations[language] || translations.en;
  const symptoms = allSymptoms[language] || allSymptoms.en;

  const onSelectedItemsChange = (items) => setSelectedSymptoms(items);

  const handleVoiceToSymptoms = () => {
    if (!voiceInput) return;
    const matches = symptoms.filter(s => voiceInput.toLowerCase().includes(s.name.toLowerCase()));
    if (matches.length > 0) {
      setSelectedSymptoms([...new Set([...selectedSymptoms, ...matches.map(m => m.id)])]);
      setVoiceInput('');
    } else {
      alert('No matching symptoms found in voice input.');
    }
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert(t.selectAtLeastOne);
      return;
    }
    setLoading(true);
    const prompt = `please dont use symbols or "*" in the reply. List 3 possible illnesses for symptoms only also keep it brief : ${selectedSymptoms.join(', ')}. Provide a brief list. `;
    try {
      const response = await axios.post(
        GOOGLE_GEMINI_API_ENDPOINT,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 150 },
        }
      );
      const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const illnesses = text.split(/\n|,/).map((ill) => ill.trim()).filter((ill) => ill.length > 0);
      if (illnesses.length === 0) illnesses.push(t.fetchFailed);
      setPossibleIllnesses(illnesses);
    } catch (error) {
      console.error('Gemini API error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        alert(t.unauthorized);
      } else {
        alert(t.fetchFailed);
      }
      setPossibleIllnesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Updated function to handle TTS for both platforms
  const speakIllnesses = () => {
    if (possibleIllnesses.length === 0) {
      alert('No illnesses to read.');
      return;
    }

    // Clean up text by removing all asterisks and other unwanted symbols from anywhere in the text
    const cleanedIllnesses = possibleIllnesses.map(illness => 
      illness.replace(/\*/g, '')  // Remove all asterisks
            .replace(/[•]/g, '')  // Remove bullet points
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim()               // Remove leading/trailing whitespace
    ).filter(illness => illness.length > 0);

    const textToSpeak = cleanedIllnesses.join(', ');

    if (Platform.OS === 'web') {
      // Use Web Speech API for web platform
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.8; // Slightly slower for better comprehension
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text-to-speech not supported in this browser.');
      }
    } else {
      // Use react-native-tts for mobile platforms
      Tts.stop(); // Stop any ongoing speech
      Tts.speak(textToSpeak);
    }
  };

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t.symptomChecker}</Text>
        <View>
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
            activeOpacity={0.7}
          >
            <Image source={require('./assets/lang.png')} style={styles.langImage} />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.dropdownItem}
                  onPress={() => {
                    changeLanguage(lang.code);
                    setDropdownVisible(false);
                    setSelectedSymptoms([]);
                  }}
                >
                  <Text style={styles.dropdownText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <Text style={styles.label}>{t.selectSymptoms}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity
          onPress={startVoice}
          style={{ marginRight: 10, backgroundColor: '#36b5b0', borderRadius: 20, padding: 10 }}
        >
          <Image source={require('./assets/call.png')} style={{ width: 24, height: 24, tintColor: '#fff' }} />
        </TouchableOpacity>
        <Text style={{ color: '#205099' }}>Tap mic and speak symptoms</Text>
      </View>

      {voiceInput ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#205099', flex: 1 }}>Heard: {voiceInput}</Text>
          <TouchableOpacity
            onPress={handleVoiceToSymptoms}
            style={{ backgroundColor: '#4285F4', borderRadius: 8, padding: 8, marginLeft: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <MultiSelect
        items={symptoms}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedSymptoms}
        selectText={t.pickSymptoms}
        searchInputPlaceholderText={t.searchPlaceholder}
        tagRemoveIconColor="#36b5b0"
        tagBorderColor="#36b5b0"
        tagTextColor="#36b5b0"
        selectedItemTextColor="#205099"
        selectedItemIconColor="#205099"
        itemTextColor="#434c59"
        displayKey="name"
        searchInputStyle={{ color: '#205099' }}
        submitButtonColor="#36b5b0"
        submitButtonText={t.confirm}
        hideDropdown={false}
      />

      <TouchableOpacity
        style={[styles.checkButton, loading && styles.buttonDisabled]}
        onPress={handleCheckSymptoms}
        disabled={loading}
      >
        <Text style={styles.checkButtonText}>{loading ? t.checking : t.checkIllnesses}</Text>
      </TouchableOpacity>

      {possibleIllnesses.length > 0 && !loading && (
        <>
          <Text style={styles.resultsHeader}>{t.possibleIllnesses}</Text>
          <FlatList
            data={possibleIllnesses}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <Text style={styles.resultItem}>
                • {item}
              </Text>
            )}
          />
          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: '#557ec3' }]}
            onPress={speakIllnesses}
          >
            <Text style={styles.checkButtonText}>{t.listenIllnesses}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#eaf7fa',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a4d5c',
  },
  langButton: {
    backgroundColor: '#d3d3d3',
    padding: 6,
    borderRadius: 6,
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  langImage: {
    width: 60,
    height: 34,
    resizeMode: 'contain',
  },
  dropdown: {
    position: 'absolute',
    top: 42,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 140,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 16,
    color: '#205099',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 8,
  },
  checkButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7ac4c1',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a4d5c',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 16,
    color: '#434c59',
    marginBottom: 6,
  },
});