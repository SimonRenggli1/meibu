import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { InteractionManager, View, ActivityIndicator } from "react-native";

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        const run = async () => {
            InteractionManager.runAfterInteractions(() => {
                if (!isAuthenticated && pathname !== "/lock") {
                    router.replace("/lock");
                }
                setHasCheckedAuth(true);
            });
        };
        run();
    }, [isAuthenticated, pathname, router]);

    if (!hasCheckedAuth) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <>{children}</>;
}
