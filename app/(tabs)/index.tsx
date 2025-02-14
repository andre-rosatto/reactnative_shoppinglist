import { Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from "react";
import { List } from "@/typings/types";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { createStyles } from "@/globals/utils";
import ListItem from "@/components/ListItem";
import AddIemBar from "@/components/AddItemBar";
import { LIST_STORAGE_NAME } from "@/globals/env";
import { Stack, useFocusEffect } from "expo-router";
import { COLORS } from "@/globals/colors";
import useFileSystem from "@/hooks/useFileSystem";

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);
	const { loadData, saveData } = useFileSystem<List[]>(LIST_STORAGE_NAME);

	useFocusEffect(useCallback(() => {
		const fetchData = async () => {
			const data = await loadData();
			setLists(data ?? []);
		}
		fetchData();
	}, []));

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);

	const handleAddPress = (val: string) => {
		const newList = {
			key: Date.now().toString(),
			title: val,
			items: []
		};
		const nextLists = [newList, ...lists];
		setLists(nextLists);
		saveData(nextLists);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: `ShoppingList`,
					headerTitleAlign: 'center',
					headerTintColor: COLORS[theme].text,
					headerStyle: {
						backgroundColor: COLORS[theme].background,
					}
				}}
			/>

			<StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

			<AddIemBar type="list" onAddPress={handleAddPress} />

			<Animated.FlatList
				style={styles.listContainer}
				itemLayoutAnimation={LinearTransition}
				data={lists}
				renderItem={({ item }) => (
					<ListItem
						lists={lists}
						listKey={item.key}
						item={item}
						onListChange={(nextLists: List[]) => {
							setLists(nextLists);
							saveData(nextLists);
						}}
					/>
				)}
			/>
		</SafeAreaView>
	);
}


