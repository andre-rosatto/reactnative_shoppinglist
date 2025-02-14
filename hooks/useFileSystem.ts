import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';

export default function useFileSystem<T>(filename: string) {
	const loadData = useCallback(async () => {
		try {
			const directory = FileSystem.documentDirectory;
			if (!directory) return null;
			const result = await FileSystem.readAsStringAsync(`${directory}/${filename}`);
			return JSON.parse(result) as T;
		} catch (e) {
			console.error(e);
			return null;
		}
	}, [filename]);

	const saveData = useCallback(async (data: T) => {
		try {
			const directory = FileSystem.documentDirectory;
			if (!directory) return;
			await FileSystem.writeAsStringAsync(`${directory}/${filename}`, JSON.stringify(data));
		} catch (e) {
			console.error(e);
		}
	}, [filename]);

	return { loadData, saveData };
}