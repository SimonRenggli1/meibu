export enum Category {
    FOOD = 'Essen',
    TRANSPORT = 'Transport',
    SHOPPING = 'Shopping',
    ENTERTAINMENT = 'Spass',
    UTILITIES = 'Versorgung',
    SAVINGS = 'Sparen',
    OTHER = 'Anderes',
}

export class category {
    static getAllCategories(): Category[] {
        return Object.values(Category);
    }
}
