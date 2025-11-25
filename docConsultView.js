import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { supabase } from './supabaseClient';

export default function DocConsultView({ navigation, route }) {
    const { user } = route.params || {};
    const [activeTab, setActiveTab] = useState('inbox');
    const [inboxConsults, setInboxConsults] = useState([]);
    const [acceptedConsults, setAcceptedConsults] = useState([]);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            // Fetch pending consultations
            const { data: pendingData, error: pendingError } = await supabase
                .from('consultation_records')
                .select('*')
                .eq('acc_stat', 'Pending')
                .order('created_at', { ascending: false });

            if (pendingError) throw pendingError;
            setInboxConsults(pendingData || []);

            // Fetch accepted consultations FOR THIS DOCTOR ONLY (by acc_id)
            let acceptedData = [];
            let acceptedError = null;
            if (user?.doc_id) {
                const res = await supabase
                    .from('consultation_records')
                    .select('*')
                    .eq('acc_stat', 'accepted')
                    .eq('acc_id', user.doc_id)
                    .order('created_at', { ascending: false });
                acceptedData = res.data;
                acceptedError = res.error;
            }

            if (acceptedError) throw acceptedError;
            setAcceptedConsults(acceptedData || []);
        } catch (error) {
            console.error('Error fetching consultations:', error);
            Alert.alert('Error', 'Failed to fetch consultations');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchConsultations();
        setRefreshing(false);
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    // Accept query and set acc_id as the current doc_id
    const acceptQuery = async (consultId) => {
        try {
            const { error } = await supabase
                .from('consultation_records')
                .update({ acc_stat: 'accepted', acc_id: user?.doc_id })
                .eq('id', consultId);

            if (error) throw error;

            Alert.alert('Success', 'Consultation accepted!');
            await fetchConsultations();
            setActiveTab('accepted');
        } catch (error) {
            console.error('Error accepting consultation:', error);
            Alert.alert('Error', 'Failed to accept consultation');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatHealthHistory = (healthHistory) => {
        if (!healthHistory || typeof healthHistory !== 'object') return [];
        return Object.entries(healthHistory)
            .filter(([key, value]) => value === true)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    };

    const renderConsultCard = (consult, showActions = false) => {
        const isExpanded = expandedIds.has(consult.id);
        const healthHistoryItems = formatHealthHistory(consult.health_history);

        return (
            <View key={consult.id} style={styles.card}>
                {/* Uploaded on - top right corner */}
                <Text style={styles.uploadedTime}>
                    {formatDateTime(consult.created_at)}
                </Text>
                <View style={styles.basicInfo}>
                    <Text style={styles.patientName}>{consult.patient_name || 'N/A'}</Text>
                    <Text style={styles.reason}>
                        <Text style={styles.label}>Reason: </Text>
                        {consult.reason || 'N/A'}
                    </Text>
                </View>
                {isExpanded && (
                    <View style={styles.expandedDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Patient ID:</Text>
                            <Text style={styles.detailValue}>{consult.patient_id || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Age:</Text>
                            <Text style={styles.detailValue}>{consult.age || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Gender:</Text>
                            <Text style={styles.detailValue}>{consult.gender || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Symptom Category:</Text>
                            <Text style={styles.detailValue}>{consult.symptom_category || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Category Type:</Text>
                            <Text style={styles.detailValue}>{consult.category_type || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Symptoms:</Text>
                            <Text style={styles.detailValue}>{consult.symptoms || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Duration:</Text>
                            <Text style={styles.detailValue}>{consult.duration_unit || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Severity:</Text>
                            <Text style={styles.detailValue}>{consult.severity || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailColumn}>
                            <Text style={styles.detailLabel}>Other Health History:</Text>
                            {healthHistoryItems.length > 0 ? (
                                healthHistoryItems.map((item, index) => (
                                    <Text key={index} style={styles.bulletItem}>• {item}</Text>
                                ))
                            ) : (
                                <Text style={styles.detailValue}>None</Text>
                            )}
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Desired Date:</Text>
                            <Text style={styles.detailValue}>{formatDate(consult.date_of_visit)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Desired Time:</Text>
                            <Text style={styles.detailValue}>{consult.time_of_visit || 'N/A'}</Text>
                        </View>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => toggleExpand(consult.id)}
                >
                    <Text style={styles.viewDetailsText}>
                        {isExpanded ? 'Hide Details' : 'View Details'}
                    </Text>
                </TouchableOpacity>
                {showActions === 'inbox' && (
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => acceptQuery(consult.id)}
                    >
                        <Text style={styles.acceptButtonText}>Accept Query</Text>
                    </TouchableOpacity>
                )}
                {showActions === 'accepted' && (
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            style={styles.scheduleButton}
                            onPress={() =>
                                navigation.navigate('Counsche', {
                                    dr_name: user?.name, dr_id: user?.doc_id,
                                })
                            }
                        >
                            <Text style={styles.actionButtonText}>Schedule Consultation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.reportButton}
                            onPress={() =>
                                navigation.navigate('ReportGen', { user })}
                        >
                            <Text style={styles.actionButtonText}>Generate Report</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionButtonRow}>
                <TouchableOpacity
                    style={[
                        styles.sectionButton,
                        activeTab === 'inbox'
                            ? styles.sectionButtonActive
                            : styles.sectionButtonOutline,
                    ]}
                    onPress={() => setActiveTab('inbox')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.sectionButtonText,
                            activeTab === 'inbox' ? styles.sectionButtonTextActive : {},
                        ]}
                    >
                        Inbox ({inboxConsults.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.sectionButton,
                        activeTab === 'accepted'
                            ? styles.sectionButtonActive
                            : styles.sectionButtonOutline,
                    ]}
                    onPress={() => setActiveTab('accepted')}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.sectionButtonText,
                            activeTab === 'accepted' ? styles.sectionButtonTextActive : {},
                        ]}
                    >
                        Accepted ({acceptedConsults.length})
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {activeTab === 'inbox' ? (
                    inboxConsults.length > 0 ? (
                        inboxConsults.map((consult) => renderConsultCard(consult, 'inbox'))
                    ) : (
                        <Text style={styles.emptyText}>No pending consultations</Text>
                    )
                ) : (
                    acceptedConsults.length > 0 ? (
                        acceptedConsults.map((consult) => renderConsultCard(consult, 'accepted'))
                    ) : (
                        <Text style={styles.emptyText}>No accepted consultations</Text>
                    )
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaf7fa',
    },
    sectionButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 18,
        marginBottom: 18,
    },
    sectionButton: {
        flex: 1,
        marginTop: 22,
        marginHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        elevation: 2,
    },
    sectionButtonActive: {
        backgroundColor: '#36b5b0',
        borderColor: '#36b5b0',
        elevation: 4,
    },
    sectionButtonOutline: {
        backgroundColor: '#eaf7fa',
        borderColor: '#36b5b0',
    },
    sectionButtonText: {
        fontWeight: 'bold',
        fontSize: 19,
        color: '#205099',
    },
    sectionButtonTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    uploadedTime: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
    },
    basicInfo: {
        marginBottom: 12,
        marginTop: 10,
    },
    patientName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#205099',
        marginBottom: 6,
    },
    reason: {
        fontSize: 15,
        color: '#434c59',
    },
    label: {
        fontWeight: 'bold',
        color: '#205099',
    },
    expandedDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailColumn: {
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#205099',
        width: 150,
    },
    detailValue: {
        fontSize: 14,
        color: '#434c59',
        flex: 1,
    },
    bulletItem: {
        fontSize: 14,
        color: '#434c59',
        marginLeft: 10,
        marginTop: 2,
    },
    viewDetailsButton: {
        backgroundColor: '#e0f2f1',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12,
    },
    viewDetailsText: {
        color: '#36b5b0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    acceptButton: {
        backgroundColor: '#36b5b0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 10,
    },
    scheduleButton: {
        flex: 1,
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    reportButton: {
        flex: 1,
        backgroundColor: '#9b59b6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 40,
    },
});