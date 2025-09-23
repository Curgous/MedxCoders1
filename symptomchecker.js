import React, { useState, useContext } from 'react';

import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Image,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import { LanguageContext } from './LanguageContext';
import { GEMINI_API_KEY } from '@env'; // ✅ import from .env

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
    pa: [
        { id: 'cough', name: 'ਖੰਘ' },
        { id: 'whooping_cough', name: 'ਉੱਡਦੀ ਖੰਘ' },
        { id: 'high_temperature', name: 'ਉੱਚਾ ਤਾਪਮਾਨ' },
        { id: 'low_temperature', name: 'ਘੱਟ ਤਾਪਮਾਨ' },
        { id: 'acidity', name: 'ਤਾਜ਼ਗੀ ਦੀ ਸਮੱਸਿਆ' },
        { id: 'running_nose', name: 'ਨੱਕ ਬਹਿਣਾ' },
        { id: 'headache', name: 'ਸਿਰ ਦਰਦ' },
    ],
    hi: [
        { id: 'cough', name: 'खाँसी' },
        { id: 'whooping_cough', name: 'खांसी वाली खाँसी' },
        { id: 'high_temperature', name: 'उच्च तापमान' },
        { id: 'low_temperature', name: 'निम्न तापमान' },
        { id: 'acidity', name: 'अम्लता' },
        { id: 'running_nose', name: 'नाक बहना' },
        { id: 'headache', name: 'सिर दर्द' },
    ],
    bn: [
        { id: 'cough', name: 'কাশি' },
        { id: 'whooping_cough', name: 'হু: খুসকি' },
        { id: 'high_temperature', name: 'উচ্চ তাপমাত্রা' },
        { id: 'low_temperature', name: 'কম তাপমাত্রা' },
        { id: 'acidity', name: 'অম্লতা' },
        { id: 'running_nose', name: 'নাক বেয়ে' },
        { id: 'headache', name: 'সিরদরদ' },
    ],
    ta: [
        { id: 'cough', name: 'தும்மல்' },
        { id: 'whooping_cough', name: 'உச்சि காசி' },
        { id: 'high_temperature', name: 'உயர் வெப்பநிலை' },
        { id: 'low_temperature', name: 'குறைந்த வெப்பநிலை' },
        { id: 'acidity', name: 'அமிலப்பெருக்கு' },
        { id: 'running_nose', name: 'மூக்கு ஓடல்' },
        { id: 'headache', name: 'தலையில் வலி' },
    ],
};

// Placeholder endpoint (replace if you have your own server)
const GOOGLE_GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ✅ Function to clean and process AI response
const cleanResponse = (text) => {
    // Remove common introductory phrases
    let cleanText = text
        .replace(/^(here are|here's|okay|alright|sure|the possible|possible|based on|given|considering|with these symptoms)/i, '')
        .replace(/(illnesses|conditions|diseases|problems)(\s*(are|include|might be|could be|may be):?)/i, '')
        .replace(/^\d+[\.\)\-]\s*/gm, '') // Remove numbers like "1. " or "1) " or "1- "
        .replace(/^\*+\s*/gm, '') // Remove asterisks at start of lines
        .replace(/\*+/g, '') // Remove all asterisks
        .replace(/^[\-\•]\s*/gm, '') // Remove bullet points
        .trim();

    // Split into individual illness names
    const illnesses = cleanText
        .split(/\n|,|;/)
        .map(illness => illness.trim())
        .filter(illness => illness.length > 0)
        .filter(illness => illness.length > 2) // Remove very short strings
        .filter(illness => !illness.match(/^(and|or|also|the|a|an)$/i)) // Remove common words
        .slice(0, 5); // Maximum 5 results

    return illnesses.length >= 2 ? illnesses : illnesses; // Ensure minimum 2, but allow less if necessary
};

export default function SymptomChecker() {
    const { language, changeLanguage } = useContext(LanguageContext);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [possibleIllnesses, setPossibleIllnesses] = useState([]);
    const [originalIllnesses, setOriginalIllnesses] = useState([]); // ✅ Store original results
    const [loading, setLoading] = useState(false);
    const [translating, setTranslating] = useState(false); // ✅ Translation loading state
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [translateDropdownVisible, setTranslateDropdownVisible] = useState(false); // ✅ Translation dropdown

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
            translating: 'Translating...',
        },
        pa: {
            symptomChecker: 'ਲੱਛਣ ਚੈੱਕਰ',
            selectSymptoms: 'ਲੱਛਣ ਚੁਣੋ',
            pickSymptoms: 'ਲੱਛਣ ਚੁਣੋ',
            searchPlaceholder: 'ਲੱਛਣ ਖੋਜੋ...',
            checkIllnesses: 'ਬਿਮਾਰੀਆਂ ਚੈੱਕ ਕਰੋ',
            checking: 'ਚੈੱਕ ਕਰ ਰਹੇ ਹਾਂ...',
            possibleIllnesses: 'ਸੰਭਾਵਤ ਬਿਮਾਰੀਆਂ',
            selectAtLeastOne: 'ਕਿਰਪਾ ਕਰਕੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲੱਛਣ ਚੁਣੋ।',
            unauthorized: 'ਗਲਤ API ਕੁੰਜੀ ਜਾਂ ਅਧਿਕਾਰ ਨਹੀਂ।',
            fetchFailed: 'ਗੂਗਲ ਜੈਮਿਨੀ API ਤੋਂ ਬਿਮਾਰੀਆਂ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।',
            confirm: 'ਪੱਕਾ ਕਰੋ',
            translating: 'ਅਨੁਵਾਦ ਕਰ ਰਹੇ ਹਾਂ...',
        },
        hi: {
            symptomChecker: 'लक्षण चेकर',
            selectSymptoms: 'लक्षण चुनें',
            pickSymptoms: 'लक्षण चुनें',
            searchPlaceholder: 'लक्षण खोजें...',
            checkIllnesses: 'बीमारियाँ जाँचें',
            checking: 'जांच रहे हैं...',
            possibleIllnesses: 'संभावित बीमारियाँ',
            selectAtLeastOne: 'कृपया कम से कम एक लक्षण चुनें।',
            unauthorized: 'अमान्य API कुंजी या अनधिकृत पहुँच।',
            fetchFailed: 'गूगल जेमिनी API से बीमारियाँ प्राप्त करने में विफल।',
            confirm: 'पुष्ट करें',
            translating: 'अनुवाद कर रहे हैं...',
        },
        bn: {
            symptomChecker: 'লক্ষণ চেকার',
            selectSymptoms: 'লক্ষণ নির্বাচন করুন',
            pickSymptoms: 'লক্ষণ নির্বাচন করুন',
            searchPlaceholder: 'লক্ষণ খুঁজুন...',
            checkIllnesses: 'রোগ পরীক্ষা করুন',
            checking: 'পরীক্ষা চলছে...',
            possibleIllnesses: 'সম্ভাব্য রোগসমূহ',
            selectAtLeastOne: 'কমপক্ষে একটি লক্ষণ নির্বাচন করুন।',
            unauthorized: 'অবৈধ API কী বা অনুমোদন নেই।',
            fetchFailed: 'গুগল জেমিনি API থেকে রোগ পাওয়া যায়নি।',
            confirm: 'নিশ্চিত করুন',
            translating: 'অনুবাদ করা হচ্ছে...',
        },
        ta: {
            symptomChecker: 'அறிகுறி தேடல்',
            selectSymptoms: 'அறிகுறிகள் தேர்வு செய்யவும்',
            pickSymptoms: 'அறிகுறிகள் தேர்வு செய்யவும்',
            searchPlaceholder: 'அறிகுறிகளை தேடு...',
            checkIllnesses: 'இல்லறைகள் சரிபார்க்கவும்',
            checking: 'சரிபார்க்கப்படுகிறத...',
            possibleIllnesses: 'சாத்தியமான அல்லடைகள்',
            selectAtLeastOne: 'கனிஸம் ஒரு அறிகுறியைக் தேர்ந்தெடுக்கவும்.',
            unauthorized: 'தவறான API விசையோ உரிமையற்ற அணுகலோ.',
            fetchFailed: 'Google Gemini API-இல் இருந்து இல்லறைகள் பெற முடியவில்லை.',
            confirm: 'உறுதிப்படுத்தவும்',
            translating: 'மொழியாক்கம் செய்யப்படுகிறது...',
        },
    };

    // ✅ Language mappings for translation
    const languageNames = {
        en: 'English',
        pa: 'Punjabi',
        hi: 'Hindi',
        bn: 'Bengali',
        ta: 'Tamil',
    };

    // ✅ fallback to English if language is missing
    const t = translations[language] || translations.en;
    const symptoms = allSymptoms[language] || allSymptoms.en;

    const onSelectedItemsChange = (items) => setSelectedSymptoms(items);

    // Handle voice input for symptoms
    const handleVoiceInput = () => {
        // Placeholder for voice input functionality
        console.log('Voice input for symptoms');
        // You can implement speech-to-text here
        // For now, it's just a placeholder function
    };

    const handleCheckSymptoms = async () => {
        if (selectedSymptoms.length === 0) {
            alert(t.selectAtLeastOne);
            return;
        }
        setLoading(true);

        // ✅ Enhanced prompt for cleaner results
        const prompt = `For symptoms: ${selectedSymptoms.join(', ')}\n\nList 2-5 possible medical conditions. Provide only the condition names, one per line. No introductory text, no explanations, no numbers, no asterisks.`;

        try {
            const response = await axios.post(
                GOOGLE_GEMINI_API_ENDPOINT,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3, // ✅ Lower temperature for more focused results
                        maxOutputTokens: 100 // ✅ Reduced tokens for concise output
                    },
                }
            );

            const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const illnesses = cleanResponse(text); // ✅ Use cleaning function

            if (illnesses.length === 0) illnesses.push(t.fetchFailed);

            setPossibleIllnesses(illnesses);
            setOriginalIllnesses(illnesses); // ✅ Store original results
        } catch (error) {
            console.error('Gemini API error:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert(t.unauthorized);
            } else {
                alert(t.fetchFailed);
            }
            setPossibleIllnesses([]);
            setOriginalIllnesses([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Enhanced translation function with count preservation
    const handleTranslateResults = async (targetLanguage) => {
        if (originalIllnesses.length === 0) return;
        
        setTranslating(true);
        setTranslateDropdownVisible(false);

        const resultsText = originalIllnesses.join('\n');
        const targetLangName = languageNames[targetLanguage];
        const expectedCount = originalIllnesses.length;
        
        const translatePrompt = `Translate these medical conditions to ${targetLangName}. You must provide EXACTLY ${expectedCount} translations:

${resultsText}

Requirements:
- Provide exactly ${expectedCount} results 
- One per line
- Use ${targetLangName} language only
- For Punjabi, No English
- Keep the same medical meaning
- No numbering, no bullets, just the names`;

        try {
            const response = await axios.post(
                GOOGLE_GEMINI_API_ENDPOINT,
                {
                    contents: [{
                        parts: [{
                            text: translatePrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 150
                    },
                }
            );

            const translatedText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            let translatedResults = translatedText
                .split('\n')
                .map(line => line.replace(/^\d+[\.\)\-\:]\s*/, '').replace(/^[\*\-\•]\s*/, '').trim())
                .filter(line => line.length > 1);

            // ✅ Ensure exact count match
            if (translatedResults.length < expectedCount) {
                // Add missing results from original
                for (let i = translatedResults.length; i < expectedCount; i++) {
                    translatedResults.push(originalIllnesses[i]);
                }
            } else if (translatedResults.length > expectedCount) {
                // Trim excess results
                translatedResults = translatedResults.slice(0, expectedCount);
            }

            setPossibleIllnesses(translatedResults);
            
        } catch (error) {
            console.error('Translation error:', error);
            // ✅ Fallback to original results
            setPossibleIllnesses(originalIllnesses);
            alert('Translation failed. Showing original results.');
        } finally {
            setTranslating(false);
        }
    };

    const languageOptions = [
        { code: 'en', label: 'English' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'bn', label: 'বাংলা' },
        { code: 'ta', label: 'তমিল' },
    ];

    // ✅ Translation language options (same as above but for translation dropdown)
    const translationOptions = [
        { code: 'en', label: 'English' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'bn', label: 'বাংলা' },
        { code: 'ta', label: 'তমিল' },
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

            {/* Modified label row with mic icon next to text */}
            <View style={styles.labelRow}>
                <Text style={styles.label}>{t.selectSymptoms}</Text>
                <TouchableOpacity 
                    style={styles.micButton}
                    onPress={handleVoiceInput}
                    activeOpacity={0.7}
                >
                    <Image source={require('./assets/mic.png')} style={styles.micIcon} />
                </TouchableOpacity>
            </View>

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
                    {/* ✅ Modified results header row with translation image */}
                    <View style={styles.resultsHeaderRow}>
                        <Text style={styles.resultsHeader}>{t.possibleIllnesses}</Text>
                        <View style={styles.translationSection}>
                            <TouchableOpacity
                                onPress={() => setTranslateDropdownVisible(!translateDropdownVisible)}
                                disabled={translating}
                                activeOpacity={0.7}
                                style={styles.translateImageContainer}
                            >
                                <Image 
                                    source={require('./assets/lang.png')} 
                                    style={[
                                        styles.translateImage, 
                                        translating && styles.imageDisabled
                                    ]} 
                                />
                            </TouchableOpacity>
                            
                            {translateDropdownVisible && (
                                <View style={styles.translateDropdown}>
                                    {translationOptions.map((lang) => (
                                        <TouchableOpacity
                                            key={`translate-${lang.code}`}
                                            style={styles.dropdownItem}
                                            onPress={() => handleTranslateResults(lang.code)}
                                        >
                                            <Text style={styles.dropdownText}>{lang.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>

                    <FlatList
                        data={possibleIllnesses}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => <Text style={styles.resultItem}>• {item}</Text>}
                    />
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
    // Updated styles for label row with mic button next to text
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#205099',
    },
    micButton: {
        padding: 6,
        backgroundColor: '#36b5b0',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    micIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#fff',
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
    // ✅ Modified results header row styling
    resultsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3a4d5c',
        flex: 1, // ✅ Takes remaining space
    },
    resultItem: {
        fontSize: 16,
        color: '#434c59',
        marginBottom: 6,
    },
    // ✅ Updated translation styles
    translationSection: {
        position: 'relative',
    },
    translateImageContainer: {
        padding: 4, // ✅ Small padding for better touch area
    },
    translateImage: {
        width: 65, // ✅ Slightly larger for better visibility
        height: 40,
        resizeMode: 'contain',
    },
    imageDisabled: {
        opacity: 0.5, // ✅ Show disabled state when translating
    },
    translateDropdown: {
        position: 'absolute',
        bottom: 35, // ✅ Positioned above the image
        right: 0, // ✅ Aligned to the right edge
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
        zIndex: 999,
    },
});
