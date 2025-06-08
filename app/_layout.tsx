import "../global.css"
import "react-native-reanimated";
import {Stack} from "expo-router";
import {useFonts} from "expo-font";
import {SafeAreaProvider} from "react-native-safe-area-context";


export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        return null;
    }


    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </SafeAreaProvider>
    );
}
