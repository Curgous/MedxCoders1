import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { supabase } from './supabaseClient';

export default function ViewLit({ navigation, route }) {
  const [allPosts, setAllPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states for showing details
  const [expandedPostId, setExpandedPostId] = useState(null);

  const { user } = route.params || {};
  console.log({ user });

  useEffect(() => {
    fetchPosts();
    const unsubscribe = navigation.addListener('focus', () => fetchPosts());
    return unsubscribe;
  }, [navigation]);

  // Fetch all posts
  const fetchAllPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('health_lit')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllPosts(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch posts');
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    await fetchAllPosts();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  // Render post box with expandable details
  const renderPostBox = (post) => {
    const isExpanded = expandedPostId === post.id;
    return (
      <View key={post.id} style={styles.postBox}>
        <View style={styles.postHeader}>
          <View style={styles.postTitleSection}>
            <Text style={styles.postBoxTitle}>{post.l_title}</Text>
          </View>
          <Text style={styles.postDateTime}>{formatDateTime(post.created_at)}</Text>
        </View>
        <View style={styles.postSubjectSection}>
          <Text style={styles.postBoxSubject}>{post.l_subject}</Text>
        </View>
        {/* Show Asha worker name and id */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: "#205099", fontWeight: "bold", fontSize: 12 }}>
            Registered by: {post.asha_name} ({post.asha_id})
          </Text>
        </View>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.contentLabel}>Content:</Text>
            <Text style={styles.contentText}>{post.l_content}</Text>
            {post.l_link && (
              <>
                <Text style={styles.contentLabel}>Link:</Text>
                <Text style={styles.contentText}>{post.l_link}</Text>
              </>
            )}
          </View>
        )}

        <View style={styles.postButtonsRow}>
          <TouchableOpacity
            style={styles.showDetailsButton}
            onPress={() => setExpandedPostId(isExpanded ? null : post.id)}
          >
            <Text style={styles.showDetailsText}>
              {isExpanded ? "Hide Details" : "Show Details"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Literacy Posts</Text>
        <Text style={styles.headerSubtitle}>Posts from Asha Health Workers</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allPosts.length > 0 ? (
          allPosts.map((post) => renderPostBox(post))
        ) : (
          <Text style={styles.emptyText}>No posts available</Text>
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
  header: {
    backgroundColor: '#eaf7fa',
    paddingVertical: 20,
    paddingHorizontal: 16,
    
    
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#205099',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#205099',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postBox: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  postTitleSection: {
    flex: 1,
  },
  postBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#205099',
  },
  postDateTime: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
  },
  postSubjectSection: {
    marginBottom: 12,
  },
  postBoxSubject: {
    fontSize: 13,
    fontWeight: '600',
    color: '#434c59',
  },
  expandedContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#205099',
    marginTop: 8,
  },
  contentText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    lineHeight: 18,
  },
  postButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  showDetailsButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
  },
  showDetailsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
});