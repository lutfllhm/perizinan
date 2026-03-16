# Components Documentation

## Animation & Interactive Components

### LoadingScreen.jsx
**Purpose:** Full-screen loading animation yang muncul saat pertama kali masuk homepage.

**Props:**
- `onLoadingComplete` (function) - Callback yang dipanggil setelah loading selesai

**Features:**
- Progress bar 0-100%
- Logo IWARE dengan spring animation
- Animated dots indicator
- Smooth fade out transition

**Usage:**
```jsx
<LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
```

---

### FloatingParticles.jsx
**Purpose:** Partikel-partikel mengambang di background untuk efek visual yang menarik.

**Props:**
- `count` (number, default: 50) - Jumlah partikel

**Features:**
- Random positioning
- Fade in/out animation
- Floating movement
- Performance optimized

**Usage:**
```jsx
<FloatingParticles count={30} />
```

**Note:** Automatically disabled di mobile untuk performa.

---

### InteractiveBackground.jsx
**Purpose:** Background gradient yang mengikuti posisi mouse untuk interaksi yang engaging.

**Props:** None

**Features:**
- Mouse tracking
- Dual layer gradient
- Spring animation
- Smooth transitions

**Usage:**
```jsx
<InteractiveBackground />
```

**Note:** Automatically disabled di mobile.

---

### ScrollProgress.jsx
**Purpose:** Progress bar di top yang menunjukkan posisi scroll user.

**Props:** None

**Features:**
- Gradient color (blue → purple → pink)
- Spring physics
- Fixed position
- Smooth scaling

**Usage:**
```jsx
<ScrollProgress />
```

---

### WelcomeToast.jsx
**Purpose:** Toast notification yang menyambut user setelah loading selesai.

**Props:** None

**Features:**
- Auto show setelah 1.5s
- Auto dismiss setelah 6s
- Manual close button
- Wave emoji animation
- Smooth entrance/exit

**Usage:**
```jsx
<WelcomeToast />
```

---

### Card3D.jsx
**Purpose:** Wrapper component yang memberikan efek 3D tilt pada card saat hover.

**Props:**
- `children` (ReactNode) - Content di dalam card
- `className` (string) - Additional CSS classes

**Features:**
- Mouse tracking
- 3D perspective transform
- Spring animation
- Smooth reset

**Usage:**
```jsx
<Card3D className="bg-white p-6 rounded-lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card3D>
```

**Note:** Effect hanya aktif di desktop.

---

### TypingAnimation.jsx
**Purpose:** Text yang muncul dengan efek typing/ketik.

**Props:**
- `text` (string, required) - Text yang akan ditampilkan
- `speed` (number, default: 100) - Kecepatan typing dalam ms
- `className` (string) - Additional CSS classes

**Features:**
- Character-by-character reveal
- Blinking cursor
- Customizable speed

**Usage:**
```jsx
<TypingAnimation 
  text="Cuti & Lembur" 
  speed={80}
  className="text-4xl font-bold"
/>
```

---

### AnimatedCounter.jsx
**Purpose:** Angka yang count up dengan smooth animation.

**Props:**
- `value` (number, required) - Target value
- `duration` (number, default: 2) - Animation duration dalam detik
- `suffix` (string, default: '') - Text setelah angka (e.g., '+', '%')

**Features:**
- Smooth counting animation
- Framer Motion powered
- Customizable duration
- Optional suffix

**Usage:**
```jsx
<AnimatedCounter value={100} duration={2} suffix="+" />
```

---

## Existing Components

### Navbar.jsx
Navigation bar component dengan responsive design.

### BottomNavigation.jsx
Bottom navigation untuk mobile view.

### CharacterAnimation.jsx
Animated character illustrations untuk berbagai tipe cuti.

### ImageModal.jsx
Modal untuk menampilkan gambar full screen.

### LazyImage.jsx
Image component dengan lazy loading.

### LoadingSpinner.jsx
Simple loading spinner component.

### MobileCard.jsx
Card component optimized untuk mobile.

### MobileDemo.jsx
Demo component untuk mobile view.

### MobileDrawer.jsx
Drawer/sidebar untuk mobile.

### PrivateRoute.jsx
Route protection component untuk authenticated routes.

### PullToRefresh.jsx
Pull to refresh functionality untuk mobile.

### ResponsiveTable.jsx
Table component yang responsive.

### SkeletonLoader.jsx
Skeleton loading placeholder.

### SwipeableCard.jsx
Card dengan swipe gesture support.

### TouchButton.jsx
Button optimized untuk touch interaction.

---

## Best Practices

### Performance
1. Gunakan conditional rendering untuk animasi berat di mobile
2. Implement lazy loading untuk komponen yang tidak immediately visible
3. Use `useMemo` dan `useCallback` untuk expensive computations
4. Minimize re-renders dengan proper state management

### Accessibility
1. Semua interactive elements harus keyboard accessible
2. Provide proper ARIA labels
3. Respect `prefers-reduced-motion` setting
4. Maintain proper color contrast

### Mobile Optimization
1. Disable heavy animations di mobile
2. Use touch-friendly sizes (min 44x44px)
3. Optimize images dan assets
4. Test di berbagai device sizes

### Animation Guidelines
1. Keep animations under 300ms untuk UI feedback
2. Use spring physics untuk natural movement
3. Provide loading states untuk async operations
4. Avoid animation overload - less is more

---

## Dependencies

All components use:
- `react` - Core library
- `framer-motion` - Animation library
- `react-router-dom` - Routing (where applicable)
- Tailwind CSS - Styling

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (dengan webkit prefixes)
- Mobile browsers: ✅ Optimized version

---

## Contributing

Saat menambahkan komponen baru:
1. Follow naming convention (PascalCase)
2. Add PropTypes atau TypeScript types
3. Include JSDoc comments
4. Add to this documentation
5. Test di mobile dan desktop
6. Check accessibility
7. Optimize performance
