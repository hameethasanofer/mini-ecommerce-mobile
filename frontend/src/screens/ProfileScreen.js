import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  text: '#F1F5F9',
  subtext: '#64748B',
};

const ProfileScreen = () => {
  const menuItems = [
    { icon: 'person-outline', label: 'My Account' },
    { icon: 'receipt-outline', label: 'Order History' },
    { icon: 'location-outline', label: 'Shipping Address' },
    { icon: 'card-outline', label: 'Payment Methods' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'settings-outline', label: 'Settings' },
    { icon: 'help-circle-outline', label: 'Help Center' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={18} color={COLORS.accent} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[COLORS.accentDark + '40', COLORS.accent + '20']}
              style={styles.avatarWrap}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' }}
                style={styles.avatar}
              />
            </LinearGradient>
            <Text style={styles.userName}>Hameetha Sanofer</Text>
            <Text style={styles.userEmail}>hameethasanofer@gmail.com</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>5</Text>
                <Text style={styles.statLabel}>Wishlist</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>2</Text>
                <Text style={styles.statLabel}>Coupons</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuWrap}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon} size={20} color={COLORS.text} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  editBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, justifyContent: 'center', alignItems: 'center' },
  
  profileCard: { alignItems: 'center', paddingVertical: 20 },
  avatarWrap: { width: 110, height: 110, borderRadius: 55, padding: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 104, height: 104, borderRadius: 52, borderWidth: 4, borderColor: COLORS.bg },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.subtext, fontWeight: '500', marginBottom: 24 },
  
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 24, paddingVertical: 16, paddingHorizontal: 10, width: '85%', borderWidth: 1, borderColor: COLORS.cardBorder },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.subtext, fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, height: '60%', backgroundColor: COLORS.cardBorder, alignSelf: 'center' },
  
  menuWrap: { paddingHorizontal: 24, marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.cardBorder },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24, marginTop: 10, paddingVertical: 16, borderRadius: 20, backgroundColor: 'rgba(239,68,68,0.1)', gap: 8 },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
});

export default ProfileScreen;
