import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

const DUMMY_RESPONSES = [
  "That's an interesting perspective on your finances!",
  "I'm here to help you manage your WealthFlow effectively.",
  "Could you elaborate on that?",
  "Based on your recent transactions, everything looks on track.",
  "I'm just a dummy AI, but I think you're doing great!",
  "Let me analyze that for a second... Alright, looks good.",
  "Is there anything else you need assistance with?",
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am your WealthFlow assistant. How can I help you today?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate system AI analyzing before streaming
    setTimeout(() => {
      const randomResponse = DUMMY_RESPONSES[Math.floor(Math.random() * DUMMY_RESPONSES.length)];
      const systemMessageId = (Date.now() + 1).toString();
      
      // Start with an empty message bubble to begin streaming
      setMessages((prev) => [...prev, { id: systemMessageId, text: '', isUser: false }]);
      setIsTyping(false);
      
      // Stream characters one by one
      let i = 0;
      const interval = setInterval(() => {
        setMessages((prev) => 
          prev.map((msg) =>
            msg.id === systemMessageId ? { ...msg, text: randomResponse.slice(0, i + 1) } : msg
          )
        );
        i++;
        if (i >= randomResponse.length) clearInterval(interval);
      }, 25); // 25ms delay per character
    }, 1000 + Math.random() * 800); // 1-1.8s thinking delay
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [messages, isTyping]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.isUser;
    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperSystem]}>
        <LinearGradient
          colors={isUser ? ['#10B981', '#059669'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleSystem]}
        >
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextSystem]}>
            {item.text}
            {!isUser && item.text.length > 0 && item.text.length < DUMMY_RESPONSES.find(r => r.startsWith(item.text))?.length! ? '▋' : ''}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#0F172A']} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#F1F5F9" />
            </Pressable>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Assistant</Text>
              <Text style={styles.headerSubtitle}>AI Support</Text>
            </View>
            <View style={styles.headerRight} />
          </View>

          {/* Chat List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {isTyping && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          )}

          {/* Input Area */}
          <View style={[styles.inputContainer, { paddingBottom: keyboardHeight > 0 ? 12 : Math.max(Platform.OS === 'ios' ? insets.bottom : 0, 12) }]}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#64748B"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
              />
              <Pressable 
                onPress={sendMessage} 
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                disabled={!input.trim()}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  messageWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  messageWrapperUser: {
    justifyContent: 'flex-end',
  },
  messageWrapperSystem: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleUser: {
    borderBottomRightRadius: 4,
  },
  messageBubbleSystem: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextSystem: {
    color: '#E2E8F0',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  typingText: {
    color: '#64748B',
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 50,
  },
  input: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(16,185,129,0.3)',
  },
});
