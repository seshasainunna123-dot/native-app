import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser, useUserPosts } from '../../hooks/useUsers';
import CustomButton from '../../components/ui/CustomButton';
import PostCard from '../../components/features/PostCard';
import { Post } from '../../services/api';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Number(id);

  const { data: user, isLoading: isUserLoading } = useUser(userId);
  const { data: posts, isLoading: isPostsLoading } = useUserPosts(userId);

  return (
    <LinearGradient colors={['#10B981', '#1E3A8A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <CustomButton 
            title="← Back" 
            onPress={() => router.back()} 
            style={styles.backButton}
            textStyle={{ color: '#FFFFFF', fontSize: 14 }}
            variant="secondary"
          />
          <Text style={styles.headerTitle}>User Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        {isUserLoading || isPostsLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 40 }} />
        ) : !user ? (
          <Text style={styles.errorText}>User not found.</Text>
        ) : (
          <FlatList
            // User Meta Info as header
            ListHeaderComponent={
              <View style={styles.profileSection}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHandle}>@{user.username}</Text>
                
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>✉️ {user.email}</Text>
                  <Text style={styles.infoText}>🌐 {user.website}</Text>
                  <Text style={styles.infoText}>🏢 {user.company.name}</Text>
                </View>

                <Text style={styles.postsLabel}>
                  Author's Posts ({posts?.length ?? 0})
                </Text>
              </View>
            }
            data={posts}
            keyExtractor={p => p.id.toString()}
            renderItem={({ item }) => (
              // Reuse our PostCard, but hide the author link to prevent endless nesting loops
              <PostCard post={item} hideUserLink={true} />
            )}
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userHandle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  postsLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  errorText: {
    color: '#FCA5A5',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
  }
});
