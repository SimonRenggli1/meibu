import React from "react";
import {Tabs} from "expo-router";
import {Platform} from "react-native";
import {HapticTab} from "@/components/HapticTab";
import AntDesign from "@expo/vector-icons/AntDesign";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerTitleAlign: "center",
                animation: "fade",
                // IOS Only - Haptic, BlurBackground
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Meibu",
                    headerTitleStyle: {
                      fontSize: 32,
                    },
                    tabBarLabel: "Home",
                    tabBarIcon: ({color}) => (
                        <AntDesign name="home" size={24} color={color}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="add-transaction"
                options={{
                    title: "Add Transaction",
                    tabBarIcon: ({color}) => (
                        <AntDesign name="plus" size={24} color={color}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="transactions"
                options={{
                    title: "My Transactions",
                    tabBarLabel: "Transactions",
                    tabBarIcon: ({color}) => (
                        <AntDesign name="shoppingcart" size={24} color={color}/>
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarLabel: "Settings",
                    tabBarIcon: ({color}) => (
                        <AntDesign name="setting" size={24} color={color}/>
                    ),
                }}
            />

        </Tabs>
    );
}
