import React, { useState, useContext, useRef } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import { LanguageContext } from './LanguageContext';
import { GEMINI_API_KEY } from '@env';
import Tts from 'react-native-tts';

// ✅ Enhanced Web Speech Hook with retry, visual feedback, and error handling
const useVoiceInput = (onResult, symptoms, setSelectedSymptoms, setIsListening) => {
  const recognitionRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 1;

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      Alert.alert(
        'Browser Not Supported',
        'Please use Chrome or Edge for voice input. Safari has limited support.'
      );
      return;
    }

    // Stop any previous session
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎙️ Speech recognition started');
      retryCountRef.current = 0;
      setIsListening(true);
      Alert.alert('🎤 Listening', 'Speak clearly now (e.g., “headache and cough”)', [
        { text: 'OK', style: 'default' },
      ]);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);

      setTimeout(() => {
        const matches = symptoms.filter((s) =>
          transcript.toLowerCase().includes(s.name.toLowerCase())
        );
        if (matches.length > 0) {
          setSelectedSymptoms((prev) => [
            ...new Set([...prev, ...matches.map((m) => m.id)]),
          ]);
          Alert.alert('✅ Success', `Added: ${matches.map((m) => m.name).join(', ')}`);
        } else {
          Alert.alert(
            '🔍 No Match',
            'Try saying symptoms like: “cough”, “headache”, or “fever and running nose”'
          );
        }
      }, 100);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'no-speech') {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          Alert.alert(
            '🔇 No Speech Detected',
            'Let’s try again. Speak clearly right after tapping OK.',
            [
              {
                text: 'Retry',
                onPress: () => {
                  recognition.stop();
                  setTimeout(() => startVoice(), 500);
                },
                style: 'default',
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert(
            '🔇 Still No Speech',
            'Please check:\n• Microphone is not muted\n• You’re speaking clearly\n• Background noise is low\n• Use Chrome/Edge',
            [{ text: 'OK' }]
          );
        }
      } else if (event.error === 'audio-capture') {
        Alert.alert(
          '🎤 Microphone Access Denied',
          'Click the 🔒 lock icon in the browser’s address bar and set Microphone to “Allow”. Then refresh and try again.'
        );
      } else {
        Alert.alert('❌ Error', `Speech failed: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      console.log('🎙️ Speech recognition ended');
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      setIsListening(false);
      Alert.alert('❌ Mic Error', 'Failed to access microphone. Please refresh and try again.');
      console.error('Recognition start error:', err);
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
    { id: 'sore_throat', name: 'Sore throat' },
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'nausea', name: 'Nausea' },
  ],
  // Add other languages here as needed
};

const GOOGLE_GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function SymptomChecker() {
  const { language, changeLanguage } = useContext(LanguageContext);

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [voiceInput, setVoiceInput] = useState('');
  const [possibleIllnesses, setPossibleIllnesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isListening, setIsListening] = useState(false); // 🎙️ Visual feedback

  const startVoice = useVoiceInput(
    setVoiceInput,
    allSymptoms[language] || allSymptoms.en,
    setSelectedSymptoms,
    setIsListening
  );

  const translations = {
    en: {
      symptomChecker: 'Symptom Checker',
      selectSymptoms: 'Select Symptoms',
      pickSymptoms: 'Pick Symptoms',
      searchPlaceholder: 'Search Symptoms...',
      checkIllnesses: 'Check Illnesses',
      checking: 'Checking...',
      possibleIllnesses: 'Possible Illnesses',
      selectAtLeastOne: 'Please select at least one symptom to check.',
      unauthorized: 'Invalid API key or unauthorized access.',
      fetchFailed: 'Failed to fetch illnesses. Please try again.',
      confirm: 'Confirm',
      listenIllnesses: 'Listen to Illnesses',
    },
    // Add translations for other languages here
  };

  const t = translations[language] || translations.en;
  const symptoms = allSymptoms[language] || allSymptoms.en;

  const onSelectedItemsChange = (items) => setSelectedSymptoms(items);

  const handleVoiceToSymptoms = () => {
    if (!voiceInput) return;
    const matches = symptoms.filter((s) =>
      voiceInput.toLowerCase().includes(s.name.toLowerCase())
    );
    if (matches.length > 0) {
      setSelectedSymptoms([
        ...new Set([...selectedSymptoms, ...matches.map((m) => m.id)]),
      ]);
      setVoiceInput('');
      Alert.alert('✅ Added', `Symptoms: ${matches.map((m) => m.name).join(', ')}`);
    } else {
      Alert.alert('❌ No Match', 'Try saying: “headache”, “fever”, etc.');
    }
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('⚠️ Warning', t.selectAtLeastOne);
      return;
    }
    setLoading(true);

    const symptomNames = selectedSymptoms
      .map((id) => symptoms.find((s) => s.id === id)?.name || id)
      .join(', ');

    const prompt = `Please list 3 possible illnesses for these symptoms: ${symptomNames}. Keep it brief. Do not use markdown, bullets, or asterisks.`;

    try {
      const response = await axios.post(GOOGLE_GEMINI_API_ENDPOINT, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 150 },
      });

      let text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      text = text
        .replace(/\*/g, '')
        .replace(/[•\-–—]/g, '')
        .replace(/\d+\./g, '')
        .replace(/\n+/g, ' ')
        .trim();

      const illnesses = text
        .split(/[,.\n]/)
        .map((ill) => ill.trim())
        .filter((ill) => ill.length > 0);

      if (illnesses.length === 0) illnesses.push(t.fetchFailed);
      setPossibleIllnesses(illnesses);
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('🔑 Error', t.unauthorized);
      } else {
        Alert.alert('🌐 Error', t.fetchFailed);
      }
      setPossibleIllnesses([]);
    } finally {
      setLoading(false);
    }
  };

  const speakIllnesses = () => {
    if (possibleIllnesses.length === 0) {
      Alert.alert('ℹ️ Info', 'No illnesses to read.');
      return;
    }

    const cleanedIllnesses = possibleIllnesses
      .map((illness) =>
        illness
          .replace(/\*/g, '')
          .replace(/[•\-–—\d+\.]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter((illness) => illness.length > 0);

    const textToSpeak = cleanedIllnesses.join(', ');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('🔊 Error', 'Text-to-speech not supported in this browser.');
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

      <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
        <TouchableOpacity
          onPress={startVoice}
          style={styles.micButton}
          disabled={isListening}
        >
          <Image
            source={require('./assets/call.png')}
            style={styles.micIcon}
          />
          <Text style={styles.micLabel}>
            {isListening ? 'Listening...' : 'Tap to Speak Symptoms'}
          </Text>
        </TouchableOpacity>

        {isListening && (
          <View style={styles.listeningContainer}>
            <View style={styles.pulseCircle} />
            <Text style={styles.listeningText}>Speak clearly now...</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '🎤 Mic Troubleshooting',
              'If mic is not working:\n1. Click the 🔒 lock icon in browser address bar\n2. Set Microphone to “Allow”\n3. Refresh page and try again\n\n💡 Use Chrome or Edge for best results.',
              [{ text: 'OK' }]
            );
          }}
          style={{ marginTop: 8 }}
        >
          <Text style={styles.helpLink}>Mic not working? Click here</Text>
        </TouchableOpacity>
      </View>

      {voiceInput ? (
        <View style={styles.voiceInputRow}>
          <Text style={styles.heardLabel}>
            Heard: <Text style={styles.heardText}>{voiceInput}</Text>
          </Text>
          <TouchableOpacity
            onPress={handleVoiceToSymptoms}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add</Text>
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
        <Text style={styles.checkButtonText}>
          {loading ? t.checking : t.checkIllnesses}
        </Text>
      </TouchableOpacity>

      {possibleIllnesses.length > 0 && !loading && (
        <>
          <Text style={styles.resultsHeader}>{t.possibleIllnesses}</Text>
          <FlatList
            data={possibleIllnesses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.resultItem}>• {item}</Text>
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
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 18,
  },
  header: {
    fontSize: 28,
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: 160,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#205099',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 12,
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36b5b0',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  micIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 10,
  },
  micLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  pulseCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e74c3c',
    marginRight: 8,
  },
  listeningText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  helpLink: {
    color: '#4285F4',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  voiceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  heardLabel: {
    color: '#205099',
    fontSize: 14,
    flex: 1,
  },
  heardText: {
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#7ac4c1',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a4d5c',
    marginBottom: 12,
    marginTop: 20,
  },
  resultItem: {
    fontSize: 16,
    color: '#434c59',
    marginBottom: 8,
    lineHeight: 24,
    paddingLeft: 4,
  },
});