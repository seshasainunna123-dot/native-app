import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import CustomInput from '@/components/ui/CustomInput';
import CustomButton from '@/components/ui/CustomButton';
import { getDB } from '@/services/database';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Splash animations
  const logoY = useRef(new Animated.Value(160)).current;
  const logoScale = useRef(new Animated.Value(1.4)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize DB in the background
    getDB().catch(console.error);

    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.spring(logoY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(textOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(formOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleLogin = () => {
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <LinearGradient
      colors={['#020617', '#0F172A', '#1E1B4B']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative blobs */}
      <View style={[styles.blob, { top: -80, right: -80, backgroundColor: '#10B98140' }]} />
      <View style={[styles.blob, { bottom: 100, left: -100, backgroundColor: '#8B5CF620', width: 300, height: 300 }]} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* Animated Logo */}
              <Animated.View
                style={[
                  styles.header,
                  { transform: [{ translateY: logoY }, { scale: logoScale }] },
                ]}
              >
                <View style={styles.logoRing}>
                  <View style={styles.logoInner}>
                    <Image
                      source="sf:indianrupeesign.circle.fill"
                      style={{ width: 42, height: 42, tintColor: '#10B981' }}
                      contentFit="contain"
                    />
                  </View>
                </View>
                <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
                  <Text style={styles.title}>WealthFlow</Text>
                  <Text style={styles.subtitle}>Track. Plan. Prosper.</Text>
                </Animated.View>
              </Animated.View>

              {/* Glassmorphic Form */}
              <Animated.View style={[styles.glass, { opacity: formOpacity }]}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to continue</Text>

                <View style={{ gap: 8, marginTop: 20 }}>
                  <CustomInput
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={emailError}
                    containerStyle={styles.input}
                  />
                  <CustomInput
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.forgotPw}>Forgot Password?</Text>

                <View style={{ gap: 10, marginTop: 4 }}>
                  <CustomButton
                    title="Sign In"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    style={styles.primaryBtn}
                  />
                  <CustomButton
                    title="Create Account"
                    variant="secondary"
                    onPress={() => {}}
                    style={styles.secondaryBtn}
                    textStyle={{ color: '#94A3B8' }}
                  />
                </View>
              </Animated.View>

              <Animated.Text style={[styles.footerText, { opacity: formOpacity }]}>
                Your data stays private & on-device 🔒
              </Animated.Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  kav: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', gap: 28 },
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  header: { alignItems: 'center', gap: 16 },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.35)',
    boxShadow: '0 0 40px rgba(16,185,129,0.3)',
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16,185,129,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#F1F5F9' },
  formSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' },
  forgotPw: {
    color: '#10B981',
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: '#10B981',
    borderWidth: 0,
    boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  footerText: {
    textAlign: 'center',
    color: '#334155',
    fontSize: 12,
  },
});
