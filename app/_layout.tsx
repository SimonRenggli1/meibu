import "../global.css";
import "react-native-reanimated";
import {Stack} from "expo-router";
import {useFonts} from "expo-font";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {UserInactivityProvider} from "@/components/UserInactivity";
import {AuthProvider} from "@/contexts/AuthContext";
import {AuthGuard} from "@/components/AuthGuard";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BudgetProvider} from '@/contexts/BudgetContext';
import {StyleSheet} from "react-native";


export default function RootLayout() {
    const [loaded] = useFonts({
        Oddlini: require("../assets/fonts/oddlini-regular.ttf"),
    });

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <AuthProvider>
                    <BudgetProvider>
                        <UserInactivityProvider>
                            <AuthGuard>
                                <Stack>
                                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                    <Stack.Screen name="category-settings/[category]" options={{title:"", headerShown: true}}/>
                                    <Stack.Screen name="edit-income" options={{title:"", headerShown: true}}/>
                                    <Stack.Screen name="lock" options={{headerShown: false}}/>
                                    <Stack.Screen name="+not-found"/>
                                </Stack>
                            </AuthGuard>
                        </UserInactivityProvider>
                    </BudgetProvider>
                </AuthProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});