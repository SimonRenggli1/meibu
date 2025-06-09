import {useEffect, useRef} from "react";
import {AppState, AppStateStatus} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";

const LOCK_TIME = 3000;

export const UserInactivityProvider = ({children}: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'inactive') {
            router.push("/");
        } else {
            if (router.canGoBack())
            {
                router.back();
            }
        }

        if (nextAppState === 'background') {
            await recordStartTime();
        }else if (nextAppState === 'active' && appState.current.match(/background/)) {
            const raw = await AsyncStorage.getItem('startTime');
            const startTime = raw ? Number(raw) : 0;
            const elapsed = Date.now() - startTime;

            if (elapsed > LOCK_TIME) {
                router.push("/lock");
            }
        }

        appState.current = nextAppState;
    }

    const recordStartTime = async () => {
        await AsyncStorage.setItem('startTime', String(Date.now()));
    }

    return children;
}
