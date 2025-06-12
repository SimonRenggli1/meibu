import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Dialog, Input } from "@rneui/themed";
import { useBudgetContext } from "@/contexts/BudgetContext";
import { storeTransaction } from "@/components/Transactions";
import { Transaction } from "@/components/objects/Transaction";
import { Category } from "@/components/enums/category";

// ============ Komponente für die kleine Sparziel-Karte ===========
export const SmallSavingGoalCard: React.FC = () => {
    // Zugriff auf Sparziel-Daten aus dem globalen Kontext
    const { savingGoal, setSavingGoal } = useBudgetContext();

    // --- State-Management für Dialogfelder, modale Ansicht und Inputs ---
    const [visible, setVisible] = useState(false); // Sichtbarkeit des Hauptdialogs
    const [editMode, setEditMode] = useState<'goal'|'saved'|null>(null); // "goal"/"saved" bestimmt Dialogart
    const [amount, setAmount] = useState(savingGoal?.amount ? String(savingGoal.amount) : "");
    const [savedAmount, setSavedAmount] = useState(savingGoal?.saved ? String(savingGoal.saved) : "0");
    const [date, setDate] = useState(savingGoal?.targetDate ?? "");

    // --- State für das Abheben vom Sparziel ---
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");

    // ----------- Hilfswerte für Anzeige und Progressbar ----------
    const goalAmount = savingGoal?.amount || 0;
    const saved = savingGoal?.saved || 0;
    const percent = goalAmount ? Math.min(saved / goalAmount, 1) : 0;

    // Öffnet Dialog zur Bearbeitung von Zielbetrag und Datum
    const openGoalEdit = () => {
        setAmount(savingGoal?.amount ? String(savingGoal.amount) : "");
        setDate(savingGoal?.targetDate ?? "");
        setEditMode("goal");
        setVisible(true);
    };

    // Öffnet Dialog zur Anpassung des aktuell Gesparten (z.B. Korrektur)
    const openSavedEdit = () => {
        setSavedAmount(savingGoal?.saved ? String(savingGoal.saved) : "0");
        setEditMode("saved");
        setVisible(true);
    };

    // Speichert neues Ziel (Betrag und ggf. Datum)
    const saveGoal = () => {
        setSavingGoal({
            ...savingGoal,
            amount: Number(amount),
            targetDate: date !== "" ? date : undefined,
            saved: savingGoal?.saved ?? 0 // unbeeinflusst lassen
        });
        setVisible(false);
        setEditMode(null);
    };

    // Übernimmt manuelle Korrektur des gesparten Betrags
    const saveSaved = () => {
        setSavingGoal({
            ...savingGoal,
            saved: Number(savedAmount),
            amount: savingGoal?.amount ?? 0,
            targetDate: savingGoal?.targetDate
        });
        setVisible(false);
        setEditMode(null);
    };

    // --- Behandelt das Abheben, speichert Transaktion, aktualisiert Sparbetrag ---
    const handleWithdraw = async () => {
        const amountNum = parseFloat(withdrawAmount);
        if (!savingGoal || isNaN(amountNum) || amountNum <= 0 || amountNum > (savingGoal.saved ?? 0)) return;

        // 1. Ziel aktualisieren (gesparte Summe um Betrag verringern)
        setSavingGoal({
            ...savingGoal,
            saved: (savingGoal?.saved ?? 0) - amountNum
        });

        // 2. Als Ausgabe in Transaktionsliste speichern
        const withdrawTx = new Transaction(
            "Abhebung von Savings",
            amountNum,           // negativer Betrag kennzeichnet Auszahlung
            Category.SAVINGS,
            "Ausgabe"
        );
        await storeTransaction(withdrawTx);

        // 3. Felder und Dialog zurücksetzen
        setWithdrawAmount("");
        setWithdrawVisible(false);
    };

    // ========= RENDERING ==========
    return (
        <Card containerStyle={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 3 }}>Sparziel</Text>
                    {(savingGoal?.amount || 0) > 0 ? (
                        <View>
                            <Text style={{ fontSize: 13 }}>
                                <Text style={{fontWeight: 'bold'}}>{saved.toLocaleString()} CHF</Text> / {goalAmount.toLocaleString()} CHF {"  "}
                                ({(percent * 100).toFixed(0)}%)
                                {savingGoal?.targetDate ? ` • bis ${savingGoal.targetDate}` : ""}
                            </Text>
                            {/* Fortschrittsbalken */}
                            <View style={styles.barBg}>
                                <View style={[styles.barFg, { width: `${percent * 100}%` }]} />
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 4}}>
                                {/* Öffnet Dialog zum Anpassen Zielbetrag/Zieldatum */}
                                <Button
                                    type="clear"
                                    title="Ziel bearbeiten"
                                    titleStyle={{fontSize:12}}
                                    onPress={openGoalEdit}
                                />
                                {/* Öffnet Abheben-Dialog */}
                                <Button
                                    type="clear"
                                    title="Abheben"
                                    titleStyle={{fontSize:12}}
                                    containerStyle={{marginLeft: 8}}
                                    onPress={()=>setWithdrawVisible(true)}
                                />
                            </View>
                        </View>
                    ) : (
                        // Kein Ziel gesetzt: Button zum Festlegen
                        <Button
                            title="Sparziel festlegen"
                            type="outline"
                            size="sm"
                            onPress={openGoalEdit}
                        />
                    )}
                </View>
            </View>

            {/* === Dialog zur Bearbeitung (Ziel/gespart) === */}
            <Dialog isVisible={visible} onBackdropPress={()=>setVisible(false)}>
                {editMode === "goal" ? (
                    <>
                        <Dialog.Title title="Sparziel festlegen"/>
                        <Input
                            label="Zielbetrag (CHF)"
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={setAmount}
                            placeholder="z.B. 1000"
                        />
                        <Input
                            label="Zieldatum (optional)"
                            value={date}
                            onChangeText={setDate}
                            placeholder="JJJJ-MM-TT"
                        />
                        <Button
                            title="Speichern"
                            onPress={saveGoal}
                            disabled={!amount || isNaN(Number(amount))}
                        />
                    </>
                ) : editMode === "saved" ? (
                    <>
                        <Dialog.Title title="Gesparten Betrag anpassen"/>
                        <Input
                            label="Gespart (CHF)"
                            value={savedAmount}
                            keyboardType="numeric"
                            onChangeText={setSavedAmount}
                            placeholder="z.B. 250"
                        />
                        <Button
                            title="Speichern"
                            onPress={saveSaved}
                            disabled={savedAmount === "" || isNaN(Number(savedAmount))}
                        />
                    </>
                ) : null}
            </Dialog>
            {/* === Dialog für Abhebung vom Sparziel === */}
            <Dialog isVisible={withdrawVisible} onBackdropPress={() => setWithdrawVisible(false)}>
                <Dialog.Title title="Vom Sparziel abheben" />
                <Input
                    label="Betrag (CHF)"
                    value={withdrawAmount}
                    keyboardType="numeric"
                    onChangeText={setWithdrawAmount}
                    placeholder="z.B. 50"
                />
                <Button
                    title="Abheben"
                    onPress={handleWithdraw}
                    disabled={
                        !withdrawAmount ||
                        isNaN(Number(withdrawAmount)) ||
                        Number(withdrawAmount) <= 0 ||
                        Number(withdrawAmount) > (savingGoal?.saved ?? 0)
                    }
                />
            </Dialog>
        </Card>
    );
};

// ========= STYLES ==========
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#f9f7f3',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    barBg: {
        height: 8,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 4
    },
    barFg: {
        height: "100%",
        backgroundColor: "#4caf50",
        borderRadius: 4
    }
});
