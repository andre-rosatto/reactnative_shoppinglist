import { Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { isLists, List } from "@/typings/types";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { createStyles } from "@/globals/utils";
import ListItem from "@/components/ListItem";
import AddIemBar from "@/components/AddItemBar";
import useAsyncStorage from "@/hooks/useAsyncStorage";
import { STORAGE_NAME } from "@/globals/env";

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);
	const { data, saveStorage } = useAsyncStorage<List[]>(STORAGE_NAME);

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


