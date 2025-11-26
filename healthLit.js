import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Linking,
    Alert,
    Image,
} from 'react-native';
import { LanguageContext } from './LanguageContext';

// ✅ Complete document translations for English only
const documentTranslations = {
    en: {
        categories: {
            'Mental Health': 'Mental Health',
            'Nutrition': 'Nutrition',
            'Fitness': 'Fitness',
            'Prevention': 'Prevention',
            'Women\'s Health': 'Women\'s Health',
            'Children\'s Health': 'Children\'s Health',
            'Chronic Diseases': 'Chronic Diseases',
            'Emergency Care': 'Emergency Care',
            'Elderly Care': 'Elderly Care',
            'Infectious Diseases': 'Infectious Diseases'
        },
        documents: {
            1: {
                title: 'Understanding Depression and Anxiety',
                description: 'Learn about symptoms, causes, and treatment options for mental health conditions'
            },
            2: {
                title: 'Stress Management Techniques',
                description: 'Effective strategies to manage and reduce stress in daily life'
            },
            3: {
                title: 'Sleep Hygiene Guide',
                description: 'Tips for better sleep quality and healthy sleep habits'
            },
            4: {
                title: 'Balanced Diet Guidelines',
                description: 'WHO recommendations for healthy eating and nutrition'
            },
            5: {
                title: 'Diabetes Diet Management',
                description: 'Dietary guidelines for managing diabetes effectively'
            },
            6: {
                title: 'Heart-Healthy Eating',
                description: 'Foods and diet plans to maintain cardiovascular health'
            },
            7: {
                title: 'Physical Activity Guidelines',
                description: 'WHO recommendations for daily physical activity'
            },
            8: {
                title: 'Home Workout Routines',
                description: 'Effective exercises you can do at home without equipment'
            },
            9: {
                title: 'Yoga for Beginners',
                description: 'Introduction to yoga poses and breathing techniques'
            },
            10: {
                title: 'Vaccination Schedule',
                description: 'Essential vaccines for children and adults'
            },
            11: {
                title: 'Cancer Prevention Guidelines',
                description: 'Lifestyle changes to reduce cancer risk'
            },
            12: {
                title: 'Regular Health Checkups',
                description: 'Importance of routine medical examinations'
            },
            13: {
                title: 'Pregnancy Care Guidelines',
                description: 'Essential care during pregnancy and prenatal health'
            },
            14: {
                title: 'Breast Health Awareness',
                description: 'Breast cancer prevention and self-examination'
            },
            15: {
                title: 'Menopause Management',
                description: 'Understanding and managing menopause symptoms'
            },
            16: {
                title: 'Child Development Milestones',
                description: 'Physical and mental development stages in children'
            },
            17: {
                title: 'Childhood Nutrition Guide',
                description: 'Nutritional needs for growing children'
            },
            18: {
                title: 'Common Childhood Illnesses',
                description: 'Recognition and management of common pediatric conditions'
            },
            19: {
                title: 'Hypertension Management',
                description: 'Managing high blood pressure through lifestyle and medication'
            },
            20: {
                title: 'Asthma Care Plan',
                description: 'Managing asthma symptoms and triggers'
            },
            21: {
                title: 'Arthritis Management',
                description: 'Living with arthritis and joint pain management'
            },
            22: {
                title: 'First Aid Basics',
                description: 'Essential first aid skills everyone should know'
            },
            23: {
                title: 'CPR Guidelines',
                description: 'Life-saving cardiopulmonary resuscitation techniques'
            },
            24: {
                title: 'Emergency Contact Information',
                description: 'Important numbers and when to call for help'
            },
            25: {
                title: 'Healthy Aging Guidelines',
                description: 'Maintaining health and independence in older adults'
            },
            26: {
                title: 'Fall Prevention',
                description: 'Reducing fall risk in elderly individuals'
            },
            27: {
                title: 'Medication Management',
                description: 'Safe medication practices for seniors'
            },
            28: {
                title: 'COVID-19 Prevention',
                description: 'Guidelines for preventing coronavirus transmission'
            },
            29: {
                title: 'Hand Hygiene Guidelines',
                description: 'Proper handwashing techniques to prevent infections'
            },
            30: {
                title: 'Tuberculosis Awareness',
                description: 'Understanding TB symptoms, prevention, and treatment'
            }
        }
    }
};

const healthDocuments = [
    // Mental Health & Wellness
    {
        id: 1,
        category: 'Mental Health',
        url: 'https://www.who.int/news-room/fact-sheets/detail/depression',
        icon: '🧠',
    },
    {
        id: 2,
        category: 'Mental Health',
        url: 'https://www.mayoclinic.org/healthy-living/stress-management/in-depth/stress/art-20046037',
        icon: '🧘‍♀️',
    },
    {
        id: 3,
        category: 'Mental Health',
        url: 'https://www.sleepfoundation.org/how-sleep-works/sleep-hygiene',
        icon: '😴',
    },

    // Nutrition & Diet
    {
        id: 4,
        category: 'Nutrition',
        url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
        icon: '🥗',
    },
    {
        id: 5,
        category: 'Nutrition',
        url: 'https://www.diabetes.org/healthy-living/recipes-nutrition/eating-well',
        icon: '🍎',
    },
    {
        id: 6,
        category: 'Nutrition',
        url: 'https://www.heart.org/en/healthy-living/healthy-eating',
        icon: '❤️',
    },

    // Exercise & Fitness
    {
        id: 7,
        category: 'Fitness',
        url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
        icon: '🏃‍♂️',
    },
    {
        id: 8,
        category: 'Fitness',
        url: 'https://www.nhs.uk/live-well/exercise/exercise-health-benefits/',
        icon: '💪',
    },
    {
        id: 9,
        category: 'Fitness',
        url: 'https://www.yogajournal.com/poses/yoga-for-beginners',
        icon: '🧘‍♂️',
    },

    // Preventive Care
    {
        id: 10,
        category: 'Prevention',
        url: 'https://www.who.int/news-room/fact-sheets/detail/immunization-coverage',
        icon: '💉',
    },
    {
        id: 11,
        category: 'Prevention',
        url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
        icon: '🎗️',
    },
    {
        id: 12,
        category: 'Prevention',
        url: 'https://www.mayoclinic.org/healthy-living/adult-health/in-depth/health-checkup/art-20044699',
        icon: '🏥',
    },

    // Women's Health
    {
        id: 13,
        category: 'Women\'s Health',
        url: 'https://www.who.int/news-room/fact-sheets/detail/maternal-mortality',
        icon: '🤱',
    },
    {
        id: 14,
        category: 'Women\'s Health',
        url: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
        icon: '🎀',
    },
    {
        id: 15,
        category: 'Women\'s Health',
        url: 'https://www.mayoclinic.org/diseases-conditions/menopause/symptoms-causes/syc-20353397',
        icon: '🌸',
    },

    // Children's Health
    {
        id: 16,
        category: 'Children\'s Health',
        url: 'https://www.who.int/news-room/fact-sheets/detail/child-development',
        icon: '👶',
    },
    {
        id: 17,
        category: 'Children\'s Health',
        url: 'https://www.who.int/news-room/fact-sheets/detail/malnutrition',
        icon: '🍼',
    },
    {
        id: 18,
        category: 'Children\'s Health',
        url: 'https://www.mayoclinic.org/diseases-conditions/childhood-illnesses/symptoms-causes/syc-20351671',
        icon: '🧸',
    },

    // Chronic Disease Management
    {
        id: 19,
        category: 'Chronic Diseases',
        url: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
        icon: '🩺',
    },
    {
        id: 20,
        category: 'Chronic Diseases',
        url: 'https://www.mayoclinic.org/diseases-conditions/asthma/symptoms-causes/syc-20369653',
        icon: '💨',
    },
    {
        id: 21,
        category: 'Chronic Diseases',
        url: 'https://www.who.int/news-room/fact-sheets/detail/musculoskeletal-conditions',
        icon: '🦴',
    },

    // Emergency Care
    {
        id: 22,
        category: 'Emergency Care',
        url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/first-aid-steps',
        icon: '🚑',
    },
    {
        id: 23,
        category: 'Emergency Care',
        url: 'https://www.heart.org/en/health-topics/cardiac-arrest/about-cardiac-arrest/cpr-facts-and-stats',
        icon: '❤️‍🩹',
    },
    {
        id: 24,
        category: 'Emergency Care',
        url: 'https://www.ready.gov/be-informed',
        icon: '📞',
    },

    // Elderly Care
    {
        id: 25,
        category: 'Elderly Care',
        url: 'https://www.who.int/news-room/fact-sheets/detail/ageing-and-health',
        icon: '👴',
    },
    {
        id: 26,
        category: 'Elderly Care',
        url: 'https://www.mayoclinic.org/healthy-living/healthy-aging/in-depth/fall-prevention/art-20047358',
        icon: '🦯',
    },
    {
        id: 27,
        category: 'Elderly Care',
        url: 'https://www.nia.nih.gov/health/taking-medicines-safely',
        icon: '💊',
    },

    // Infectious Diseases
    {
        id: 28,
        category: 'Infectious Diseases',
        url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public',
        icon: '😷',
    },
    {
        id: 29,
        category: 'Infectious Diseases',
        url: 'https://www.who.int/gpsc/clean_hands_protection/en/',
        icon: '🧼',
    },
    {
        id: 30,
        category: 'Infectious Diseases',
        url: 'https://www.who.int/news-room/fact-sheets/detail/tuberculosis',
        icon: '🫁',
    }
];

export default function HealthLit({ navigation, route }) {
    const { language, changeLanguage } = useContext(LanguageContext);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const translations = {
        en: {
            title: 'Health Awareness',
            subtitle: 'Digital Health & Wellbeing Documents',
            searchPlaceholder: 'Search health topics...',
            allCategories: 'All',
            openDocument: 'Open Document',
            categories: 'Categories',
            documentsFound: 'documents found',
            ashaPosts: 'Posts From Asha',
        }
    };

    const t = translations[language] || translations.en;
    const docTrans = documentTranslations[language] || documentTranslations.en;

    // ✅ Get translated category names
    const getTranslatedCategories = () => {
        const originalCategories = [...new Set(healthDocuments.map(doc => doc.category))];
        const translatedCategories = originalCategories.map(cat => docTrans.categories[cat] || cat);
        return [t.allCategories, ...translatedCategories];
    };

    // ✅ Get document with translated content
    const getTranslatedDocument = (doc) => {
        const translatedDoc = docTrans.documents[doc.id];
        return {
            ...doc,
            category: docTrans.categories[doc.category] || doc.category,
            title: translatedDoc?.title || `Document ${doc.id}`,
            description: translatedDoc?.description || 'Document description not available'
        };
    };

    const categories = getTranslatedCategories();

    // ✅ Filter documents with translated content
    const filteredDocuments = healthDocuments
        .map(getTranslatedDocument)
        .filter(doc => {
            const matchesCategory = selectedCategory === t.allCategories || doc.category === selectedCategory;
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

    // Handle document press
    const handleDocumentPress = async (document) => {
        try {
            const supported = await Linking.canOpenURL(document.url);
            if (supported) {
                await Linking.openURL(document.url);
            } else {
                Alert.alert(
                    'Error',
                    'Cannot open this document. Please check your internet connection.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to open document. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Handle Asha Posts button press
    const handleAshaPostsPress = () => {
    navigation.navigate("ViewLit");
};

    // Render category button
    const renderCategoryButton = (category) => (
        <TouchableOpacity
            key={category}
            style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
        >
            <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText
            ]}>
                {category}
            </Text>
        </TouchableOpacity>
    );

    // Render document item
    const renderDocument = ({ item }) => (
        <TouchableOpacity
            style={styles.documentCard}
            onPress={() => handleDocumentPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.documentHeader}>
                <Text style={styles.documentIcon}>{item.icon}</Text>
                <View style={styles.documentInfo}>
                    <Text style={styles.documentCategory}>{item.category}</Text>
                    <Text style={styles.documentTitle}>{item.title}</Text>
                </View>
            </View>
            <Text style={styles.documentDescription}>{item.description}</Text>
            <View style={styles.documentFooter}>
                <Text style={styles.openDocumentText}>{t.openDocument}</Text>
                <Text style={styles.arrowIcon}>→</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* ✅ Header */}
            <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t.title}</Text>
                    <Text style={styles.subtitle}>{t.subtitle}</Text>
                </View>
            </View>

            {/* ✅ Posts From Asha Button */}
            <TouchableOpacity
                style={styles.ashaButton}
                onPress={handleAshaPostsPress}
                activeOpacity={0.7}
            >
                <Text style={styles.ashaButtonText}>{t.ashaPosts}</Text>
            </TouchableOpacity>

            {/* Categories */}
            <View style={styles.categoriesSection}>
                <Text style={styles.categoriesTitle}>{t.categories}</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                >
                    {categories.map(renderCategoryButton)}
                </ScrollView>
            </View>

            {/* Results Count */}
            <Text style={styles.resultsCount}>
                {filteredDocuments.length} {t.documentsFound}
            </Text>

            {/* Documents List */}
            <FlatList
                data={filteredDocuments}
                renderItem={renderDocument}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.documentsList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf7fa',
        padding: 20,
    },
    // ✅ Header row styles
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginTop: 20,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    // ✅ Asha Posts Button Styles
    ashaButton: {
        backgroundColor: '#36b5b0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ashaButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    categoriesSection: {
        marginBottom: 20,
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 10,
    },
    categoriesScroll: {
        flexGrow: 0,
    },
    categoryButton: {
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#bdc3c7',
    },
    selectedCategoryButton: {
        backgroundColor: '#36b5b0',
        borderColor: '#36b5b0',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#34495e',
        fontWeight: '500',
    },
    selectedCategoryButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    resultsCount: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    documentsList: {
        paddingBottom: 20,
    },
    documentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#36b5b0',
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    documentIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    documentInfo: {
        flex: 1,
    },
    documentCategory: {
        fontSize: 12,
        color: '#36b5b0',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        lineHeight: 22,
    },
    documentDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        marginBottom: 12,
    },
    documentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    openDocumentText: {
        fontSize: 14,
        color: '#36b5b0',
        fontWeight: '600',
    },
    arrowIcon: {
        fontSize: 16,
        color: '#36b5b0',
        fontWeight: 'bold',
    },
    separator: {
        height: 12,
    },
});