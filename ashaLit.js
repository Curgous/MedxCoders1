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

export default function AshaLit({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('create');
  const [postTitle, setPostTitle] = useState('');
  const [postSubject, setPostSubject] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postLink, setPostLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states for editing and showing details
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const { user } = route.params || {};
  console.log({ user });

  useEffect(() => {
    fetchPosts();
    const unsubscribe = navigation.addListener('focus', () => fetchPosts());
    return unsubscribe;
  }, [navigation]);

  // Fetch posts created by this CHO
  const fetchMyPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('health_lit')
        .select('*')
        .eq('asha_id', user?.cho_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPosts(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch your posts');
    }
  };

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

  // Fetch both
  const fetchPosts = async () => {
    await fetchMyPosts();
    await fetchAllPosts();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Create post
  const handleCreatePost = async () => {
    if (!postTitle.trim()) {
      Alert.alert('Error', 'Post title is required');
      return;
    }
    if (!postSubject.trim()) {
      Alert.alert('Error', 'Post subject is required');
      return;
    }
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('health_lit').insert([
        {
          l_title: postTitle,
          l_subject: postSubject,
          l_content: postContent,
          l_link: postLink || null,
          asha_id: user?.cho_id,
          asha_name: user?.cho_name,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Health literacy post created successfully');
      setPostTitle('');
      setPostSubject('');
      setPostContent('');
      setPostLink('');
      await fetchPosts();
    } catch (err) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('health_lit')
              .delete()
              .eq('id', postId);

            if (error) throw error;
            Alert.alert('Success', 'Post deleted successfully');
            await fetchPosts();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };

  // Open edit modal
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setEditTitle(post.l_title);
    setEditSubject(post.l_subject);
    setEditContent(post.l_content);
    setEditLink(post.l_link || '');
    setEditModalVisible(true);
  };

  // Update post
  const handleUpdatePost = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    if (!editSubject.trim()) {
      Alert.alert('Error', 'Subject is required');
      return;
    }
    if (!editContent.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    setEditLoading(true);
    try {
      const { error } = await supabase
        .from('health_lit')
        .update({
          l_title: editTitle,
          l_subject: editSubject,
          l_content: editContent,
          l_link: editLink || null,
        })
        .eq('id', selectedPost.id);

      if (error) throw error;

      Alert.alert('Success', 'Post updated successfully');
      setEditModalVisible(false);
      setSelectedPost(null);
      await fetchPosts();
    } catch (err) {
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setEditLoading(false);
    }
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
  const renderPostBox = (post, showEditDelete = false) => {
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
      {/* Show Asha worker name and id in View All section */}
      {!showEditDelete && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: "#205099", fontWeight: "bold", fontSize: 12 }}>
            Registered by: {post.asha_name} ({post.asha_id})
          </Text>
        </View>
      )}
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
        {showEditDelete && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditPost(post)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePost(post.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};


  const renderCreateSection = () => (
    <View style={styles.createBox}>
      <Text style={styles.createBoxHeading}>Create Health Literacy Post</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Post Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post title"
          value={postTitle}
          onChangeText={setPostTitle}
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Post Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post subject"
          value={postSubject}
          onChangeText={setPostSubject}
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Post Content</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter post content"
          value={postContent}
          onChangeText={setPostContent}
          multiline
          editable={!loading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Post Link (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post link"
          value={postLink}
          onChangeText={setPostLink}
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[styles.createButton, loading && styles.createButtonDisabled]}
        onPress={handleCreatePost}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? 'Creating...' : 'Create'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Section Buttons */}
      <View style={styles.sectionButtonRow}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'create'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('create')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'create' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Create
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'modify'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('modify')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'modify' ? styles.sectionButtonTextActive : {},
            ]}
          >
            Modify
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeTab === 'viewall'
              ? styles.sectionButtonActive
              : styles.sectionButtonOutline,
          ]}
          onPress={() => setActiveTab('viewall')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.sectionButtonText,
              activeTab === 'viewall' ? styles.sectionButtonTextActive : {},
            ]}
          >
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'create' ? (
          renderCreateSection()
        ) : activeTab === 'modify' ? (
          myPosts.length > 0 ? (
            myPosts.map((post) => renderPostBox(post, true))
          ) : (
            <Text style={styles.emptyText}>No posts created yet</Text>
          )
        ) : (
          allPosts.length > 0 ? (
            allPosts.map((post) => renderPostBox(post, false))
          ) : (
            <Text style={styles.emptyText}>No posts available</Text>
          )
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !editLoading && setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Post</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                editable={!editLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={editSubject}
                onChangeText={setEditSubject}
                editable={!editLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={editContent}
                onChangeText={setEditContent}
                multiline
                editable={!editLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Link</Text>
              <TextInput
                style={styles.input}
                value={editLink}
                onChangeText={setEditLink}
                editable={!editLoading}
              />
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => !editLoading && setEditModalVisible(false)}
                disabled={editLoading}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalUpdateButton,
                  editLoading && styles.modalUpdateButtonDisabled,
                ]}
                onPress={handleUpdatePost}
                disabled={editLoading}
              >
                <Text style={styles.modalUpdateText}>
                  {editLoading ? 'Updating...' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 8,
  },
  sectionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 20,
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
    fontSize: 14,
    color: '#205099',
  },
  sectionButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  createBoxHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#36b5b0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  editButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#205099',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalCancelButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  modalCancelText: {
    color: '#205099',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalUpdateButton: {
    backgroundColor: '#36b5b0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  modalUpdateButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  modalUpdateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
