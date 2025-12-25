# iOS App Build Guide

## Important: You Need a Mac

To build an iOS app, you **must have**:
- A Mac computer (macOS)
- Xcode installed (free from App Store)
- Apple Developer Account ($99/year to publish to App Store)

## Steps to Create iOS App

### 1. On Your Windows PC (Prepare the project)

Already done! Your project is ready.

### 2. On a Mac Computer

#### Install Dependencies
```bash
# Install Xcode from App Store first

# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install Capacitor iOS
npm install @capacitor/ios
```

#### Initialize iOS Project
```bash
# Build your web app
npm run build

# Add iOS platform
npx cap add ios

# Sync files to iOS
npx cap sync ios
```

#### Open in Xcode
```bash
npx cap open ios
```

This opens Xcode with your iOS project.

#### Configure in Xcode
1. Select your project in the left sidebar
2. Under "Signing & Capabilities":
   - Select your Team (Apple Developer Account)
   - Change Bundle Identifier if needed
3. Add app icon:
   - Click "AppIcon" in Assets
   - Drag your icon images (various sizes needed)

#### Build & Run
1. Select a simulator or connected iPhone
2. Click the Play button (▶️) in Xcode
3. Your app will build and run!

#### Publish to App Store
1. In Xcode: Product → Archive
2. Follow the upload wizard
3. Submit for review in App Store Connect

## Alternative: Use a Mac Build Service

If you don't have a Mac, you can use:
- **Expo EAS Build** (https://expo.dev/eas)
- **Ionic Appflow** (https://ionic.io/appflow)
- **Codemagic** (https://codemagic.io)

These services build iOS apps in the cloud without needing a Mac.

## Quick Alternative: Progressive Web App (PWA)

Your app already works on iOS Safari! Users can:
1. Visit your website on iPhone
2. Tap Share button
3. Tap "Add to Home Screen"
4. App appears like a native app!

No Mac or App Store needed for PWA.
