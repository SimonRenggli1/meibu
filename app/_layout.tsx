import "../global.css"
import "react-native-reanimated";
import {Stack} from "expo-router";
import {useFonts} from "expo-font";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {UserInactivityProvider} from "@/components/UserInactivity";


export default function RootLayout() {
    const [loaded] = useFonts({
        Oddlini: require("../assets/fonts/oddlini-regular.ttf"),
    });

    if (!loaded) {
        return null;
    }

    return (
        <UserInactivityProvider>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
            </SafeAreaProvider>
        </UserInactivityProvider>
    );
}
