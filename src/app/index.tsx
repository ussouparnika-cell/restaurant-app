
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#D94B24',
  primaryDark: '#B93618',
  background: '#FFF9F3',
  white: '#FFFFFF',
  text: '#28221E',
  muted: '#81776F',
  border: '#F0E5DA',
  green: '#267747',
  cream: '#FBE8D6',
};

const categories = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Breakfast', emoji: '🥞' },
  { name: 'Meals', emoji: '🍛' },
  { name: 'Snacks', emoji: '🥟' },
  { name: 'Sweets', emoji: '🍮' },
  { name: 'Drinks', emoji: '🥤' },
];

const foods = [
  {
    id: '1',
    name: 'Hyderabadi Biryani',
    description: 'Aromatic rice & spices',
    price: 249,
    emoji: '🍛',
    category: 'Meals',
    tag: 'BESTSELLER',
    rating: '4.8',
  },
  {
    id: '2',
    name: 'Masala Dosa',
    description: 'Crispy dosa & chutneys',
    price: 129,
    emoji: '🥞',
    category: 'Breakfast',
    tag: 'POPULAR',
    rating: '4.7',
  },
  {
    id: '3',
    name: 'Samosa',
    description: 'Golden & crispy',
    price: 49,
    emoji: '🥟',
    category: 'Snacks',
    tag: '',
    rating: '4.6',
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    description: 'Soft, sweet & delicious',
    price: 89,
    emoji: '🍮',
    category: 'Sweets',
    tag: 'FAVOURITE',
    rating: '4.9',
  },
  {
    id: '5',
    name: 'Fresh Lime Soda',
    description: 'Refreshing citrus drink',
    price: 69,
    emoji: '🍋',
    category: 'Drinks',
    tag: '',
    rating: '4.5',
  },
  {
    id: '6',
    name: 'South Indian Meals',
    description: 'A wholesome traditional meal',
    price: 199,
    emoji: '🍱',
    category: 'Meals',
    tag: '',
    rating: '4.8',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        food.category === selectedCategory;

      const matchesSearch =
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const cartTotal = foods.reduce(
    (total, food) => total + food.price * (cart[food.id] || 0),
    0
  );

  const addToCart = (id: string) => {
    setCart((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((previous) => {
      const updated = { ...previous };
      if ((updated[id] || 0) <= 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  const openCart = () => {
    if (cartCount === 0) {
      Alert.alert('Your cart is empty', 'Add some delicious food first!');
      return;
    }

    const items = foods
      .filter((food) => cart[food.id])
      .map(
        (food) =>
          `${food.name} x ${cart[food.id]} — ₹${
            food.price * cart[food.id]
          }`
      )
      .join('\n');

    Alert.alert(
      'Your Cart',
      `${items}\n\nTotal: ₹${cartTotal}\n\nCheckout can be connected to your ordering backend.`,
      [{ text: 'Continue browsing', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>🍲</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Khaana Khajanaa</Text>
              <Text style={styles.brandSubtitle}>
                A treasure trove of flavours
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.cartButton}
            onPress={openCart}
            accessibilityLabel={`Open cart, ${cartCount} items`}
          >
            <Text style={styles.cartEmoji}>🛍️</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>📍</Text>
          <View>
            <Text style={styles.locationLabel}>DELIVERING TO</Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Delivery location',
                  'Connect your address selection or location service here.'
                )
              }
            >
              <Text style={styles.locationValue}>Your location  ⌄</Text>
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes, sweets, snacks..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Promotional banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerEyebrow}>A LITTLE TASTE OF HAPPINESS</Text>
            <Text style={styles.bannerTitle}>
              Cravings?{'\n'}We've got you!
            </Text>
            <Text style={styles.bannerSubtitle}>
              Discover flavours you'll love.
            </Text>
            <Pressable
              style={styles.bannerButton}
              onPress={() => {
                setSelectedCategory('All');
                setSearch('');
              }}
            >
              <Text style={styles.bannerButtonText}>Explore menu  →</Text>
            </Pressable>
          </View>

          <View style={styles.bannerIllustration}>
            <Text style={styles.bannerFood}>🍛</Text>
            <Text style={styles.bannerSparkle}>✦</Text>
            <Text style={styles.bannerLeaf}>🌿</Text>
          </View>
          <View style={styles.bannerCircle} />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Explore categories</Text>
            <Text style={styles.sectionSubtitle}>
              Something delicious for everyone
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category.name;

            return (
              <Pressable
                key={category.name}
                style={[
                  styles.categoryItem,
                  selected && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    selected && styles.categoryIconSelected,
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    selected && styles.categoryNameSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Popular dishes */}
        <View style={styles.foodSectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {search
                ? 'Search results'
                : selectedCategory === 'All'
                  ? 'Popular right now'
                  : selectedCategory}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredFoods.length} delicious options to explore
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
          >
            <Text style={styles.seeAll}>View all</Text>
          </Pressable>
        </View>

        {filteredFoods.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptyText}>
              Try a different search or category.
            </Text>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetButtonText}>Show all dishes</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.foodGrid}>
            {filteredFoods.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodImage}>
                  {food.tag !== '' && (
                    <View style={styles.foodTag}>
                      <Text style={styles.foodTagText}>{food.tag}</Text>
                    </View>
                  )}
                  <Text style={styles.foodEmoji}>{food.emoji}</Text>
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>★ {food.rating}</Text>
                  </View>
                </View>

                <View style={styles.foodInfo}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {food.name}
                  </Text>
                  <Text style={styles.foodDescription} numberOfLines={1}>
                    {food.description}
                  </Text>

                  <View style={styles.foodBottom}>
                    <Text style={styles.foodPrice}>₹{food.price}</Text>

                    {cart[food.id] ? (
                      <View style={styles.quantityControl}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => removeFromCart(food.id)}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.quantityText}>
                          {cart[food.id]}
                        </Text>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => addToCart(food.id)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.addButton}
                        onPress={() => addToCart(food.id)}
                        accessibilityLabel={`Add ${food.name} to cart`}
                      >
                        <Text style={styles.addButtonText}>+ Add</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerEmoji}>❤️</Text>
          <Text style={styles.footerTitle}>Good food, great memories.</Text>
          <Text style={styles.footerSubtitle}>
            Made with love, served with flavour.
          </Text>
        </View>
      </ScrollView>

      {/* Floating cart summary */}
      {cartCount > 0 && (
        <View style={styles.cartBarContainer}>
          <Pressable style={styles.cartBar} onPress={openCart}>
            <View style={styles.cartBarCount}>
              <Text style={styles.cartBarCountText}>{cartCount}</Text>
            </View>
            <View style={styles.cartBarInfo}>
              <Text style={styles.cartBarTitle}>View your cart</Text>
              <Text style={styles.cartBarSubtitle}>Ready when you are</Text>
            </View>
            <Text style={styles.cartBarTotal}>₹{cartTotal}  →</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 27,
  },
  brandName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartEmoji: {
    fontSize: 21,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  locationPin: {
    fontSize: 22,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: COLORS.muted,
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 3,
  },
  searchBox: {
    height: 53,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 23,
  },
  searchIcon: {
    fontSize: 27,
    color: COLORS.primary,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 10,
  },
  clearSearch: {
    fontSize: 16,
    color: COLORS.muted,
    padding: 5,
  },
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    minHeight: 215,
    padding: 21,
    marginBottom: 29,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
  },
  bannerContent: {
    flex: 1.2,
    zIndex: 2,
    justifyContent: 'center',
  },
  bannerEyebrow: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#FFE0C5',
    marginBottom: 10,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  bannerSubtitle: {
    color: '#FFE9D9',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 15,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
  },
  bannerButtonText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  bannerIllustration: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bannerFood: {
    fontSize: 83,
  },
  bannerSparkle: {
    position: 'absolute',
    top: 16,
    right: 6,
    fontSize: 27,
    color: '#FFE4B4',
  },
  bannerLeaf: {
    position: 'absolute',
    bottom: 10,
    left: 2,
    fontSize: 24,
  },
  bannerCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E86A3F',
    right: -37,
    top: 19,
  },
  sectionHeader: {
    marginBottom: 17,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  categoryList: {
    gap: 14,
    paddingBottom: 28,
  },
  categoryItem: {
    width: 73,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categorySelected: {
    backgroundColor: '#FFF0E6',
    borderColor: '#F3C5AC',
  },
  categoryIcon: {
    width: 53,
    height: 53,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIconSelected: {
    backgroundColor: '#FFE0CC',
    borderColor: '#F3C5AC',
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.muted,
  },
  categoryNameSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  foodSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '800',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  foodCard: {
    width: '48.2%',
    backgroundColor: COLORS.white,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foodImage: {
    height: 140,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  foodEmoji: {
    fontSize: 72,
  },
  foodTag: {
    position: 'absolute',
    top: 10,
    left: 9,
    backgroundColor: COLORS.green,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    zIndex: 1,
  },
  foodTagText: {
    color: COLORS.white,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  rating: {
    position: 'absolute',
    bottom: 9,
    right: 9,
    backgroundColor: COLORS.white,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },
  foodInfo: {
    padding: 11,
  },
  foodName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
  },
  foodDescription: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  foodBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
    gap: 3,
  },
  foodPrice: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: '#FFF0E6',
    borderWidth: 1,
    borderColor: '#F4C6AF',
  },
  addButtonText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '900',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0E6',
    borderRadius: 9,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  quantityButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 19,
  },
  quantityText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '800',
    minWidth: 10,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 15,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 12,
  },
  footerEmoji: {
    fontSize: 23,
    marginBottom: 8,
  },
  footerTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  footerSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  cartBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartBar: {
    minHeight: 62,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  cartBarCount: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#E96B43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarCountText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  cartBarInfo: {
    flex: 1,
  },
  cartBarTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  cartBarSubtitle: {
    color: '#FFE1D1',
    fontSize: 10,
    marginTop: 3,
  },
  cartBarTotal: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
});
