import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/components/enums/category';

interface CategoryBudget {
    [key: string]: number;
}

interface BudgetContextType {
    categoryBudgets: CategoryBudget;
    setCategoryBudget: (category: Category, limit: number) => void;
    getCategoryBudget: (category: Category) => number;
    getTotalBudget: () => number;
    overallBudgetLimit: number;
    setOverallBudgetLimit: (limit: number) => void;
    income: number;
    setIncome: (income: number) => void;
    isLoading: boolean; // NEU!
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

interface BudgetProviderProps {
    children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget>({});
    const [overallBudgetLimit, setOverallBudgetLimit] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadBudgetData = async () => {
            try {
                const storedBudgets = await AsyncStorage.getItem('@category_budgets');
                const storedLimit = await AsyncStorage.getItem('@overall_budget_limit');
                const storedIncome = await AsyncStorage.getItem('@income');
                if (storedBudgets !== null) {
                    setCategoryBudgets(JSON.parse(storedBudgets));
                }
                if (storedLimit !== null) {
                    setOverallBudgetLimit(parseFloat(storedLimit));
                }
                if (storedIncome !== null) {
                    setIncome(parseFloat(storedIncome));
                }
            } catch (e) {
                console.error('Failed to load budget data', e);
            }
            setIsLoading(false);
            setLoaded(true);
        };
        loadBudgetData();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const saveBudgetData = async () => {
            try {
                await AsyncStorage.setItem('@category_budgets', JSON.stringify(categoryBudgets));
                await AsyncStorage.setItem('@overall_budget_limit', overallBudgetLimit.toString());
                await AsyncStorage.setItem('@income', income.toString());
            } catch (e) {
                console.error('Failed to save budget data', e);
            }
        };
        saveBudgetData();
    }, [categoryBudgets, overallBudgetLimit, income, loaded]);

    const setCategoryBudget = (category: Category, limit: number) => {
        setCategoryBudgets(prev => ({ ...prev, [category]: limit }));
    };

    const getCategoryBudget = (category: Category): number => {
        return categoryBudgets[category] || 0;
    };

    const getTotalBudget = () => {
        return Object.values(categoryBudgets).reduce((sum, limit) => sum + limit, 0);
    };

    return (
        <BudgetContext.Provider
            value={{
                categoryBudgets,
                setCategoryBudget,
                getCategoryBudget,
                getTotalBudget,
                overallBudgetLimit,
                setOverallBudgetLimit,
                income,
                setIncome,
                isLoading,
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudgetContext = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudgetContext must be used within a BudgetProvider');
    }
    return context;
};
