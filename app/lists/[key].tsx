import AddIemBar from "@/components/AddItemBar";
import ListItem from "@/components/ListItem";
import { COLORS } from "@/globals/colors";
import { STORAGE_NAME } from "@/globals/env";
import { createStyles } from "@/globals/utils";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { isLists, Item, List } from "@/typings/types";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
	const { key } = useLocalSearchParams();
	const [lists, setLists] = useState<List[]>([]);
	const { data, saveStorage } = useAsyncStorage(STORAGE_NAME)

	useEffect(() => {
		if (data && isLists(data)) {
			setLists(data);
		} else {
			setLists([]);
		}
	}, [data]);

	useEffect(() => saveStorage(lists), [lists]);

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);
	const currentList = lists.find(list => list.key === key);

	if (!currentList) return null;

	const handleNewItemPress = (val: string) => {
		const getNewItem = (): Item => {
			return ({
				key: Date.now().toString(),
				title: val,
				bought: false
			});
		}
		
		setLists(lists =>
			lists.map(list =>
				list.key !== key ? list : {...list, items: [getNewItem(), ...list.items]}
			)
		);
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
				data={currentList.items}
				renderItem={({ item }) => (
					<ListItem
						lists={lists}
						listKey={currentList.key}
						item={item}
						setLists={setLists}
					/>
				)}
			/>
		</SafeAreaView>
	)
}