import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserInactivityProvider } from "@/components/UserInactivity";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

export default function RootLayout() {
    const [loaded] = useFonts({
        Oddlini: require("../assets/fonts/oddlini-regular.ttf"),
    });

    return (
        <AuthProvider>
            <UserInactivityProvider>
                <SafeAreaProvider>
                    <AuthGuard>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="lock" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </AuthGuard>
                </SafeAreaProvider>
            </UserInactivityProvider>
        </AuthProvider>
    );
}
