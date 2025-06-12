import dayjs from "dayjs";
import { Transaction } from "@/components/objects/Transaction";
import { RecurringInterval } from "@/components/enums/reacurringInterval";

export function generateRecurringInstances(
    transaction: Transaction,
    existingTransactions: Transaction[]
): Transaction[] {
    if (!transaction.isRecurring || !transaction.recurringInterval) return [];

    const start = dayjs(transaction.date).startOf("day");
    const now = dayjs().startOf("day");

    let intervalUnit: dayjs.OpUnitType;
    switch (transaction.recurringInterval) {
        case RecurringInterval.DAILY: intervalUnit = "day"; break;
        case RecurringInterval.WEEKLY: intervalUnit = "week"; break;
        case RecurringInterval.BIWEEKLY: intervalUnit = "week"; break;
        case RecurringInterval.MONTHLY: intervalUnit = "month"; break;
        case RecurringInterval.YEARLY: intervalUnit = "year"; break;
        default: return [];
    }

    const intervalStep = transaction.recurringInterval === RecurringInterval.BIWEEKLY ? 2 : 1;

    const instances: Transaction[] = [];
    let current = start;

    while (current.isSame(now) || current.isBefore(now)) {
        const isSameAsOriginal = current.isSame(dayjs(transaction.date), "day");

        const newId = `${transaction.id}-${current.format("YYYYMMDD")}`;
        const alreadyExists = existingTransactions.some(t => t.id === newId);

        if (!alreadyExists && !isSameAsOriginal) {
            const newTxn = { ...transaction };
            newTxn.id = newId;
            newTxn.date = current.toISOString();
            newTxn.isRecurring = false;
            newTxn.recurringInterval = undefined;
            instances.push(newTxn);
        }

        current = current.add(intervalStep, intervalUnit);
    }

    return instances;
}
