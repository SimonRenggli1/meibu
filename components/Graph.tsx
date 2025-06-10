import {GraphPoint, LineGraph} from 'react-native-graph';
import {useMemo} from 'react';
import {Transaction} from "@/components/objects/Transaction";
import {TransactionType} from "@/components/enums/transactionType";
import {Text, View} from "react-native";

export const GraphComponent = ({transactions}: { transactions: Transaction[] }) => {
    const graphData: GraphPoint[] = useMemo(() => {
        let cumulative = 0;

        return transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(t => {
                cumulative += t.amount;
                return {
                    date: new Date(t.date),
                    value: cumulative,
                };
            });
    }, [transactions]);

    if (graphData.length === 0) {
        return (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF' }}>Keine Ausgaben im gewählten Zeitraum</Text>
            </View>
        );
    }

    function updatePriceTitle(p: GraphPoint) {

    }

    function resetPriceTitle() {

    }

    function hapticFeedback(impactLight: string) {
        
    }

    return (
        <LineGraph
            points={graphData}
            animated={true}
            color="#4484B2"
            enablePanGesture={true}
            onGestureStart={() => hapticFeedback('impactLight')}
            onPointSelected={(p) => updatePriceTitle(p)}
            onGestureEnd={() => resetPriceTitle()}
            style={{ height: 200, width: "100%" }}
        />
    );
};
