import React from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {ListItem, Icon, Text, Divider, Card} from '@rneui/themed';
import {useBudgetContext} from '@/contexts/BudgetContext';
import {Category, category} from '@/components/enums/category';
import {useTransactions} from '@/hooks/useTransactions';
import {useRouter} from 'expo-router';
import {SmallSavingGoalCard} from "@/components/SmallSavingGoalCard";

// ===== SETTINGS-SCREEN =====
export default function SettingsScreen() {
    const router = useRouter();
    // Budget-Kontext: Kategorien-Budgets und Einkommen
    const {categoryBudgets, income} = useBudgetContext();
    // Benutzt Hook für Transaktionssummen pro Kategorie
    const {getTransactionsTotalByCategory} = useTransactions();

    // --- Farbe je Kategorie (ohne Sparen/Savings) ---
    const categoryColors = {
        [Category.FOOD]: '#4caf50',
        [Category.TRANSPORT]: '#2196f3',
        [Category.SHOPPING]: '#ff9800',
        [Category.ENTERTAINMENT]: '#ba68c8',
        [Category.UTILITIES]: '#607d8b',
        [Category.OTHER]: '#a1887f',
    };

    // ----- BERECHNUNGEN -----
    // Gesamtsumme aller Kategorie-Budgets (ohne Savings)
    const totalCategoryLimits = category.getAllCategories()
        .filter(cat => cat !== Category.SAVINGS)
        .reduce((sum, cat) => sum + (categoryBudgets[cat] || 0), 0);

    // Budget-Rest nach Kategorie-Budgets
    const incomeRemaining = income - totalCategoryLimits;

    // ================= RENDER-BLOCK =================
    return (
        <View style={styles.container}>
            <ScrollView>
                {/* --- Überschrift --- */}
                <Text h4 style={styles.title}>Kategorien</Text>
                <Divider style={styles.divider}/>

                {/* === EINAHMEN-ANZEIGE === */}
                <TouchableOpacity
                    activeOpacity={0.89}
                    onPress={() => router.push('/edit-income')}
                >
                    <Card containerStyle={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon name="wallet" type="entypo" color="#23236e" size={30}/>
                            <View style={{marginLeft: 10}}>
                                <Text style={styles.infoTitle}>
                                    Einkommen:{' '}
                                    <Text style={styles.infoValue}>CHF{income.toFixed(2)}</Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Kategorie-Limits:{' '}
                                    <Text style={[styles.infoValue, {color: '#1e88e5'}]}>
                                        CHF{totalCategoryLimits.toFixed(2)}
                                    </Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Verfügbar nach Limits:{' '}
                                    <Text style={[
                                        styles.infoValue,
                                        {color: incomeRemaining < 0 ? '#c62828' : '#4caf50'}
                                    ]}>
                                        CHF{incomeRemaining.toFixed(2)}
                                    </Text>
                                </Text>
                            </View>
                            {/* Icon für "chevron" */}
                            <Icon
                                name="chevron-right"
                                type="feather"
                                color="#23236e"
                                size={28}
                                style={{alignSelf: 'center', marginLeft: 24}}
                            />
                        </View>
                    </Card>
                </TouchableOpacity>


                {/* === SPARZIEL-KARTE === */}
                <SmallSavingGoalCard/>

                {/* === KATEGORIE-KARTEN (ohne Savings!) === */}
                {category.getAllCategories()
                    .filter(cat => cat !== Category.SAVINGS)     // <--- Sparen wird ausgeblendet!
                    .map((cat) => {
                        const spent = getTransactionsTotalByCategory(cat);
                        const limit = categoryBudgets[cat] || 0;
                        const color = categoryColors[cat] || "#1976d2";
                        return (
                            <ListItem
                                key={cat}
                                onPress={() =>
                                    router.push({
                                        pathname: '/category-settings/[category]',
                                        params: {category: cat}
                                    })
                                }
                                bottomDivider
                                containerStyle={styles.listItemContainer}
                            >
                                <Icon key="icon" name="credit-card" type="feather" color={color}/>
                                <ListItem.Content key="content">
                                    <ListItem.Title style={[styles.listItemTitle, {color}]}>
                                        {cat}
                                    </ListItem.Title>
                                    <ListItem.Subtitle>
                                        Spent: <Text
                                        style={{color: '#d32f2f', fontWeight: 'bold'}}>CHF{spent.toFixed(2)}</Text>
                                        {'  |  '}
                                        Limit: <Text>CHF{limit.toFixed(2)}</Text>
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron key="chevron"/>
                            </ListItem>
                        );
                    })}
            </ScrollView>
        </View>
    );
}

// ===== STYLES =====
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },
    infoCard: {
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#f1f4fd',
        borderColor: '#c1cedf',
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 14,
        color: '#23236e',
        marginBottom: 2,
    },
    infoValue: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#23236e',
    },
    title: {
        marginVertical: 16,
        textAlign: 'center',
        color: '#333',
    },
    divider: {
        marginBottom: 8,
    },
    listItemContainer: {
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: {width: 1, height: 2},
    },
    listItemTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.5,
    }
});
