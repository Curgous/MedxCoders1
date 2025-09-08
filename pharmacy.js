import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext'; // Import global language context

const STORAGE_KEY = '@demanded_medicines';

const translations = {
    en: {
        medicineChecker: "Medicine Checker",
        searchPlaceholder: "Search medicines...",
        demandedMedicines: "Demanded Medicine(s)",
        medicineRequest: "Medicine Request",
        requestAccepted: "Medicine request accepted",
        duplicateNotice: "is already in the demanded medicines list.",
        removeTitle: "Remove Medicine",
        removeConfirm: "Are you sure you want to remove",
        removed: "has been removed from demanded medicines.",
        cancel: "Cancel",
        remove: "Remove",
    },
    pa: {
        medicineChecker: "ਦਵਾਈ ਚੈਕਰ",
        searchPlaceholder: "ਦਵਾਈਆਂ ਖੋਜੋ...",
        demandedMedicines: "ਮੰਗੀਆਂ ਦਵਾਈਆਂ",
        medicineRequest: "ਦਵਾਈ ਬੇਨਤੀ",
        requestAccepted: "ਦਵਾਈ ਬੇਨਤੀ ਸਵੀਕਾਰ ਕੀਤੀ ਗਈ",
        duplicateNotice: "ਪਹਿਲਾਂ ਹੀ ਮੰਗੀਆਂ ਦਵਾਈਆਂ ਦੀ ਸੂਚੀ ਵਿੱਚ ਹੈ।",
        removeTitle: "ਦਵਾਈ ਹਟਾਓ",
        removeConfirm: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ",
        removed: "ਮੰਗੀਆਂ ਦਵਾਈਆਂ ਵਿੱਚੋਂ ਹਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
        cancel: "ਰੱਦ ਕਰੋ",
        remove: "ਹਟਾਓ",
    },
    hi: {
        medicineChecker: "मेडिसिन चेकर",
        searchPlaceholder: "दवाइयां खोजें...",
        demandedMedicines: "मांगी गई दवाइयां",
        medicineRequest: "दवा अनुरोध",
        requestAccepted: "दवा अनुरोध स्वीकार किया गया",
        duplicateNotice: "पहले से ही मांगी गई दवाइयों में है।",
        removeTitle: "दवा हटाएं",
        removeConfirm: "क्या आप वाकई हटाना चाहते हैं",
        removed: "मांगी गई दवाइयों से हटा दिया गया है।",
        cancel: "रद्द करें",
        remove: "हटाएं",
    },
    bn: {
        medicineChecker: "মেডিসিন চেকার",
        searchPlaceholder: "মাদকের সন্ধান করুন...",
        demandedMedicines: "চাহিদার ঔষধসমূহ",
        medicineRequest: "ঔষধের অনুরোধ",
        requestAccepted: "ঔষধের অনুরোধ গৃহীত হয়েছে",
        duplicateNotice: "ইতিমধ্যে চাহিদার ঔষধ তালিকায় রয়েছে।",
        removeTitle: "ঔষধ সরান",
        removeConfirm: "আপনি কি নিশ্চিতভাবে সরাতে চান",
        removed: "চাহিদার ঔষধসমূহ থেকে সরানো হয়েছে।",
        cancel: "বাতিল করুন",
        remove: "সরান",
    },
    ta: {
        medicineChecker: "மருந்து தேடல்",
        searchPlaceholder: "மருந்துகளை தேடு...",
        demandedMedicines: "வாங்கிய மருந்துகள்",
        medicineRequest: "மருந்து கோரிக்கை",
        requestAccepted: "மருந்து கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது",
        duplicateNotice: "ஏற்கனவே வாங்கிய மருந்துகளில் உள்ளது.",
        removeTitle: "மருந்தை நீக்கு",
        removeConfirm: "நீங்கள் உண்மையிலேயே நீக்க விரும்புகிறீர்களா",
        removed: "வாங்கிய மருந்துகளிலிருந்து நீக்கப்பட்டது.",
        cancel: "ரத்து செய்",
        remove: "நீக்கு",
    },
};

export default function Pharmacy() {
    const { language, changeLanguage } = useContext(LanguageContext); // Use language from context
    const [searchText, setSearchText] = useState('');
    const [demandedMedicines, setDemandedMedicines] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const t = translations[language];

    useEffect(() => {
        async function loadMedicines() {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonValue != null) setDemandedMedicines(JSON.parse(jsonValue));
            } catch (e) {
                console.error('Failed to load demanded medicines', e);
            }
        }
        loadMedicines();
    }, []);

    const saveMedicines = async (medicines) => {
        try {
            const jsonValue = JSON.stringify(medicines);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Failed to save demanded medicines', e);
        }
    };

    const handleBookmarkPress = () => {
        if (searchText.trim() === '') return;

        if (demandedMedicines.includes(searchText.trim())) {
            Alert.alert(t.medicineRequest, `"${searchText}"\n\n${t.duplicateNotice}`);
            return;
        }

        const updatedMedicines = [...demandedMedicines, searchText.trim()];
        setDemandedMedicines(updatedMedicines);
        saveMedicines(updatedMedicines);

        Alert.alert(t.medicineRequest, `"${searchText}"\n\n${t.requestAccepted}`);
        setSearchText('');
    };

    const handleRemoveMedicine = (item) => {
        Alert.alert(
            t.removeTitle,
            `${t.removeConfirm} "${item}"?`,
            [
                { text: t.cancel, style: 'cancel' },
                {
                    text: t.remove,
                    style: 'destructive',
                    onPress: () => {
                        const filtered = demandedMedicines.filter(med => med !== item);
                        setDemandedMedicines(filtered);
                        saveMedicines(filtered);
                        Alert.alert(t.removeTitle, `"${item}" ${t.removed}`);
                    },
                },
            ],
        );
    };

    const renderMedicine = ({ item }) => (
        <View style={styles.demandedContainer}>
            <Text style={styles.demandedText}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveMedicine(item)} style={styles.removeIcon}>
                <MaterialCommunityIcons name="bookmark-remove-outline" size={28} color="#d9534f" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header with title and lang button */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>{t.medicineChecker}</Text>
                <TouchableOpacity
                    style={styles.langButton}
                    onPress={() => setDropdownVisible(true)}
                    activeOpacity={0.7}
                >
                    <Image source={require('./assets/lang.png')} style={styles.langImage} />
                </TouchableOpacity>
            </View>

            {/* Language dropdown */}
            <Modal
                visible={dropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => { changeLanguage('en'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { changeLanguage('pa'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>ਪੰਜਾਬੀ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { changeLanguage('hi'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>हिन्दी</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { changeLanguage('bn'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>বাংলা</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { changeLanguage('ta'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text style={styles.dropdownText}>தமிழ்</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <TextInput
                style={styles.searchBar}
                placeholder={t.searchPlaceholder}
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
            />
            {searchText.trim() !== '' && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{searchText}</Text>
                    <TouchableOpacity
                        style={styles.bookmarkIcon}
                        onPress={handleBookmarkPress}
                    >
                        <MaterialCommunityIcons name="bookmark-outline" size={28} color="#36b5b0" />
                    </TouchableOpacity>
                </View>
            )}

            {demandedMedicines.length > 0 && (
                <>
                    <Text style={styles.heading}>{t.demandedMedicines}</Text>
                    <FlatList
                        data={demandedMedicines}
                        keyExtractor={(item, index) => item + index}
                        renderItem={renderMedicine}
                        style={styles.list}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#eaf7fa',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    headerText: {
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 60,
        marginRight: 20,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        elevation: 8,
    },
    dropdownItem: {
        paddingVertical: 6,
    },
    dropdownText: {
        fontSize: 16,
        color: '#205099',
    },
    searchBar: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        borderColor: '#6499a1',
        borderWidth: 1,
        color: '#333',
    },
    resultContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        position: 'relative',
        minHeight: 60,
        justifyContent: 'center',
    },
    resultText: {
        fontSize: 16,
        color: '#205099',
    },
    bookmarkIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
        color: '#3a4d5c',
    },
    list: {
        maxHeight: 200,
    },
    demandedContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#6499a1',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    demandedText: {
        fontSize: 16,
        color: '#205099',
        flex: 1,
    },
    removeIcon: {
        marginLeft: 10,
    },
});
