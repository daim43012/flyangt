# FlyANGT Mobile — Design System

Перенос дизайн-системы с веб-приложения в React Native.

---

## 1. Цвета

```ts
// constants/colors.ts

export const Colors = {
  // Фоны
  bgMain:    '#F6F2EA',   // основной фон (кремовый)
  bgWhite:   '#FFFFFF',   // карточки, поля ввода
  bgDark:    '#0F172A',   // тёмные секции, glass-карточки

  // Текст
  textMain:  '#121416',   // основной текст
  textMuted: '#6E6A63',   // вторичный текст, лейблы
  textLight: '#FFFFFF',   // текст на тёмном фоне

  // Акцент (бронза)
  accent:      '#B08D57', // основной акцент
  accentDark:  '#7A5A2D', // hover / pressed
  accentLight: '#E6D2A8', // мягкий акцент, фоны тегов

  // Бордер
  borderSoft: 'rgba(18, 20, 22, 0.10)',
  borderAccent: 'rgba(176, 141, 87, 0.35)',

  // Статусы
  success: 'rgba(16, 185, 129, 0.95)',   // зелёный — onchain, paid
  successBg: 'rgba(16, 185, 129, 0.08)',
  info:    'rgba(59, 130, 246, 0.92)',    // синий — pending
  infoBg:  'rgba(59, 130, 246, 0.08)',
  danger:  'rgba(239, 68, 68, 0.85)',    // красный — error, failed
  dangerBg: 'rgba(239, 68, 68, 0.08)',
  warning: 'rgba(245, 158, 11, 0.90)',   // жёлтый — warning

  // Оверлей
  overlay: 'rgba(15, 23, 42, 0.55)',
  overlayLight: 'rgba(15, 23, 42, 0.04)',
} as const;
```

---

## 2. Шрифты

На мобилке Google Fonts не подключаются через CSS — использовать `expo-font`.

```ts
// constants/fonts.ts

export const Fonts = {
  heading: 'PlayfairDisplay_600SemiBold',  // заголовки
  body:    'Inter_400Regular',              // основной текст
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  bodyExtraBold: 'Inter_800ExtraBold',
} as const;
```

Установка:
```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/inter expo-font
```

```tsx
// app/_layout.tsx
import {
  PlayfairDisplay_600SemiBold,
  useFonts as usePlayfair,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

const [loaded] = usePlayfair({
  PlayfairDisplay_600SemiBold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
});
```

---

## 3. Типографика

```ts
// constants/typography.ts
import { Fonts } from './fonts';

export const Typography = {
  h1: {
    fontFamily: Fonts.heading,
    fontSize: 30,
    fontWeight: '600' as const,
    letterSpacing: -0.6,
    lineHeight: 36,
    color: '#121416',
  },
  h2: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    lineHeight: 30,
    color: '#121416',
  },
  h3: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
    lineHeight: 26,
    color: '#121416',
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 24,
    color: '#121416',
  },
  bodySmall: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: '#121416',
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: '#6E6A63',
  },
  mono: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#121416',
  },
} as const;
```

---

## 4. Spacing & Radius

```ts
// constants/spacing.ts

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,   // карточки
  full: 999,  // кнопки, теги, пилюли
} as const;
```

---

## 5. Тени

React Native не поддерживает `box-shadow` — используется `shadow*` (iOS) и `elevation` (Android).

```ts
// constants/shadows.ts

export const Shadows = {
  soft: {
    // iOS
    shadowColor: '#121416',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    // Android
    elevation: 4,
  },
  card: {
    shadowColor: '#121416',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 30,
    elevation: 6,
  },
  strong: {
    shadowColor: '#121416',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 50,
    elevation: 10,
  },
} as const;
```

---

## 6. Кнопки

```tsx
// components/ui/Button.tsx
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Fonts } from '@/constants';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // Primary — bronze gradient (LinearGradient)
  primary: {
    backgroundColor: Colors.accent,  // заменить на LinearGradient
    borderWidth: 1,
    borderColor: 'rgba(122, 90, 45, 0.35)',
    shadowColor: '#121416',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  primaryLabel: {
    color: '#1B140B',
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },

  // Secondary — white with bronze border
  secondary: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    shadowColor: '#121416',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  secondaryLabel: {
    color: Colors.textMain,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },

  // Ghost
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostLabel: {
    color: Colors.textMain,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },

  disabled: {
    opacity: 0.5,
  },
  label: {},
});
```

> Для `primary` кнопки использовать `expo-linear-gradient`:
```bash
npx expo install expo-linear-gradient
```
```tsx
import { LinearGradient } from 'expo-linear-gradient';
// colors={['#E7D3AA', '#B08D57', '#7A5A2D']}
```

---

## 7. Карточки

```tsx
// components/ui/Card.tsx
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows } from '@/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'white' | 'dark';
}

export function Card({ children, style, variant = 'white' }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,      // 20px
    padding: 20,
    ...Shadows.card,
  },
  white: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
  },
  dark: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
```

---

## 8. Input (поле ввода)

```tsx
// components/ui/Input.tsx
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Radius, Fonts } from '@/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    backgroundColor: Colors.bgWhite,
    paddingHorizontal: 16,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMain,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.danger,
  },
});
```

---

## 9. Теги / Badge

```tsx
// components/ui/Badge.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Fonts } from '@/constants';

type BadgeVariant = 'accent' | 'success' | 'info' | 'danger' | 'muted';

export function Badge({ label, variant = 'accent' }: { label: string; variant?: BadgeVariant }) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  accent:     { backgroundColor: 'rgba(176, 141, 87, 0.10)' },
  accentText: { color: Colors.accentDark },
  success:     { backgroundColor: Colors.successBg },
  successText: { color: Colors.success },
  info:        { backgroundColor: Colors.infoBg },
  infoText:    { color: Colors.info },
  danger:      { backgroundColor: Colors.dangerBg },
  dangerText:  { color: Colors.danger },
  muted:       { backgroundColor: 'rgba(15, 23, 42, 0.06)' },
  mutedText:   { color: Colors.textMuted },
});
```

---

## 10. Анимации

Стандартные transition в вебе = React Native Animated / Reanimated.

```bash
npx expo install react-native-reanimated
```

```ts
// constants/animation.ts

export const Animation = {
  duration: 350,   // стандарт (0.35s как в CSS)
  durationFast: 160,
  easing: 'easeOut',

  // press: translateY(-2px) аналог
  pressScale: 0.97,
  hoverOffset: -2,
} as const;
```

Использование для press-анимации:
```tsx
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring
} from 'react-native-reanimated';

const scale = useSharedValue(1);
const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}));

<Animated.View style={animStyle}>
  <Pressable
    onPressIn={() => { scale.value = withTiming(0.97, { duration: 120 }) }}
    onPressOut={() => { scale.value = withSpring(1) }}
  />
</Animated.View>
```

---

## 11. Структура констант

```
constants/
  colors.ts
  fonts.ts
  typography.ts
  spacing.ts
  shadows.ts
  animation.ts
  addresses.ts    ← контракты Polygon
  index.ts        ← re-export всего
```

```ts
// constants/index.ts
export * from './colors';
export * from './fonts';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animation';
export * from './addresses';
```

---

## 12. Тёмные карточки (glass-морфизм)

В вебе используется `backdrop-filter: blur(20px)`. В React Native нет нативной поддержки — использовать `@react-native-community/blur`:

```bash
npx expo install @react-native-community/blur
```

```tsx
import { BlurView } from '@react-native-community/blur';

<BlurView
  style={styles.glass}
  blurType="dark"
  blurAmount={20}
>
  {children}
</BlurView>

const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  }
});
```
