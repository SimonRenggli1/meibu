import React, {useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Button, Input, Text} from '@rneui/themed';
import {useBudgetContext} from '@/contexts/BudgetContext';
import {Category} from '@/components/enums/category';

export default function EditCategoryLimitScreen() {
    const router = useRouter();

    const {category} = useLocalSearchParams<{ category: string }>();
    const {categoryBudgets, setCategoryBudget} = useBudgetContext();

    const isValidCategory = category && Object.values(Category).includes(category as Category);

    const prevLimit = isValidCategory ? categoryBudgets[category as Category] : undefined;

    const [value, setValue] = useState(
        prevLimit !== undefined && prevLimit !== null ? String(prevLimit) : ""
    );

    if (!isValidCategory) {
        return <Text>Ungültige Kategorie!</Text>;
    }

    const handleSave = () => {
        if (value === "") {
            setCategoryBudget(category as Category, undefined); // Budget löschen
        } else {
            setCategoryBudget(category as Category, Number(value)); // Budget setzen
        }
        router.back();
    };


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#FFFFFF"} barStyle="dark-content"/>
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
                buttonStyle={styles.buttonSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "flex-start", padding: 24, backgroundColor: '#f9f9f9'},
    header: {marginBottom: 22, textAlign: 'center',},
    buttonSave: {borderRadius: 8}
});
