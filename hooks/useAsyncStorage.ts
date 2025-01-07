import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export default function useAsyncStorage<T>(storageName: string) {
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setData(null);
			try {
				const jsonValue = await AsyncStorage.getItem(storageName);
				const storageData = jsonValue !== null ? JSON.parse(jsonValue) : [];
				setData(storageData);
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, [storageName]);

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

	return { data, saveStorage };
}