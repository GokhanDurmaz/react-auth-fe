import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if(!item) return initialValue;

            try {
                return JSON.parse(item);
            } catch {
                return item as unknown as T;
            }
        } catch (err) {
            console.error(`Error reading localStorage key "${key}"`, err);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if(typeof valueToStore === 'string') {
                window.localStorage.setItem(key, valueToStore);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (err) {
            console.error(`Error setting localStorage key "${key}"`, err);
        }
    };

    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (err) {
            console.error(`Error removing localStorage key "${key}"`, err);
        }
    };

    return [storedValue, setValue, removeValue] as const;
}