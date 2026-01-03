# 📱 PWA Installation Guide - Zyfter

Your Zyfter app is now a **Progressive Web App (PWA)** that can be installed on any device for a native app-like experience!

## ✨ PWA Features

### 🚀 Installation
- **Add to Home Screen** on iOS and Android
- Works like a native app with its own icon
- Launches in fullscreen (no browser UI)
- Appears in your app drawer/home screen

### 📡 Offline Support
- Works without internet connection
- All workout data stored locally
- Service worker caches app assets
- Automatic updates when online

### 💾 Data Persistence
- Persistent storage requested automatically
- Your workout data won't be deleted
- LocalStorage backup with IndexedDB fallback
- Export/import functionality for backups

### 🎨 Mobile Optimizations
- Optimized for one-hand operation
- Safe area support for notched devices
- iOS status bar integration
- Android theme color support

## 📲 How to Install

### On iPhone/iPad (iOS/iPadOS)

1. Open the app in **Safari** (must use Safari, not Chrome)
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right
5. The app icon will appear on your home screen

### On Android (Chrome/Edge)

1. Open the app in **Chrome** or **Edge**
2. Tap the **menu** (three dots) in the top right
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Tap **"Install"** in the popup
5. The app will be added to your app drawer

**Alternatively:** Look for the install prompt banner at the bottom of the screen and tap "Install"

### On Desktop (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Look for the **install icon** (⊕) in the address bar
3. Click it and then click **"Install"**
4. The app will open in its own window

## 🛠️ Technical Details

### Service Worker
- Caches critical assets for offline use
- Runtime caching for JavaScript and CSS
- Network-first strategy for fresh data
- Automatic cache updates

### Manifest
- App name: "Zyfter - Workout Logger"
- Theme color: Emerald (#10b981)
- Background: Dark (#09090b)
- Display mode: Standalone
- Orientation: Portrait

### Storage
- **LocalStorage**: Primary storage for workout data and settings
- **Cache API**: Stores app assets and resources
- **Persistent Storage**: Requested to prevent data deletion
- **Export Feature**: JSON backup of all data

## 📊 Storage Limits

- **Chrome/Edge**: ~60% of disk space
- **Firefox**: ~2GB
- **Safari**: ~1GB
- Persistent storage prevents automatic cleanup

## 🔄 Updates

The app automatically checks for updates:
- Every minute while open
- Whenever you reopen the app
- Automatically downloads in background
- Refresh page to get latest version

## 🧪 Testing PWA Features

### Check Installation Status
```javascript
// In browser console
window.matchMedia('(display-mode: standalone)').matches
// Returns true if installed as PWA
```

### View Service Worker
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** to see status

### Check Cache
1. Open DevTools (F12)
2. Go to **Application** > **Cache Storage**
3. Expand to see cached files

### Test Offline
1. Open DevTools (F12)
2. Go to **Network** tab
3. Check **Offline** checkbox
4. Reload and verify app works

## 🔐 Privacy & Data

- **All data stored locally** on your device
- No data sent to external servers
- No tracking or analytics
- Export your data anytime via Settings

## 🐛 Troubleshooting

### App not installing?
- Ensure you're using HTTPS (required for PWA)
- Clear browser cache and try again
- Try a different browser
- Check that service worker registered successfully

### Offline mode not working?
- Ensure service worker is active (check DevTools)
- Try refreshing the page once online
- Clear cache and reinstall if needed

### Data not persisting?
- Check browser storage settings
- Don't use private/incognito mode
- Export data regularly as backup
- Check storage quota in DevTools

### iOS-specific issues
- Must use Safari browser for installation
- Clear Safari cache if issues persist
- Check Settings > Safari > Advanced > Website Data

## 📱 Platform-Specific Features

### iOS
- Status bar matches app theme
- Home screen icon with rounded corners
- Splash screen on launch
- Swipe gestures work natively

### Android
- Dynamic theme color in task switcher
- Install prompt with preview
- Share target integration ready
- Notification support ready

## 🚀 Future Enhancements

Potential PWA features to add:
- [ ] Background sync for multi-device support
- [ ] Push notifications for workout reminders
- [ ] Share target (share from other apps)
- [ ] File handling for importing workouts
- [ ] Shortcuts to specific screens
- [ ] Badge API for workout streaks

## 📖 Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [Can I Use - PWA](https://caniuse.com/?search=pwa)

---

**Built with ❤️ for gym enthusiasts**

Need help? Check the Settings screen for data export/import options.
