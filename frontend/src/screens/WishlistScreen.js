import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';
import { addToCart } from '../services/api';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  text: '#F1F5F9',
  subtext: '#64748B',
};

const WishlistScreen = ({ navigation }) => {
  const { wishlist } = useWishlist();
  const toastRef = useRef(null);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toastRef.current?.show('Added to cart! 🛍️', 'success');
    } catch {
      toastRef.current?.show('Failed to add to cart', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Wishlist</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{wishlist.length}</Text>
          </View>
        </View>

        {wishlist.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.emptyWrap}>
            <LinearGradient
              colors={['rgba(239,68,68,0.15)', 'rgba(239,68,68,0.05)']}
              style={styles.emptyIcon}
            >
              <Ionicons name="heart-outline" size={56} color="#EF4444" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the ♡ on any product to save it here
            </Text>
            <TouchableOpacity
              style={{ borderRadius: 20, overflow: 'hidden', marginTop: 16 }}
              onPress={() => navigation.navigate('Home')}
            >
              <LinearGradient
                colors={[COLORS.accentDark, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shopBtn}
              >
                <Text style={styles.shopBtnText}>Discover Products</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.subtitle}>
                {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
              </Text>
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
                onAddToCart={handleAddToCart}
              />
            )}
          />
        )}
      </SafeAreaView>
      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, flex: 1 },
  countBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  countText: { color: '#EF4444', fontWeight: '800', fontSize: 13 },

  subtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  row: { justifyContent: 'space-between' },

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    gap: 8,
  },
  shopBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});

export default WishlistScreen;
