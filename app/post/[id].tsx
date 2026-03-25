import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePost } from '../../hooks/usePosts';
import { useComments } from '../../hooks/useComments';
import CustomButton from '../../components/ui/CustomButton';

import { Comment } from '../../services/api';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Dynamic routing parameter
  const postId = Number(id);

  const { data: post, isLoading: isPostLoading } = usePost(postId);
  const { data: comments, isLoading: isCommentsLoading } = useComments(postId);

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentName}>{item.name}</Text>
        <Text style={styles.commentEmail}>{item.email}</Text>
      </View>
      <Text style={styles.commentBody}>{item.body}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1E3A8A', '#4F46E5']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Navigation Header */}
        <View style={styles.header}>
          <CustomButton 
            title="← Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
            textStyle={{ color: '#FFFFFF', fontSize: 14 }}
            variant="secondary"
          />
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={{ width: 60 }} />
        </View>

        {isPostLoading || isCommentsLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 40 }} />
        ) : !post ? (
          <Text style={styles.errorText}>Post not found.</Text>
        ) : (
          <FlatList
            // Render the Post itself as the ListHeaderComponent so it scrolls seamlessly!
            ListHeaderComponent={
              <View style={styles.postSection}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody}>{post.body}</Text>
                
                <Text style={styles.commentsLabel}>
                  Comments ({comments?.length ?? 0})
                </Text>
              </View>
            }
            data={comments}
            keyExtractor={c => c.id.toString()}
            renderItem={renderComment}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButton: {
    width: 60,
    height: 36,
    marginVertical: 0,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  postSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  commentsLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  commentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentHeader: {
    marginBottom: 8,
  },
  commentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  commentEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  commentBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
  }
});
