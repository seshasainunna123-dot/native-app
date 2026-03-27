import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { useRouter } from '@react-navigation/native';
import CustomButton from '../components/ui/CustomButton';

export default function AddEMIScreen() {
  const navigation = useNavigation<any>();
  
  return (
    <LinearGradient colors={['#0F172A', '#020617']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Add EMI</Text>
          <Text style={styles.subtitle}>Feature coming soon...</Text>
          <CustomButton 
            title="Go Back" 
            onPress={() => navigation.back()} 
            style={styles.btn} 
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  btn: {
    width: 200,
  }
});
