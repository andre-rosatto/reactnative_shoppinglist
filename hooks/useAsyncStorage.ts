import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

export default function Storage<T>(storageName: string) {
	const loadStorage = useCallback((cb: (d: T) => void) => {
		const fetchData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem(storageName);
				const storageData = jsonValue !== null ? JSON.parse(jsonValue) : [];
				cb(storageData);
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, []);

	const saveStorage = useCallback((saveData: T) => {
		const storeData = async () => {
			try {
				const jsonValue = JSON.stringify(saveData);
				await AsyncStorage.setItem(storageName, jsonValue);
			} catch (err) {
				console.error(err);
			}
		}
		storeData();
	}, [storageName]);

	return { loadStorage, saveStorage };
}