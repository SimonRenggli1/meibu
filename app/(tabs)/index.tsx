import React, {useCallback, useEffect, useState} from "react";
import {FlatList, StatusBar, StyleSheet, TouchableOpacity, View,} from "react-native";
import {Text} from "@rneui/themed";
import {getTransactions, deleteTransaction} from "@/components/Transactions";
import {Transaction} from "@/components/objects/Transaction";
import dayjs from "dayjs";
import {TransactionType} from "@/components/enums/transactionType";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useFocusEffect} from "expo-router";
import {GraphComponent} from "@/components/Graph";
import {CategoryHelper} from "@/helpers/CategoryHelper";
import {generateRecurringInstances} from "@/helpers/GenerateRecurringInstances";
import { Swipeable } from "react-native-gesture-handler";


const TIME_FILTERS = ["Heute", "Woche", "Monat", "Jahr"];

export default function HomeScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState("Heute");

    const handleDelete = async (id: string) => {
        await deleteTransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    useFocusEffect(
        useCallback(() => {
            const fetchTransactions = async () => {
                const allTransactions = await getTransactions();

                const recurringInstances = allTransactions
                    .filter(t => t.isRecurring)
                    .flatMap(t => generateRecurringInstances(t));

                const nonRecurring = allTransactions.filter(t => !t.isRecurring);

                setTransactions([...nonRecurring, ...recurringInstances]);
            };

            fetchTransactions();
        }, [])
    );


    useEffect(() => {
        const now = dayjs();
        let filtered: Transaction[] = [];

        switch (selectedFilter) {
            case "Heute":
                filtered = transactions.filter((t) => dayjs(t.date).isSame(now, "day"));
                break;
            case "Woche":
                filtered = transactions.filter((t) => dayjs(t.date).isSame(now, "week"));
                break;
            case "Monat":
                filtered = transactions.filter((t) => dayjs(t.date).isSame(now, "month"));
                break;
            case "Jahr":
                filtered = transactions.filter((t) => dayjs(t.date).isSame(now, "year"));
                break;
        }

        const expenses = filtered.filter((t) => t.type === TransactionType.EXPENSE);
        const total = expenses.reduce((sum, t) => sum + t.amount, 0);

        const sorted = filtered.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
        setFilteredTransactions(sorted);
        setTotalSpent(total);
    }, [selectedFilter, transactions]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#F9FAFB"} barStyle="dark-content"/>

            <Text style={styles.header}>Deine Ausgaben</Text>

            <View style={styles.graphContainer}>
                <Text style={styles.totalText}>Gesamt: CHF {totalSpent.toFixed(2)}</Text>
            </View>

            <View style={styles.filterContainer}>
                {TIME_FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.filterButtonSelected,
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextSelected,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Transaktionen</Text>

            <FlatList
                data={[...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.transactionList}
                renderItem={({item}) => {
                    const isIncome = item.type === "Income";

                    const renderRightActions = () => (
                        <View style={styles.deleteBox}>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Icon name="trash-can-outline" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    );

                    return (
                        <Swipeable renderRightActions={renderRightActions}>
                            <View style={styles.transactionCard}>
                                <Icon
                                    name={CategoryHelper.getIconName(item.category)}
                                    size={28}
                                    color="#555"
                                />
                                <View style={styles.transactionInfo}>
                                    <Text style={styles.transactionTitle}>{item.title}</Text>
                                    <Text style={styles.transactionDate}>
                                        {dayjs(item.date).format("DD.MM.YYYY HH:mm")}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.transactionAmount,
                                        isIncome ? styles.incomeAmount : styles.expenseAmount,
                                    ]}
                                >
                                    {isIncome
                                        ? `+ CHF ${item.amount.toFixed(2)}`
                                        : `– CHF ${item.amount.toFixed(2)}`}
                                </Text>
                            </View>
                        </Swipeable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },
    graphContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#6B7280",
        marginTop: 8,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 20,
    },
    filterButtonSelected: {
        backgroundColor: "#3B82F6",
    },
    filterText: {
        fontSize: 14,
        color: "#374151",
    },
    filterTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 8,
    },
    transactionList: {
        paddingBottom: 100,
    },
    transactionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    transactionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    transactionDate: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    incomeAmount: {
        color: 'green',
    },
    expenseAmount: {
        color: 'red',
    },
    deleteBox: {
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
});
