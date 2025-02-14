import NoteItem from "@/components/NoteItem";
import { COLORS } from "@/constants/colors";
import { NOTES_STORAGE_NAME } from "@/constants/env";
import useFileSystem from "@/hooks/useFileSystem";
import { Note } from "@/typings/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Appearance, Pressable, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notes() {
	const [notes, setNotes] = useState<Note[]>([]);
	const { loadData, saveData } = useFileSystem<Note[]>(NOTES_STORAGE_NAME);

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	useEffect(() => {
		const fetchData = async () => {
			const data = await loadData();
			setNotes(data ?? []);
		}
		fetchData();
	}, []);

	const handleAddPress = () => {
		const nextNotes = [{
			key: Date.now().toString(),
			text: ''
		}, ...notes];
		setNotes(nextNotes);
	}

	const getHeaderButton = () => (
		<Pressable onPress={handleAddPress}>
			<Ionicons
				name="add-circle-outline"
				size={36}
				style={{ marginRight: 10 }}
				color={theme.text}
			/>
		</Pressable>
	);

	const handleChange = (key: string, newText: string) => {
		const nextNotes = notes.map(note => note.key !== key ? note : { ...note, text: newText });
		setNotes(nextNotes);
		saveData(nextNotes);
	}

	const handleDelete = (key: string) => {
		const nextNotes = notes.filter(note => note.key !== key);
		setNotes(nextNotes);
		saveData(nextNotes);
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={[]}
		>
			<Stack.Screen
				options={{
					headerTitle: `Anotações`,
					headerTitleAlign: 'center',
					headerTintColor: theme.text,
					headerStyle: {
						backgroundColor: theme.background,
					},
					headerRight: getHeaderButton,
				}}
			/>

			<StatusBar style={theme === COLORS.dark ? 'light' : 'dark'} />

			<Animated.FlatList
				style={styles.listContainer}
				itemLayoutAnimation={LinearTransition}
				data={notes}
				renderItem={({ item }) => (
					<NoteItem
						text={item.text}
						onChange={(newText) => handleChange(item.key, newText)}
						onDeletePress={() => handleDelete(item.key)}
					/>
				)}
			/>
		</SafeAreaView>
	);
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
		},
		listContainer: {
			flex: 1,
			padding: 10,
		},
	});
}