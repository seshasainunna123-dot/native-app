import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { useRouter } from '@react-navigation/native';
import { useUser, useUserPosts } from '@/hooks/useUsers';
import PostCard from '@/components/features/PostCard';

const CURRENT_USER_ID = 1;

type DetailRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color="#7DD3FC" />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUser(CURRENT_USER_ID);
  const { data: posts, isLoading: isPostsLoading, isError: isPostsError } = useUserPosts(CURRENT_USER_ID);

  const isLoading = isUserLoading || isPostsLoading;
  const isError = isUserError || isPostsError;
  const recentPosts = (posts ?? []).slice(0, 3);

  return (
    <LinearGradient colors={['#020617', '#0F172A', '#111827']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Your account snapshot</Text>
            </View>

            {user ? (
              <Pressable style={styles.ghostButton} onPress={() => navigation.push(`/user/${CURRENT_USER_ID}`)}>
                <Ionicons name="open-outline" size={16} color="#E2E8F0" />
                <Text style={styles.ghostButtonText}>Open</Text>
              </Pressable>
            ) : null}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#38BDF8" style={styles.loader} />
          ) : isError || !user ? (
            <View style={styles.messageCard}>
              <Ionicons name="alert-circle-outline" size={28} color="#FCA5A5" />
              <Text style={styles.messageTitle}>Unable to load profile</Text>
              <Text style={styles.messageBody}>Please try again in a moment.</Text>
            </View>
          ) : (
            <>
              <LinearGradient
                colors={['rgba(56,189,248,0.22)', 'rgba(14,165,233,0.08)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>

                <View style={styles.heroCopy}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userHandle}>@{user.username}</Text>
                  <Text style={styles.userBio}>
                    Keeping finances organized, automating the repetitive bits, and staying on top of every rupee.
                  </Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{posts?.length ?? 0}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Budgets</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Goals</Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Details</Text>
                <View style={styles.sectionCard}>
                  <DetailRow icon="mail-outline" label="Email" value={user.email} />
                  <DetailRow icon="call-outline" label="Phone" value={user.phone} />
                  <DetailRow icon="globe-outline" label="Website" value={user.website} />
                  <DetailRow icon="business-outline" label="Company" value={user.company.name} />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Highlights</Text>
                <View style={styles.highlightGrid}>
                  <View style={[styles.highlightCard, styles.highlightCardBlue]}>
                    <Ionicons name="sparkles-outline" size={22} color="#BFDBFE" />
                    <Text style={styles.highlightTitle}>AI Assistant</Text>
                    <Text style={styles.highlightBody}>Ready to help with budgets, savings, and planning.</Text>
                  </View>
                  <View style={[styles.highlightCard, styles.highlightCardGreen]}>
                    <Ionicons name="shield-checkmark-outline" size={22} color="#BBF7D0" />
                    <Text style={styles.highlightTitle}>Secure Data</Text>
                    <Text style={styles.highlightBody}>Your finance records stay local-first in this app.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Posts</Text>
                  <Pressable onPress={() => navigation.push(`/user/${CURRENT_USER_ID}`)}>
                    <Text style={styles.linkText}>View all</Text>
                  </Pressable>
                </View>

                {recentPosts.length === 0 ? (
                  <View style={styles.messageCard}>
                    <Ionicons name="document-text-outline" size={28} color="#60A5FA" />
                    <Text style={styles.messageTitle}>No posts yet</Text>
                    <Text style={styles.messageBody}>User activity will show up here once available.</Text>
                  </View>
                ) : (
                  recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} hideUserLink />
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#64748B',
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ghostButtonText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },
  loader: {
    marginTop: 48,
  },
  heroCard: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.22)',
    marginBottom: 20,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  heroCopy: {
    marginBottom: 18,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  userHandle: {
    fontSize: 14,
    color: '#BAE6FD',
    marginTop: 4,
  },
  userBio: {
    fontSize: 14,
    lineHeight: 22,
    color: '#CBD5E1',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  section: {
    marginTop: 4,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  sectionCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
    padding: 16,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56,189,248,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 3,
  },
  highlightGrid: {
    gap: 12,
  },
  highlightCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  highlightCardBlue: {
    backgroundColor: 'rgba(37,99,235,0.12)',
    borderColor: 'rgba(96,165,250,0.18)',
  },
  highlightCardGreen: {
    backgroundColor: 'rgba(22,163,74,0.12)',
    borderColor: 'rgba(74,222,128,0.18)',
  },
  highlightTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  highlightBody: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: '#CBD5E1',
  },
  linkText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  messageCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.12)',
  },
  messageTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  messageBody: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
