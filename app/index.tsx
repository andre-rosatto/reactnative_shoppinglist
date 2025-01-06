import { Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { isLists, List } from "@/typings/types";
import Animated, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStyles } from "@/globals/utils";
import ListItem from "@/components/ListItem";
import AddIemBar from "@/components/AddItemBar";

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);

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

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);

	const handleAddPress = (val: string) => {
		setLists([{
			key: Date.now().toString(),
			title: val,
			items: []
		}, ...lists]);
	}

  return (
    <SafeAreaView style={styles.container}>
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
						setLists={setLists}
					/>
				)}
			/>
		</SafeAreaView>
  );
}


