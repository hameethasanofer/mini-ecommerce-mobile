import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/api';

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  gold: '#F59E0B',
  danger: '#EF4444',
  text: '#F1F5F9',
  subtext: '#64748B',
};

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.cart);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQty = async (id, qty) => {
    const data = await updateCartItem(id, qty);
    setCartItems(data.cart);
    setTotal(data.total);
  };

  const handleRemove = async (id) => {
    const data = await removeFromCart(id);
    setCartItems(data.cart);
    setTotal(data.total);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartCard}>
      <Image source={{ uri: item.image }} style={styles.itemImg} />
      <View style={styles.itemMeta}>
        <View style={styles.itemTop}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleRemove(item.cartItemId)}>
            <View style={styles.removeBtn}>
              <Ionicons name="close" size={14} color={COLORS.danger} />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemSub}>{item.color} · {item.size}</Text>
        <View style={styles.itemBottom}>
          <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.cartItemId, item.quantity - 1)}>
              <Ionicons name="remove" size={14} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.qtyVal}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.cartItemId, item.quantity + 1)}>
              <Ionicons name="add" size={14} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity onPress={() => clearCart().then(fetchCart)}>
            <Text style={styles.clearBtn}>Clear all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <LinearGradient colors={[COLORS.accentDark + '30', COLORS.accent + '10']} style={styles.emptyIcon}>
              <Ionicons name="bag-outline" size={56} color={COLORS.accent} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add items to get started</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.shopNowBtn}>
              <LinearGradient colors={[COLORS.accentDark, COLORS.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shopNowGrad}>
                <Text style={styles.shopNowText}>Explore Products</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
               keyExtractor={(item) => item.cartItemId}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => { setRefreshing(true); fetchCart(); }}
                  tintColor={COLORS.accent}
                  colors={[COLORS.accent]}
                />
              }
            />

            {/* Summary */}
            <View style={styles.summaryPanel}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>FREE</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={{ borderRadius: 20, overflow: 'hidden', marginTop: 16 }}>
                <LinearGradient
                  colors={[COLORS.accentDark, COLORS.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutBtn}
                >
                  <Text style={styles.checkoutText}>Checkout</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  clearBtn: { fontSize: 13, color: COLORS.danger, fontWeight: '600' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  listContent: { paddingHorizontal: 20, paddingBottom: 16, gap: 14 },

  cartCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 20, borderWidth: 1, borderColor: COLORS.cardBorder, padding: 14, gap: 14 },
  itemImg: { width: 85, height: 85, borderRadius: 14, backgroundColor: '#1E1E30' },
  itemMeta: { flex: 1, justifyContent: 'space-between' },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  removeBtn: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)', justifyContent: 'center', alignItems: 'center' },
  itemSub: { fontSize: 12, color: COLORS.subtext, fontWeight: '500' },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E30', borderRadius: 12, padding: 4, gap: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 9, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center' },
  qtyVal: { fontSize: 14, fontWeight: '800', color: COLORS.text, minWidth: 22, textAlign: 'center' },

  summaryPanel: { backgroundColor: COLORS.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: COLORS.cardBorder, paddingHorizontal: 24, paddingTop: 22, paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryLabel: { fontSize: 14, color: COLORS.subtext, fontWeight: '500' },
  summaryVal: { fontSize: 14, color: COLORS.text, fontWeight: '700' },
  freeBadge: { backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  freeBadgeText: { color: '#10B981', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: COLORS.cardBorder, marginBottom: 14 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  totalVal: { fontSize: 24, fontWeight: '900', color: COLORS.accent },
  checkoutBtn: { height: 58, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  checkoutText: { fontSize: 16, fontWeight: '800', color: '#FFF' },

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 14 },
  emptyIcon: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.subtext, textAlign: 'center' },
  shopNowBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  shopNowGrad: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14, gap: 8 },
  shopNowText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});

export default CartScreen;
