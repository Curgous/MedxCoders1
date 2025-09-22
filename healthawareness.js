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

// ✅ Complete document translations for all languages
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
    },
    pa: {
        categories: {
            'Mental Health': 'ਮਾਨਸਿਕ ਸਿਹਤ',
            'Nutrition': 'ਪੋਸ਼ਣ',
            'Fitness': 'ਤੰਦਰੁਸਤੀ',
            'Prevention': 'ਰੋਕਥਾਮ',
            'Women\'s Health': 'ਔਰਤਾਂ ਦੀ ਸਿਹਤ',
            'Children\'s Health': 'ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ',
            'Chronic Diseases': 'ਲੰਮੀ ਬਿਮਾਰੀਆਂ',
            'Emergency Care': 'ਐਮਰਜੈਂਸੀ ਦੇਖਭਾਲ',
            'Elderly Care': 'ਬਜ਼ੁਰਗਾਂ ਦੀ ਦੇਖਭਾਲ',
            'Infectious Diseases': 'ਛੂਤ ਦੀਆਂ ਬਿਮਾਰੀਆਂ'
        },
        documents: {
            1: {
                title: 'ਡਿਪ੍ਰੈਸ਼ਨ ਅਤੇ ਚਿੰਤਾ ਨੂੰ ਸਮਝਣਾ',
                description: 'ਮਾਨਸਿਕ ਸਿਹਤ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦੇ ਲੱਛਣ, ਕਾਰਨ ਅਤੇ ਇਲਾਜ ਬਾਰੇ ਜਾਣੋ'
            },
            2: {
                title: 'ਤਣਾਅ ਪ੍ਰਬੰਧਨ ਦੀਆਂ ਤਕਨੀਕਾਂ',
                description: 'ਰੋਜ਼ਾਨਾ ਜੀਵਨ ਵਿੱਚ ਤਣਾਅ ਨੂੰ ਸੰਭਾਲਣ ਅਤੇ ਘਟਾਉਣ ਦੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਤਰੀਕੇ'
            },
            3: {
                title: 'ਨੀਂਦ ਦੀ ਸਫਾਈ ਗਾਈਡ',
                description: 'ਬਿਹਤਰ ਨੀਂਦ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਸਿਹਤਮੰਦ ਨੀਂਦ ਦੀਆਂ ਆਦਤਾਂ ਲਈ ਸੁਝਾਅ'
            },
            4: {
                title: 'ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਸਿਹਤਮੰਦ ਭੋਜਨ ਅਤੇ ਪੋਸ਼ਣ ਲਈ WHO ਦੀਆਂ ਸਿਫ਼ਾਰਸ਼ਾਂ'
            },
            5: {
                title: 'ਸ਼ੂਗਰ ਦਾ ਖੁਰਾਕ ਪ੍ਰਬੰਧਨ',
                description: 'ਸ਼ੂਗਰ ਨੂੰ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਢੰਗ ਨਾਲ ਸੰਭਾਲਣ ਲਈ ਖੁਰਾਕ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼'
            },
            6: {
                title: 'ਦਿਲ ਦੀ ਸਿਹਤ ਵਾਲਾ ਭੋਜਨ',
                description: 'ਦਿਲ ਦੀ ਸਿਹਤ ਬਰਕਰਾਰ ਰੱਖਣ ਲਈ ਭੋਜਨ ਅਤੇ ਖੁਰਾਕ ਯੋਜਨਾਵਾਂ'
            },
            7: {
                title: 'ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਰੋਜ਼ਾਨਾ ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਲਈ WHO ਦੀਆਂ ਸਿਫ਼ਾਰਸ਼ਾਂ'
            },
            8: {
                title: 'ਘਰੇਲੂ ਕਸਰਤ ਦੀਆਂ ਰੂਟੀਨਾਂ',
                description: 'ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਕਸਰਤਾਂ ਜੋ ਤੁਸੀਂ ਘਰ ਵਿੱਚ ਬਿਨਾਂ ਉਪਕਰਣਾਂ ਦੇ ਕਰ ਸਕਦੇ ਹੋ'
            },
            9: {
                title: 'ਸ਼ੁਰੂਆਤੀ ਲੋਕਾਂ ਲਈ ਯੋਗਾ',
                description: 'ਯੋਗਾ ਆਸਣਾਂ ਅਤੇ ਸਾਂਸ ਦੀਆਂ ਤਕਨੀਕਾਂ ਦਾ ਪਰਿਚਯ'
            },
            10: {
                title: 'ਟੀਕਾਕਰਣ ਤਾਲਿਕਾ',
                description: 'ਬੱਚਿਆਂ ਅਤੇ ਬਾਲਗਾਂ ਲਈ ਜ਼ਰੂਰੀ ਟੀਕੇ'
            },
            11: {
                title: 'ਕੈਂਸਰ ਰੋਕਥਾਮ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਕੈਂਸਰ ਦੇ ਜੋਖਿਮ ਨੂੰ ਘਟਾਉਣ ਲਈ ਜੀਵਨਸ਼ੈਲੀ ਵਿੱਚ ਤਬਦੀਲੀਆਂ'
            },
            12: {
                title: 'ਨਿਯਮਤ ਸਿਹਤ ਜਾਂਚ',
                description: 'ਰੂਟੀਨ ਮੈਡੀਕਲ ਜਾਂਚ ਦਾ ਮਹੱਤਵ'
            },
            13: {
                title: 'ਗਰਭਾਵਸਥਾ ਦੇਖਭਾਲ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਗਰਭਾਵਸਥਾ ਦੌਰਾਨ ਜ਼ਰੂਰੀ ਦੇਖਭਾਲ ਅਤੇ ਜਨਮ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਸਿਹਤ'
            },
            14: {
                title: 'ਛਾਤੀ ਦੀ ਸਿਹਤ ਜਾਗਰੂਕਤਾ',
                description: 'ਛਾਤੀ ਦੇ ਕੈਂਸਰ ਦੀ ਰੋਕਥਾਮ ਅਤੇ ਸਵੈ-ਜਾਂਚ'
            },
            15: {
                title: 'ਮੀਨੋਪੌਜ਼ ਪ੍ਰਬੰਧਨ',
                description: 'ਮੀਨੋਪੌਜ਼ ਦੇ ਲੱਛਣਾਂ ਨੂੰ ਸਮਝਣਾ ਅਤੇ ਸੰਭਾਲਣਾ'
            },
            16: {
                title: 'ਬਾਲ ਵਿਕਾਸ ਮੀਲਪੱਥਰ',
                description: 'ਬੱਚਿਆਂ ਵਿੱਚ ਸਰੀਰਕ ਅਤੇ ਮਾਨਸਿਕ ਵਿਕਾਸ ਦੇ ਪੜਾਅ'
            },
            17: {
                title: 'ਬਚਪਨ ਦੀ ਪੋਸ਼ਣ ਗਾਈਡ',
                description: 'ਵਧ ਰਹੇ ਬੱਚਿਆਂ ਲਈ ਪੋਸ਼ਣ ਦੀਆਂ ਲੋੜਾਂ'
            },
            18: {
                title: 'ਆਮ ਬਚਪਨ ਦੀਆਂ ਬਿਮਾਰੀਆਂ',
                description: 'ਆਮ ਬਾਲ ਰੋਗਾਂ ਦੀ ਪਛਾਣ ਅਤੇ ਪ੍ਰਬੰਧਨ'
            },
            19: {
                title: 'ਹਾਈਪਰਟੈਂਸ਼ਨ ਪ੍ਰਬੰਧਨ',
                description: 'ਜੀਵਨਸ਼ੈਲੀ ਅਤੇ ਦਵਾਈ ਦੁਆਰਾ ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦਾ ਪ੍ਰਬੰਧਨ'
            },
            20: {
                title: 'ਦਮਾ ਦੇਖਭਾਲ ਯੋਜਨਾ',
                description: 'ਦਮੇ ਦੇ ਲੱਛਣਾਂ ਅਤੇ ਕਾਰਕਾਂ ਦਾ ਪ੍ਰਬੰਧਨ'
            },
            21: {
                title: 'ਗਠੀਏ ਦਾ ਪ੍ਰਬੰਧਨ',
                description: 'ਗਠੀਏ ਨਾਲ ਜੀਣਾ ਅਤੇ ਜੋੜਾਂ ਦੇ ਦਰਦ ਦਾ ਪ੍ਰਬੰਧਨ'
            },
            22: {
                title: 'ਪ੍ਰਾਥਮਿਕ ਸਹਾਇਤਾ ਮੂਲ ਗੱਲਾਂ',
                description: 'ਜ਼ਰੂਰੀ ਪ੍ਰਾਥਮਿਕ ਸਹਾਇਤਾ ਹੁਨਰ ਜੋ ਹਰ ਕਿਸੇ ਨੂੰ ਪਤਾ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ'
            },
            23: {
                title: 'CPR ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਜਾਨ ਬਚਾਉਣ ਵਾਲੇ ਦਿਲ-ਫੇਫੜੇ ਸੁਰਜੀਤ ਕਰਨ ਦੀਆਂ ਤਕਨੀਕਾਂ'
            },
            24: {
                title: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਜਾਣਕਾਰੀ',
                description: 'ਮਹੱਤਵਪੂਰਣ ਨੰਬਰ ਅਤੇ ਮਦਦ ਲਈ ਕਦੋਂ ਕਾਲ ਕਰਨਾ ਹੈ'
            },
            25: {
                title: 'ਸਿਹਤਮੰਦ ਬੁੱਢਾਪਾ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਬਜ਼ੁਰਗਾਂ ਵਿੱਚ ਸਿਹਤ ਅਤੇ ਸੁਤੰਤਰਤਾ ਬਣਾਈ ਰੱਖਣਾ'
            },
            26: {
                title: 'ਗਿਰਨ ਤੋਂ ਰੋਕਥਾਮ',
                description: 'ਬਜ਼ੁਰਗਾਂ ਵਿੱਚ ਗਿਰਨ ਦੇ ਜੋਖਿਮ ਨੂੰ ਘਟਾਉਣਾ'
            },
            27: {
                title: 'ਦਵਾਈ ਪ੍ਰਬੰਧਨ',
                description: 'ਬਜ਼ੁਰਗਾਂ ਲਈ ਸੁਰਖਸ਼ਿਤ ਦਵਾਈ ਅਭਿਆਸ'
            },
            28: {
                title: 'ਕੋਵਿਡ-19 ਰੋਕਥਾਮ',
                description: 'ਕੋਰੋਨਾਵਾਇਰਸ ਦੇ ਫੈਲਾਅ ਨੂੰ ਰੋਕਣ ਲਈ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼'
            },
            29: {
                title: 'ਹੱਥ ਦੀ ਸਫਾਈ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
                description: 'ਲਾਗ ਨੂੰ ਰੋਕਣ ਲਈ ਸਹੀ ਹੱਥ ਧੋਣ ਦੀਆਂ ਤਕਨੀਕਾਂ'
            },
            30: {
                title: 'ਤਪਦਿਕ ਜਾਗਰੂਕਤਾ',
                description: 'TB ਦੇ ਲੱਛਣਾਂ, ਰੋਕਥਾਮ ਅਤੇ ਇਲਾਜ ਨੂੰ ਸਮਝਣਾ'
            }
        }
    },
    hi: {
        categories: {
            'Mental Health': 'मानसिक स्वास्थ्य',
            'Nutrition': 'पोषण',
            'Fitness': 'फिटनेस',
            'Prevention': 'रोकथाम',
            'Women\'s Health': 'महिलाओं की स्वास्थ्य',
            'Children\'s Health': 'बच्चों का स्वास्थ्य',
            'Chronic Diseases': 'लंबी बीमारियां',
            'Emergency Care': 'आपातकालीन देखभाल',
            'Elderly Care': 'बुजुर्गों की देखभाल',
            'Infectious Diseases': 'संक्रामक रोग'
        },
        documents: {
            1: {
                title: 'डिप्रेशन और चिंता को समझना',
                description: 'मानसिक स्वास्थ्य समस्याओं के लक्षण, कारण और उपचार के विकल्पों के बारे में जानें'
            },
            2: {
                title: 'तनाव प्रबंधन तकनीकें',
                description: 'दैनिक जीवन में तनाव को संभालने और कम करने की प्रभावी रणनीतियां'
            },
            3: {
                title: 'नींद की स्वच्छता गाइड',
                description: 'बेहतर नींद की गुणवत्ता और स्वस्थ नींद की आदतों के लिए सुझाव'
            },
            4: {
                title: 'संतुलित आहार दिशानिर्देश',
                description: 'स्वस्थ भोजन और पोषण के लिए WHO की सिफारिशें'
            },
            5: {
                title: 'मधुमेह आहार प्रबंधन',
                description: 'मधुमेह को प्रभावी रूप से प्रबंधित करने के लिए आहार दिशानिर्देश'
            },
            6: {
                title: 'हृदय-स्वस्थ भोजन',
                description: 'हृदय स्वास्थ्य बनाए रखने के लिए खाद्य पदार्थ और आहार योजनाएं'
            },
            7: {
                title: 'शारीरिक गतिविधि दिशानिर्देश',
                description: 'दैनिक शारीरिक गतिविधि के लिए WHO की सिफारिशें'
            },
            8: {
                title: 'घरेलू वर्कआउट रूटीन',
                description: 'प्रभावी व्यायाम जो आप बिना उपकरण के घर पर कर सकते हैं'
            },
            9: {
                title: 'शुरुआती लोगों के लिए योग',
                description: 'योग आसन और सांस की तकनीकों का परिचय'
            },
            10: {
                title: 'टीकाकरण अनुसूची',
                description: 'बच्चों और वयस्कों के लिए आवश्यक टीके'
            },
            11: {
                title: 'कैंसर रोकथाम दिशानिर्देश',
                description: 'कैंसर के जोखिम को कम करने के लिए जीवनशैली में बदलाव'
            },
            12: {
                title: 'नियमित स्वास्थ्य जांच',
                description: 'नियमित चिकित्सा परीक्षाओं का महत्व'
            },
            13: {
                title: 'गर्भावस्था देखभाल दिशानिर्देश',
                description: 'गर्भावस्था के दौरान आवश्यक देखभाल और प्रसवपूर्व स्वास्थ्य'
            },
            14: {
                title: 'स्तन स्वास्थ्य जागरूकता',
                description: 'स्तन कैंसर की रोकथाम और स्व-परीक्षा'
            },
            15: {
                title: 'रजोनिवृत्ति प्रबंधन',
                description: 'रजोनिवृत्ति के लक्षणों को समझना और प्रबंधित करना'
            },
            16: {
                title: 'बाल विकास मील के पत्थर',
                description: 'बच्चों में शारीरिक और मानसिक विकास के चरण'
            },
            17: {
                title: 'बचपन पोषण गाइड',
                description: 'बढ़ते बच्चों के लिए पोषण आवश्यकताएं'
            },
            18: {
                title: 'आम बचपन की बीमारियां',
                description: 'सामान्य बाल रोगों की पहचान और प्रबंधन'
            },
            19: {
                title: 'उच्च रक्तचाप प्रबंधन',
                description: 'जीवनशैली और दवा के माध्यम से उच्च रक्तचाप का प्रबंधन'
            },
            20: {
                title: 'अस्थमा देखभाल योजना',
                description: 'अस्थमा के लक्षणों और ट्रिगर्स का प्रबंधन'
            },
            21: {
                title: 'गठिया प्रबंधन',
                description: 'गठिया के साथ जीना और जोड़ों के दर्द का प्रबंधन'
            },
            22: {
                title: 'प्राथमिक चिकित्सा मूल बातें',
                description: 'आवश्यक प्राथमिक चिकित्सा कौशल जो हर किसी को पता होना चाहिए'
            },
            23: {
                title: 'CPR दिशानिर्देश',
                description: 'जीवन रक्षक हृदय-फेफड़े पुनर्जीवन तकनीकें'
            },
            24: {
                title: 'आपातकालीन संपर्क जानकारी',
                description: 'महत्वपूर्ण नंबर और कब मदद के लिए कॉल करना है'
            },
            25: {
                title: 'स्वस्थ बुढ़ापा दिशानिर्देश',
                description: 'वृद्ध वयस्कों में स्वास्थ्य और स्वतंत्रता बनाए रखना'
            },
            26: {
                title: 'गिरने की रोकथाम',
                description: 'बुजुर्गों में गिरने के जोखिम को कम करना'
            },
            27: {
                title: 'दवा प्रबंधन',
                description: 'वरिष्ठों के लिए सुरक्षित दवा अभ्यास'
            },
            28: {
                title: 'कोविड-19 रोकथाम',
                description: 'कोरोनावायरस संचरण को रोकने के लिए दिशानिर्देश'
            },
            29: {
                title: 'हाथ स्वच्छता दिशानिर्देश',
                description: 'संक्रमण को रोकने के लिए उचित हाथ धोने की तकनीक'
            },
            30: {
                title: 'तपेदिक जागरूकता',
                description: 'TB के लक्षणों, रोकथाम और उपचार को समझना'
            }
        }
    },
    bn: {
        categories: {
            'Mental Health': 'মানসিক স্বাস্থ্য',
            'Nutrition': 'পুষ্টি',
            'Fitness': 'ফিটনেস',
            'Prevention': 'প্রতিরোধ',
            'Women\'s Health': 'নারীদের স্বাস্থ্য',
            'Children\'s Health': 'শিশুদের স্বাস্থ্য',
            'Chronic Diseases': 'দীর্ঘমেয়াদী রোগ',
            'Emergency Care': 'জরুরি যত্ন',
            'Elderly Care': 'বয়স্কদের যত্ন',
            'Infectious Diseases': 'সংক্রামক রোগ'
        },
        documents: {
            1: {
                title: 'বিষণ্নতা এবং উদ্বেগ বোঝা',
                description: 'মানসিক স্বাস্থ্য অবস্থার লক্ষণ, কারণ এবং চিকিত্সার বিকল্প সম্পর্কে জানুন'
            },
            2: {
                title: 'স্ট্রেস ম্যানেজমেন্ট কৌশল',
                description: 'দৈনন্দিন জীবনে স্ট্রেস পরিচালনা এবং কমানোর কার্যকর কৌশল'
            },
            3: {
                title: 'ঘুমের স্বাস্থ্যবিধি গাইড',
                description: 'ভাল ঘুমের গুণমান এবং স্বাস্থ্যকর ঘুমের অভ্যাসের জন্য টিপস'
            },
            4: {
                title: 'সুষম খাদ্য নির্দেশিকা',
                description: 'স্বাস্থ্যকর খাওয়া এবং পুষ্টির জন্য WHO সুপারিশ'
            },
            5: {
                title: 'ডায়াবেটিস খাদ্য ব্যবস্থাপনা',
                description: 'ডায়াবেটিস কার্যকরভাবে পরিচালনার জন্য খাদ্যতালিকাগত নির্দেশিকা'
            },
            6: {
                title: 'হৃদয়-স্বাস্থ্যকর খাওয়া',
                description: 'কার্ডিওভাসকুলার স্বাস্থ্য বজায় রাখার জন্য খাবার এবং খাদ্য পরিকল্পনা'
            },
            7: {
                title: 'শারীরিক কার্যকলাপ নির্দেশিকা',
                description: 'দৈনন্দিন শারীরিক কার্যকলাপের জন্য WHO সুপারিশ'
            },
            8: {
                title: 'বাড়ির ওয়ার্কআউট রুটিন',
                description: 'কার্যকর ব্যায়াম যা আপনি বাড়িতে সরঞ্জাম ছাড়াই করতে পারেন'
            },
            9: {
                title: 'নতুনদের জন্য যোগব্যায়াম',
                description: 'যোগব্যায়াম ভঙ্গি এবং শ্বাসপ্রশ্বাস কৌশলের ভূমিকা'
            },
            10: {
                title: 'টিকাদান সময়সূচী',
                description: 'শিশু এবং প্রাপ্তবয়স্কদের জন্য প্রয়োজনীয় টিকা'
            },
            11: {
                title: 'ক্যান্সার প্রতিরোধ নির্দেশিকা',
                description: 'ক্যান্সারের ঝুঁকি কমাতে জীবনযাত্রার পরিবর্তন'
            },
            12: {
                title: 'নিয়মিত স্বাস্থ্য পরীক্ষা',
                description: 'নিয়মিত চিকিৎসা পরীক্ষার গুরুত্ব'
            },
            13: {
                title: 'গর্ভাবস্থায় যত্ন নির্দেশিকা',
                description: 'গর্ভাবস্থায় প্রয়োজনীয় যত্ন এবং প্রসবপূর্ব স্বাস্থ্য'
            },
            14: {
                title: 'স্তন স্বাস্থ্য সচেতনতা',
                description: 'স্তন ক্যান্সার প্রতিরোধ এবং স্ব-পরীক্ষা'
            },
            15: {
                title: 'মেনোপজ ব্যবস্থাপনা',
                description: 'মেনোপজের লক্ষণগুলি বোঝা এবং পরিচালনা করা'
            },
            16: {
                title: 'শিশু বিকাশ মাইলফলক',
                description: 'শিশুদের মধ্যে শারীরিক এবং মানসিক বিকাশের পর্যায়'
            },
            17: {
                title: 'শৈশব পুষ্টি গাইড',
                description: 'বর্ধনশীল শিশুদের জন্য পুষ্টির প্রয়োজনীয়তা'
            },
            18: {
                title: 'সাধারণ শৈশব অসুস্থতা',
                description: 'সাধারণ পেডিয়াট্রিক অবস্থার স্বীকৃতি এবং ব্যবস্থাপনা'
            },
            19: {
                title: 'উচ্চ রক্তচাপ ব্যবস্থাপনা',
                description: 'জীবনযাত্রা এবং ওষুধের মাধ্যমে উচ্চ রক্তচাপ পরিচালনা'
            },
            20: {
                title: 'অ্যাজমা যত্ন পরিকল্পনা',
                description: 'অ্যাজমার লক্ষণ এবং ট্রিগার পরিচালনা'
            },
            21: {
                title: 'বাতের ব্যবস্থাপনা',
                description: 'বাত নিয়ে বেঁচে থাকা এবং জয়েন্টের ব্যথা ব্যবস্থাপনা'
            },
            22: {
                title: 'প্রাথমিক চিকিৎসার মূল বিষয়',
                description: 'প্রয়োজনীয় প্রাথমিক চিকিৎসা দক্ষতা যা সবার জানা উচিত'
            },
            23: {
                title: 'CPR নির্দেশিকা',
                description: 'জীবন রক্ষাকারী কার্ডিওপালমোনারি রিসাসিটেশন কৌশল'
            },
            24: {
                title: 'জরুরি যোগাযোগের তথ্য',
                description: 'গুরুত্বপূর্ণ নম্বর এবং কখন সাহায্যের জন্য কল করবেন'
            },
            25: {
                title: 'স্বাস্থ্যকর বার্ধক্য নির্দেশিকা',
                description: 'বয়স্ক প্রাপ্তবয়স্কদের মধ্যে স্বাস্থ্য এবং স্বাধীনতা বজায় রাখা'
            },
            26: {
                title: 'পতন প্রতিরোধ',
                description: 'বয়স্ক ব্যক্তিদের মধ্যে পড়ে যাওয়ার ঝুঁকি হ্রাস করা'
            },
            27: {
                title: 'ওষুধ ব্যবস্থাপনা',
                description: 'সিনিয়রদের জন্য নিরাপদ ওষুধের অনুশীলন'
            },
            28: {
                title: 'কোভিড-19 প্রতিরোধ',
                description: 'করোনাভাইরাস সংক্রমণ প্রতিরোধের জন্য নির্দেশিকা'
            },
            29: {
                title: 'হাত স্বাস্থ্যবিধি নির্দেশিকা',
                description: 'সংক্রমণ প্রতিরোধের জন্য সঠিক হাত ধোয়ার কৌশল'
            },
            30: {
                title: 'যক্ষ্মা সচেতনতা',
                description: 'টিবি লক্ষণ, প্রতিরোধ এবং চিকিত্সা বোঝা'
            }
        }
    },
    ta: {
        categories: {
            'Mental Health': 'மனநலம்',
            'Nutrition': 'ஊட்டச்சத்து',
            'Fitness': 'உடற்பயிற்சி',
            'Prevention': 'தடுப்பு',
            'Women\'s Health': 'பெண்களின் சுகாதாரம்',
            'Children\'s Health': 'குழந்தைகளின் சுகாதாரம்',
            'Chronic Diseases': 'நாள்பட்ட நோய்கள்',
            'Emergency Care': 'அவசர சிகிச்சை',
            'Elderly Care': 'முதியோர் பராமரிப்பு',
            'Infectious Diseases': 'தொற்று நோய்கள்'
        },
        documents: {
            1: {
                title: 'மனச்சோர்வு மற்றும் கவலையைப் புரிந்துகொள்ளுதல்',
                description: 'மனநலநிலைகளின் அறிகுறிகள், காரணங்கள் மற்றும் சிகிச்சை விருப்பங்களைப் பற்றி அறிக'
            },
            2: {
                title: 'மன அழுத்த மேலாண்மை நுட்பங்கள்',
                description: 'தினசரி வாழ்க்கையில் மன அழுத்தத்தை நிர்வகிக்கவும் குறைக்கவும் பயனுள்ள உத்திகள்'
            },
            3: {
                title: 'தூக்க சுகாதார வழிகாட்டி',
                description: 'சிறந்த தூக்க தரம் மற்றும் ஆரோக்கியமான தூக்க பழக்கங்களுக்கான குறிப்புகள்'
            },
            4: {
                title: 'சமச்சீரான உணவு வழிகாட்டுதல்கள்',
                description: 'ஆரோக்கியமான உணவு மற்றும் ஊட்டச்சத்திற்கான WHO பரிந்துரைகள்'
            },
            5: {
                title: 'நீரிழிவு உணவு மேலாண்மை',
                description: 'நீரிழிவை திறம்பட நிர்வகிப்பதற்கான உணவு வழிகாட்டுதல்கள்'
            },
            6: {
                title: 'இதய-ஆரோக்கிய உணவு',
                description: 'இதயவாசகுலர் ஆரோக்கியத்தை பராமரிக்க உணவுகள் மற்றும் உணவு திட்டங்கள்'
            },
            7: {
                title: 'உடல் செயல்பாடு வழிகாட்டுதல்கள்',
                description: 'தினசரி உடல் செயல்பாடுக்கான WHO பரிந்துரைகள்'
            },
            8: {
                title: 'வீட்டு வொர்க்அவுட் வழக்கங்கள்',
                description: 'உபகரணங்கள் இல்லாமல் வீட்டில் செய்யக்கூடிய பயனுள்ள பயிற்சிகள்'
            },
            9: {
                title: 'புதியவர்களுக்கான யோகா',
                description: 'யோகா கோணங்கள் மற்றும் சுவாச நுட்பங்களுக்கான அறிமுகம்'
            },
            10: {
                title: 'தடுப்பூசி அட்டவணை',
                description: 'குழந்தைகள் மற்றும் பெரியவர்களுக்கு அவசிய தடுப்பூசிகள்'
            },
            11: {
                title: 'புற்றுநோய் தடுப்பு வழிகாட்டுதல்கள்',
                description: 'புற்றுநோய் அபாயத்தை குறைக்க வாழ்க்கை முறை மாற்றங்கள்'
            },
            12: {
                title: 'வழக்கமான சுகாதார பரிசோதனைகள்',
                description: 'வழக்கமான மருத்துவ பரிசோதனைகளின் முக்கியத்துவம்'
            },
            13: {
                title: 'கர்ப்ப கால பராமரிப்பு வழிகாட்டுதல்கள்',
                description: 'கர்ப்ப காலத்தில் அவசியமான பராமரிப்பு மற்றும் பிரசவத்திற்கு முந்தைய சுகாதாரம்'
            },
            14: {
                title: 'மார்பக ஆரோக்கிய விழிப்புணர்வு',
                description: 'மார்பக புற்றுநோய் தடுப்பு மற்றும் சுய-பரிசோதனை'
            },
            15: {
                title: 'மெனோபாஸ் மேலாண்மை',
                description: 'மெனோபாஸ் அறிகுறிகளைப் புரிந்துகொள்வதும் நிர்வகிப்பதும்'
            },
            16: {
                title: 'குழந்தை வளர்ச்சி மைல்கள்',
                description: 'குழந்தைகளில் உடல் மற்றும் மன வளர்ச்சி நிலைகள்'
            },
            17: {
                title: 'குழந்தைப் பருவ ஊட்டச்சத்து வழிகாட்டி',
                description: 'வளரும் குழந்தைகளுக்கான ஊட்டச்சத்து தேவைகள்'
            },
            18: {
                title: 'பொதுவான குழந்தைப் பருவ நோய்கள்',
                description: 'பொதுவான குழந்தைகள் நோய்களின் அங்கீகாரம் மற்றும் மேலாண்மை'
            },
            19: {
                title: 'உயர் இரத்த அழுத்த மேலாண்மை',
                description: 'வாழ்க்கை முறை மற்றும் மருந்து மூலம் உயர் இரத்த அழுத்தத்தை நிர்வகித்தல்'
            },
            20: {
                title: 'ஆஸ்துமா பராமரிப்பு திட்டம்',
                description: 'ஆஸ்துமா அறிகுறிகள் மற்றும் தூண்டுதல்களை நிர்வகித்தல்'
            },
            21: {
                title: 'மூட்டுவலி மேலாண்மை',
                description: 'மூட்டுவலியுடன் வாழ்வது மற்றும் மூட்டு வலி மேலாண்மை'
            },
            22: {
                title: 'முதலுதவி அடிப்படைகள்',
                description: 'அனைவரும் தெரிந்து கொள்ள வேண்டிய அத்தியாவசிய முதலுதவி திறன்கள்'
            },
            23: {
                title: 'CPR வழிகாட்டுதல்கள்',
                description: 'உயிர் காக்கும் இதய-நுரையீரல் புத்துயிர் அளிக்கும் நுட்பங்கள்'
            },
            24: {
                title: 'அவசர தொடர்பு தகவல்',
                description: 'முக்கியமான எண்கள் மற்றும் எப்போது உதவிக்கு அழைப்பது'
            },
            25: {
                title: 'ஆரோக்கியமான வயதான வழிகாட்டுதல்கள்',
                description: 'வயதான பெரியவர்களில் சுகாதாரம் மற்றும் சுதந்திரத்தை பராமரித்தல்'
            },
            26: {
                title: 'வீழ்ச்சி தடுப்பு',
                description: 'முதியவர்களில் வீழ்ச்சி ஆபத்தை குறைத்தல்'
            },
            27: {
                title: 'மருந்து மேலாண்மை',
                description: 'முதியோருக்கான பாதுகாப்பான மருந்து நடைமுறைகள்'
            },
            28: {
                title: 'கோவிட்-19 தடுப்பு',
                description: 'கொரோனா வைரஸ் பரவலைத் தடுப்பதற்கான வழிகாட்டுதல்கள்'
            },
            29: {
                title: 'கை சுகாதார வழிகாட்டுதல்கள்',
                description: 'தொற்றுகளைத் தடுக்க சரியான கை கழுவும் நுட்பங்கள்'
            },
            30: {
                title: 'காசநோய் விழிப்புணர்வு',
                description: 'TB அறிகுறிகள், தடுப்பு மற்றும் சிகிச்சையைப் புரிந்துகொள்ளுதல்'
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

export default function HealthAwareness() {
    const { language, changeLanguage } = useContext(LanguageContext);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const translations = {
        en: {
            title: 'Health Awareness',
            subtitle: 'Digital Health & Wellbeing Documents',
            searchPlaceholder: 'Search health topics...',
            allCategories: 'All',
            openDocument: 'Open Document',
            categories: 'Categories',
            documentsFound: 'documents found',
        },
        pa: {
            title: 'ਸਿਹਤ ਜਾਗਰੂਕਤਾ',
            subtitle: 'ਡਿਜੀਟਲ ਸਿਹਤ ਅਤੇ ਤੰਦਰੁਸਤੀ ਦਸਤਾਵੇਜ਼',
            searchPlaceholder: 'ਸਿਹਤ ਵਿਸ਼ਿਆਂ ਦੀ ਖੋਜ ਕਰੋ...',
            allCategories: 'ਸਭ',
            openDocument: 'ਦਸਤਾਵੇਜ਼ ਖੋਲ੍ਹੋ',
            categories: 'ਸ਼੍ਰੇਣੀਆਂ',
            documentsFound: 'ਦਸਤਾਵੇਜ਼ ਮਿਲੇ',
        },
        hi: {
            title: 'स्वास्थ्य जागरूकता',
            subtitle: 'डिजिटल स्वास्थ्य और कल्याण दस्तावेज़',
            searchPlaceholder: 'स्वास्थ्य विषयों की खोज करें...',
            allCategories: 'सभी',
            openDocument: 'दस्तावेज़ खोलें',
            categories: 'श्रेणियां',
            documentsFound: 'दस्तावेज़ मिले',
        },
        bn: {
            title: 'স্বাস্থ্য সচেতনতা',
            subtitle: 'ডিজিটাল স্বাস্থ্য ও সুস্থতা নথিপত্র',
            searchPlaceholder: 'স্বাস্থ্য বিষয় খুঁজুন...',
            allCategories: 'সব',
            openDocument: 'নথি খুলুন',
            categories: 'বিভাগসমূহ',
            documentsFound: 'নথি পাওয়া গেছে',
        },
        ta: {
            title: 'சுகாதார விழிப்புணர்வு',
            subtitle: 'டிஜிட்டல் சுகாதாரம் மற்றும் நல்வாழ்வு ஆவணங்கள்',
            searchPlaceholder: 'சுகாதார தலைப்புகளை தேடுகிறீர்கள்...',
            allCategories: 'அனைத்தும்',
            openDocument: 'ஆவணத்தைத் திறக்கவும்',
            categories: 'வகைகள்',
            documentsFound: 'ஆவணங்கள் கிடைத்தன',
        }
    };

    const t = translations[language] || translations.en;
    const docTrans = documentTranslations[language] || documentTranslations.en;

    // ✅ Language options with native scripts
    const languageOptions = [
        { code: 'en', label: 'English' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'bn', label: 'বাংলা' },
        { code: 'ta', label: 'தமிழ்' },
    ];

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

    // ✅ Handle language change
    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setDropdownVisible(false);
        setSelectedCategory(t.allCategories); // Reset category to "All" when language changes
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
            {/* ✅ Header with Language Dropdown */}
            <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t.title}</Text>
                    <Text style={styles.subtitle}>{t.subtitle}</Text>
                </View>
                <View style={styles.languageSection}>
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
                                    style={[
                                        styles.dropdownItem,
                                        language === lang.code && styles.selectedDropdownItem
                                    ]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <Text style={[
                                        styles.dropdownText,
                                        language === lang.code && styles.selectedDropdownText
                                    ]}>
                                        {lang.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>

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
    // ✅ New header row styles
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginTop: 20,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: 15,
    },
    languageSection: {
        position: 'relative',
    },
    langButton: {
        backgroundColor: '#bdc3c7',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        minHeight: 30,
    },
    langImage: {
        width: 45,
        height: 25,
        resizeMode: 'contain',
    },
    dropdown: {
        position: 'absolute',
        top: 42,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        minWidth: 120,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginVertical: 1,
    },
    selectedDropdownItem: {
        backgroundColor: '#36b5b0',
    },
    dropdownText: {
        fontSize: 14,
        color: '#34495e',
        fontWeight: '500',
    },
    selectedDropdownText: {
        color: '#ffffff',
        fontWeight: '600',
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
