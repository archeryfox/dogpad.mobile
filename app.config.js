// dogpad.mobile/app.config.js
export default {
  expo: {
    name: "Dog-pad",
    slug: "dogpad",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: ["android.permission.RECORD_AUDIO"],
      package: "com.archeryfof.dogpad"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: ["expo-image-picker",  "expo-router"],
    scheme: "dogpad",
    owner: "archeryfox",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        "projectId": "117f6527-e668-432a-bf53-c138357889ac"
      }
    }
  }
};
