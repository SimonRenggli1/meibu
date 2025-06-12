import React from "react";
import {Tabs} from "expo-router";
import {HapticTab} from "@/components/HapticTab";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerTitleAlign: "center",
                animation: "fade",
                tabBarButton: HapticTab,
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
                name="settings"
                options={{
                    title: "Settings",
                    tabBarLabel: "Set Budget",
                    tabBarIcon: ({color}) => (
                        <AntDesign name="setting" size={24} color={color}/>
                    ),
                }}
            />

        </Tabs>
    );
}
