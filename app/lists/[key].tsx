import AddIemBar from "@/components/AddItemBar";
import ListItem from "@/components/ListItem";
import { COLORS } from "@/constants/colors";
import { LIST_STORAGE_NAME } from "@/constants/env";
import useFileSystem from "@/hooks/useFileSystem";
import { Item, List } from "@/typings/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
	const { key } = useLocalSearchParams();
	const [lists, setLists] = useState<List[]>([]);
	const { loadData, saveData } = useFileSystem<List[]>(LIST_STORAGE_NAME);

	useEffect(() => {
		const fetchData = async () => {
			const data = await loadData();
			setLists(data ?? []);
		}
		fetchData();
	}, []);

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
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
		const nextLists = lists.map(list =>
			list.key !== key ? list : { ...list, items: [newItem, ...list.items] }
		);
		setLists(nextLists);
		saveData(nextLists);
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={[]}
		>
			<Stack.Screen
				options={{
					headerTitle: `${currentList.title}`,
					headerTitleAlign: 'center',
					headerTintColor: theme.text,
					headerStyle: {
						backgroundColor: theme.background,
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
				itemLayoutAnimation={LinearTransition}
				renderItem={({ item }) => (
					<ListItem
						lists={lists}
						listKey={currentList.key}
						item={item}
						onListChange={(nextLists: List[]) => {
							setLists(nextLists);
							saveData(nextLists);
						}}
					/>
				)}
			/>
		</SafeAreaView>
	)
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
		},
		listContainer: {
			flex: 1,
			paddingHorizontal: 8,
		},
	});
}