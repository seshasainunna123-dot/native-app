import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Post } from '../../services/api';
import { useRouter } from 'expo-router';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  hideUserLink?: boolean;
}

export default function PostCard({ post, onPress, hideUserLink = false }: PostCardProps) {
  const router = useRouter();

  // By default, tapping a card goes to the post's detail view (its comments)
  const handlePress = onPress ? onPress : () => router.push(`/post/${post.id}`);

  // Navigate to User Profile
  const handleUserPress = () => {
    router.push(`/user/${post.userId}`);
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7} 
      onPress={handlePress}
    >
      <Text style={styles.title} numberOfLines={2}>{post.id}. {post.title}</Text>
      <Text style={styles.body} numberOfLines={3}>{post.body}</Text>
      
      <View style={styles.footer}>
        {!hideUserLink ? (
          <TouchableOpacity 
            style={styles.authorBadge}
            onPress={handleUserPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.authorText}>👤 User {post.userId}</Text>
          </TouchableOpacity>
        ) : <View />}

        <Text style={styles.actionText}>💬 View Comments</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4, 
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937', // Dark slate
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 15,
    color: '#4B5563', // Medium gray
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Subtle separator
  },
  authorBadge: {
    backgroundColor: '#EEF2FF', // Soft indigo background
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  authorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5', // Indigo text
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981', // Finance green
  }
});
