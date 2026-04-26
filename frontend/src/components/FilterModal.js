import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const COLORS = {
  bg: '#0A0A12',
  card: '#13131F',
  cardBorder: '#1E1E30',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  text: '#F1F5F9',
  subtext: '#64748B',
};

const FilterModal = ({ visible, onClose, onApply, currentFilters }) => {
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange || 'All');
  const [brand, setBrand] = useState(currentFilters.brand || 'All');

  const prices = ['All', '$0 - $50', '$50 - $150', '$150 - $300', '$300+'];
  const brands = ['All', "Arc'teryx", 'Nike', 'Apple', 'Sony', 'Bellroy', 'Peak Design', 'Common Projects'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.chipRow}>
              {prices.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, priceRange === p && styles.chipActive]}
                  onPress={() => setPriceRange(p)}
                >
                  <Text style={[styles.chipText, priceRange === p && styles.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Brands</Text>
            <View style={styles.chipRow}>
              {brands.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.chip, brand === b && styles.chipActive]}
                  onPress={() => setBrand(b)}
                >
                  <Text style={[styles.chipText, brand === b && styles.chipTextActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={() => { setPriceRange('All'); setBrand('All'); }}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtnWrap} onPress={() => onApply({ priceRange, brand })}>
              <LinearGradient
                colors={[COLORS.accentDark, COLORS.accent]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.applyBtn}
              >
                <Text style={styles.applyText}>Apply Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  content: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.8,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  scroll: { padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16, marginTop: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,58,237,0.1)' },
  chipText: { fontSize: 14, fontWeight: '600', color: COLORS.subtext },
  chipTextActive: { color: COLORS.accent },
  footer: {
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  resetBtn: { flex: 1, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  resetText: { fontSize: 16, fontWeight: '700', color: COLORS.subtext },
  applyBtnWrap: { flex: 2, height: 56, borderRadius: 18, overflow: 'hidden' },
  applyBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  applyText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
});

export default FilterModal;
