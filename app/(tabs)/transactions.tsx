import {clearTransactions} from "@/components/Transactions";
import {Button, Text} from "@rneui/themed";
import {View} from "react-native";
import React from "react";

export default function TransactionsScreen() {
    return (
        <View>
            <Text>Transactions</Text>
            <Button
                title="Transaktionen löschen"
                onPress={clearTransactions}
            />
        </View>
    );
}
