export enum RecurringInterval {
    NONE = "Keine Wiederholung",
    DAILY = "Täglich",
    WEEKLY = "Wöchentlich",
    BIWEEKLY = "Alle 2 Wochen",
    MONTHLY = "Monatlich",
    YEARLY = "Jährlich"
}

export const getAllRecurringIntervals = (): { label: string; value: RecurringInterval }[] => [
    { label: "Keine Wiederholung", value: RecurringInterval.NONE },
    { label: "Täglich", value: RecurringInterval.DAILY },
    { label: "Wöchentlich", value: RecurringInterval.WEEKLY },
    { label: "Alle 2 Wochen", value: RecurringInterval.BIWEEKLY },
    { label: "Monatlich", value: RecurringInterval.MONTHLY },
    { label: "Jährlich", value: RecurringInterval.YEARLY }
];
