import React, { useState } from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { useRouter } from 'expo-router';

export default function EditIncomeScreen() {
    const router = useRouter();
    const { income, setIncome } = useBudgetContext();
    const [value, setValue] = useState(String(income ?? ''));

    const handleSave = () => {
        setIncome(Number(value));
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#FFFFFF"} barStyle="dark-content"/>
            <Text h4 style={styles.header}>Einkommen bearbeiten</Text>
            <Input
                label="Monatliches Einkommen"
                value={value}
                keyboardType="numeric"
                onChangeText={setValue}
                leftIcon={{ type: 'entypo', name: 'wallet' }}
            />
            <Button
                title="Speichern"
                onPress={handleSave}
                disabled={isNaN(Number(value)) || value === ''}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "flex-start", padding: 24, backgroundColor: '#f9f9f9' },
    header: {marginBottom: 22, textAlign: 'center'}
});
