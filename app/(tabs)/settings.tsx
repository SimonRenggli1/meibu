import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Text, Card } from '@rneui/themed';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { Category, category } from '@/components/enums/category';
import { useTransactions } from '@/hooks/useTransactions';
import { useRouter } from 'expo-router';
import { SmallSavingGoalCard } from "@/components/SmallSavingGoalCard";
import dayjs from 'dayjs';

// ===== SETTINGS-SCREEN =====
export default function SettingsScreen() {
    const router = useRouter();
    const { categoryBudgets, income } = useBudgetContext();
    const { transactions } = useTransactions();

    const categoryColors = {
        [Category.FOOD]: '#4caf50',
        [Category.TRANSPORT]: '#2196f3',
        [Category.SHOPPING]: '#ff9800',
        [Category.ENTERTAINMENT]: '#ba68c8',
        [Category.UTILITIES]: '#607d8b',
        [Category.OTHER]: '#a1887f',
    };

    const totalCategoryLimits = category.getAllCategories()
        .filter(cat => cat !== Category.SAVINGS)
        .reduce((sum, cat) => sum + (categoryBudgets[cat] || 0), 0);

    const incomeRemaining = income - totalCategoryLimits;

    function getThisMonthSpent(cat: Category) {
        return transactions
            .filter(
                t =>
                    t.category === cat &&
                    t.type === "Expense" &&
                    dayjs(t.date).isSame(dayjs(), "month") &&
                    dayjs(t.date).isSame(dayjs(), "year")
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text h4 style={styles.title}>Kategorien</Text>

                {/* === EINNAHMEN-ANZEIGE === */}
                <TouchableOpacity
                    activeOpacity={0.89}
                    onPress={() => router.push('/edit-income')}
                >
                    <Card containerStyle={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon name="wallet" type="entypo" color="#23236e" size={30} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.infoTitle}>
                                    Einkommen:{' '}
                                    <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit>
                                        CHF{income.toFixed(2)}
                                    </Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Kategorie-Limits:{' '}
                                    <Text style={[styles.infoValue, { color: '#1e88e5' }]} numberOfLines={1} adjustsFontSizeToFit>
                                        CHF{totalCategoryLimits.toFixed(2)}
                                    </Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Verfügbar nach Limits:{' '}
                                    <Text style={[
                                        styles.infoValue,
                                        { color: incomeRemaining < 0 ? '#c62828' : '#4caf50' }
                                    ]}
                                          numberOfLines={1} adjustsFontSizeToFit>
                                        CHF{incomeRemaining.toFixed(2)}
                                    </Text>
                                </Text>
                            </View>
                            <Icon
                                name="chevron-right"
                                type="feather"
                                color="#23236e"
                                size={28}
                                style={{ alignSelf: 'center', marginLeft: 24 }}
                            />
                        </View>
                    </Card>
                </TouchableOpacity>

                <SmallSavingGoalCard />

                {/* === KATEGORIE-KARTEN (ohne Savings!) === */}
                {category.getAllCategories()
                    .filter(cat => cat !== Category.SAVINGS)
                    .map((cat) => {
                        const spent = getThisMonthSpent(cat);
                        const limit = categoryBudgets[cat] || 0;
                        const color = categoryColors[cat] || "#1976d2";
                        const overLimit = spent > limit && limit > 0;
                        return (
                            <ListItem
                                key={cat}
                                onPress={() =>
                                    router.push({
                                        pathname: '/category-settings/[category]',
                                        params: { category: cat }
                                    })
                                }
                                containerStyle={[
                                    styles.listItemContainer,
                                    overLimit && styles.listItemContainerWarning,
                                ]}
                            >
                                <Icon key="icon" name="credit-card" type="feather" color={color} />
                                <ListItem.Content key="content">
                                    <ListItem.Title
                                        style={[styles.listItemTitle, { color }]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {cat}
                                    </ListItem.Title>
                                    <View style={styles.listItemSubtitle}>
                                        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
                                            Spent:{" "}
                                            <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                                CHF{spent.toFixed(2)}
                                            </Text>
                                        </Text>
                                        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
                                            Limit:{" "}
                                            <Text>
                                                CHF{limit.toFixed(2)}
                                            </Text>
                                        </Text>
                                    </View>
                                </ListItem.Content>
                                <ListItem.Chevron key="chevron" />
                            </ListItem>
                        );
                    })}
            </ScrollView>
        </View>
    );
}

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
    listItemContainer: {
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: { width: 1, height: 2 },
    },
    listItemContainerWarning: {
        borderWidth: 2,
        borderColor: '#ffd600',
    },
    listItemTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.5,
    },
    listItemSubtitle: {
        marginTop: 4,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
});
