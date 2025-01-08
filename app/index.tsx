import { Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from "react";
import { List } from "@/typings/types";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { createStyles } from "@/globals/utils";
import ListItem from "@/components/ListItem";
import AddIemBar from "@/components/AddItemBar";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { STORAGE_NAME } from "@/globals/env";
import { Stack, useFocusEffect } from "expo-router";
import { COLORS } from "@/globals/colors";

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);
	const { loadStorage, saveStorage } = useAsyncStorage<List[]>(STORAGE_NAME);

	useFocusEffect(useCallback(() => {
		loadStorage(data => setLists(data));
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
		saveStorage(nextLists);
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
							saveStorage(nextLists);
						}}
					/>
				)}
			/>
		</SafeAreaView>
  );
}


