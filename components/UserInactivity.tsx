import {useCallback, useEffect, useRef, useState} from "react";
import { InteractionManager, AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const LOCK_TIME = 3000;

export const UserInactivityProvider = ({ children }: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();

    const [hasMounted, setHasMounted] = useState(false);
    const [isLocking, setIsLocking] = useState(false);

    const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background') {
            await recordStartTime();
        } else if (
            nextAppState === 'active' &&
            appState.current.match(/background/)
        ) {
            const raw = await AsyncStorage.getItem('startTime');
            const startTime = raw ? Number(raw) : 0;
            const elapsed = Date.now() - startTime;

            if (elapsed > LOCK_TIME && !isLocking && pathname !== "/lock") {
                setIsLocking(true);
                InteractionManager.runAfterInteractions(() => {
                    logout();
                    router.replace("/lock");
                    setIsLocking(false);
                });
            }
        }

        appState.current = nextAppState;
    }, [logout, router, pathname, isLocking]);

    useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => {
            setHasMounted(true);
        });
        return () => interaction.cancel();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [handleAppStateChange, hasMounted]);


    const recordStartTime = async () => {
        await AsyncStorage.setItem("startTime", String(Date.now()));
    };

    return children;
};
