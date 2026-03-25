import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../components/ui/CustomButton';
import CustomInput from '../components/ui/CustomInput';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreatePost } from '../hooks/usePosts';

export default function AddPostScreen() {
  const router = useRouter();
  
  // React Query Mutation Hook for handling state and cache automatically
  const { mutateAsync: createPost, isPending } = useCreatePost();

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const handleAddPost = async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      Alert.alert('Validation Error', 'Please enter both a title and post content.');
      return;
    }

    Keyboard.dismiss();

    try {
      // Because we use React Query, the onSuccess callback in useCreatePost will 
      // automatically add this new post into the dashboard cache.
      await createPost({
        title: newTitle,
        body: newBody,
        userId: 1, // Simulated user ID
      });
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'Awesome!', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Failed to add post:", error);
      Alert.alert('Error', 'Could not add your post. Check connection.');
    }
  };

  return (
    <LinearGradient
      colors={['#1E3A8A', '#9333EA']} // Distinct vibrant gradient for the compose screen
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Draft a New Post</Text>
          
          <CustomInput 
            label="Post Title" 
            placeholder="E.g., 2026 Crypto Update" 
            value={newTitle}
            onChangeText={setNewTitle}
            containerStyle={styles.glassInput}
          />
          
          <CustomInput 
            label="Post Content" 
            placeholder="Share your financial thoughts..." 
            value={newBody}
            onChangeText={setNewBody}
            multiline
            containerStyle={styles.glassInput}
            style={{ height: 120, paddingTop: 12, paddingBottom: 12 }} 
          />
          
          <CustomButton 
            title="Publish" 
            onPress={handleAddPost} 
            isLoading={isPending}
            style={styles.addButton}
          />

          <CustomButton 
            title="Cancel" 
            onPress={() => router.back()} 
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center' },
  formContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassInput: { // Applying explicit overrides for this screen
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'transparent',
    height: 'auto',
  },
  addButton: {
    backgroundColor: '#10B981', 
    borderWidth: 0,
    marginTop: 20,
  },
  cancelButton: {
    borderWidth: 1.5,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});
