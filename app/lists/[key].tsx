import AddIemBar from "@/components/AddItemBar";
import ListItem from "@/components/ListItem";
import { Colors } from "@/constants/Colors";
import { createStyles } from "@/globals/utils";
import { isLists, Item, List } from "@/typings/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
	const { key } = useLocalSearchParams();
	const [lists, setLists] = useState<List[]>([]);
	const [newItem, setNewItem] = useState<string>('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem('ShoppingList');
				const storageLists = jsonValue !== null ? JSON.parse(jsonValue) : [];
				if (isLists(storageLists)) {
					setLists(storageLists);
				}
			} catch (err) {
				console.error(err);
			}
		}
		fetchData();
	}, []);

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);
	const currentList = lists.find(list => list.key === key);

	useEffect(() => {
		const storeData = async () => {
			try {
				const jsonValue = JSON.stringify(lists);
				await AsyncStorage.setItem('ShoppingList', jsonValue);
			} catch (err) {
				console.error(err);
			}
		}
		storeData();
	}, [lists]);

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
					headerTintColor: Colors[theme].text,
					headerStyle: {
						backgroundColor: Colors[theme].background,
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