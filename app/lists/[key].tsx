import AddIemBar from "@/components/AddItemBar";
import ListItem from "@/components/ListItem";
import { COLORS } from "@/globals/colors";
import { STORAGE_NAME } from "@/globals/env";
import { createStyles } from "@/globals/utils";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { Item, List } from "@/typings/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
	const { key } = useLocalSearchParams();
	const [lists, setLists] = useState<List[]>([]);
	const { loadStorage, saveStorage } = useAsyncStorage<List[]>(STORAGE_NAME);

	useEffect(() => {
		loadStorage(data => setLists(data ?? []));
	}, []);

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);
	const currentList = lists.find(list => list.key === key);

	if (!currentList) return null;

	const sortItems = (items: Item[]): Item[] => {
		const result = [...items];
		result.sort((a, b) => !a.bought && b.bought ? -1 : 1);
		return result;
	}

	const handleNewItemPress = (val: string) => {
		const newItem: Item = ({
			key: Date.now().toString(),
			title: val,
			bought: false
		});
		const nextLists= lists.map(list =>
			list.key !== key ? list : {...list, items: [newItem, ...list.items]}
		);
		setLists(nextLists);
		saveStorage(nextLists);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: `${currentList.title}`,
					headerTitleAlign: 'center',
					headerTintColor: COLORS[theme].text,
					headerStyle: {
						backgroundColor: COLORS[theme].background,
					}
				}}
			/>
			
			<AddIemBar
				type="item"
				onAddPress={handleNewItemPress}
			/>

			<Animated.FlatList
				style={styles.listContainer}
				data={sortItems(currentList.items)}
				renderItem={({ item }) => (
					<ListItem
						lists={lists}
						listKey={currentList.key}
						item={item}
						onListChange={(nextLists: List[]) => {
							setLists(nextLists);
							saveStorage(nextLists);
						}}
					/>
				)}
			/>
		</SafeAreaView>
	)
}