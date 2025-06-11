import React, {useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {View, StyleSheet} from 'react-native';
import {Button, Input, Text} from '@rneui/themed';
import {useBudgetContext} from '@/contexts/BudgetContext';
import {Category} from '@/components/enums/category';

export default function EditCategoryLimitScreen() {
    const router = useRouter();

    const {category} = useLocalSearchParams<{ category: string }>();
    const {categoryBudgets, setCategoryBudget} = useBudgetContext();

    const isValidCategory = category && Object.values(Category).includes(category as Category);

    const prevLimit = isValidCategory ? categoryBudgets[category as Category] || 0 : 0;

    const [value, setValue] = useState(String(prevLimit ?? ""));

    if (!isValidCategory) {
        return <Text>Ungültige Kategorie!</Text>;
    }

    const handleSave = () => {
        setCategoryBudget(category as Category, Number(value));
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text h4 style={styles.header}>Limit für {category} setzen</Text>
            <Input
                label="Monatslimit"
                value={value}
                keyboardType="numeric"
                onChangeText={setValue}
                leftIcon={{type: 'feather', name: 'credit-card'}}
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
    container: {flex: 1, justifyContent: "flex-start", padding: 24, backgroundColor: '#f9f9f9'},
    header: {marginBottom: 22, textAlign: 'center'}
});
