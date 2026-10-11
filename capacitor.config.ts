import { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.carbazar.app",
  appName: "CarBazar",
  webDir: "public",
  server: {
    url: "https://your-project.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
};
export default config;
