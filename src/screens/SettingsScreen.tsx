import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/ui/CustomButton';
import PostCard from '@/components/features/PostCard';
import { LinearGradient } from 'react-native-linear-gradient';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/services/api';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();


  // Advanced data fetching using React Query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError
  } = usePosts();

  // React Query stores infinite queries as an array of 'pages' (arrays)
  // We flatten them into a single array for the FlatList
  const posts = data?.pages.flat() ?? [];

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  };

  return (
    <LinearGradient colors={['#1E3A8A', '#10B981']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>API Integration (Legacy Feed)</Text>
          <View style={styles.headerActions}>
            <CustomButton 
              title="Compose" 
              onPress={() => navigation.navigate('AddPost')} 
              style={styles.headerButton}
              textStyle={{ fontSize: 13 }}
            />
          </View>
        </View>

        {/* Feed */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          ) : isError ? (
            <Text style={styles.errorText}>Failed to load posts. Please try again.</Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString() + Math.random().toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              
              // React Query Infinite Scroll Integration
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}         
              onEndReachedThreshold={0.5} 
              ListFooterComponent={renderFooter}
            />
          )}
        </View>

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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 80,
    height: 36,
    marginVertical: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FCA5A5',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});
