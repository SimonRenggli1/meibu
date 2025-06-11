import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Text, Divider, Card } from '@rneui/themed';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { Category, category } from '@/components/enums/category';
import { useTransactions } from '@/hooks/useTransactions';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { categoryBudgets, income } = useBudgetContext();
    const { getTransactionsTotalByCategory } = useTransactions();

    const categoryColors = {
        [Category.FOOD]: '#4caf50',
        [Category.TRANSPORT]: '#2196f3',
        [Category.SHOPPING]: '#ff9800',
        [Category.ENTERTAINMENT]: '#ba68c8',
        [Category.UTILITIES]: '#607d8b',
        [Category.OTHER]: '#a1887f',
    };

    const totalCategoryLimits = category.getAllCategories().reduce((sum, cat) => sum + (categoryBudgets[cat] || 0), 0);
    const incomeRemaining = income - totalCategoryLimits;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <Text h4 style={styles.title}>Kategorien</Text>
                <Divider style={styles.divider} />

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
                                    <Text style={styles.infoValue}>${income.toFixed(2)}</Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Summe Kategorie-Limits:{' '}
                                    <Text style={[styles.infoValue, { color: '#1e88e5' }]}>
                                        ${totalCategoryLimits.toFixed(2)}
                                    </Text>
                                </Text>
                                <Text style={styles.infoTitle}>
                                    Verfügbar nach Limits:{' '}
                                    <Text style={[
                                        styles.infoValue,
                                        { color: incomeRemaining < 0 ? '#c62828' : '#4caf50' }
                                    ]}>
                                        ${incomeRemaining.toFixed(2)}
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

                {category.getAllCategories().map((cat) => {
                    const spent = getTransactionsTotalByCategory(cat);
                    const limit = categoryBudgets[cat] || 0;
                    const color = categoryColors[cat] || "#1976d2";
                    return (
                        <ListItem
                            key={cat}
                            onPress={() =>
                                router.push({
                                    pathname: '/category-settings/[category]',
                                    params: { category: cat }
                                })
                            }
                            bottomDivider
                            containerStyle={styles.listItemContainer}
                        >
                            <Icon key="icon" name="credit-card" type="feather" color={color} />
                            <ListItem.Content key="content">
                                <ListItem.Title style={[styles.listItemTitle, { color }]}>
                                    {cat}
                                </ListItem.Title>
                                <ListItem.Subtitle>
                                    Ausgegeben: <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>${spent.toFixed(2)}</Text>
                                    {'  |  '}
                                    Limit: <Text>${limit.toFixed(2)}</Text>
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron key="chevron" />
                        </ListItem>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f7f7f7'
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
        shadowOffset: { width: 1, height: 2 },
    },
    listItemTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 0.5,
    }
});
