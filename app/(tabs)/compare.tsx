import AddIemBar from "@/components/AddItemBar";
import CompareItem from "@/components/CompareItem";
import { COLORS } from "@/constants/colors";
import { COMPARE_STORAGE_NAME } from "@/constants/env";
import useFileSystem from "@/hooks/useFileSystem";
import { PricedItem } from "@/typings/types";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Appearance, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Compare() {
	const [items, setItems] = useState<PricedItem[]>([]);
	const { loadData, saveData } = useFileSystem<PricedItem[]>(COMPARE_STORAGE_NAME);

	useEffect(() => {
		const fetchData = async () => {
			const data = await loadData();
			setItems(data ?? []);
		}
		fetchData();
	}, []);

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	const pricePerUnit = (item: PricedItem): number => item.price / (item.amount || 1);

	const sortItems = (): PricedItem[] => {
		const sortedItems = [...items];
		sortedItems.sort((a, b) => {
			if (a.price < 0.01 || a.amount < 0.01) return -1;
			if (b.price < 0.01 || b.amount < 0.01) return 1;
			return pricePerUnit(a) - pricePerUnit(b);
		});
		return sortedItems;
	}

	const handleAddPress = (val: string) => {
		const nextItems = [{
			key: Date.now().toString(),
			title: val,
			price: 0,
			amount: 0
		}, ...items];
		setItems(nextItems);
		saveData(nextItems);
	}

	const handleDeletePress = (item: PricedItem) => {
		const nextItems = items.filter(i => i.key !== item.key);
		setItems(nextItems);
		saveData(nextItems);
	}

	const handleTitleChange = (item: PricedItem, newTitle: string) => {
		const nextItems = items.map(i => i.key !== item.key ? i : { ...item, title: newTitle });
		setItems(nextItems);
		saveData(nextItems);
	}

	const handlePriceChange = (item: PricedItem, newPrice: number) => {
		setItems(items => items.map(i => i.key !== item.key ? i : { ...item, price: newPrice }));
	}

	const handleAmountChange = (item: PricedItem, newAmount: number) => {
		const nextItems = items.map(i => i.key !== item.key ? i : { ...item, amount: newAmount });
		setItems(nextItems);
		saveData(nextItems);
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={[]}
		>
			<Stack.Screen
				options={{
					headerTitle: `Comparar Produtos`,
					headerTitleAlign: 'center',
					headerTintColor: theme.text,
					headerStyle: {
						backgroundColor: theme.background,
					}
				}}
			/>

			<StatusBar style={theme === COLORS.dark ? 'light' : 'dark'} />

			<AddIemBar
				type="item"
				onAddPress={handleAddPress}
			/>

			<Animated.FlatList
				style={styles.listContainer}
				itemLayoutAnimation={LinearTransition}
				data={sortItems()}
				renderItem={({ item }) => (
					<CompareItem
						item={item}
						onTitleChange={(newTitle) => handleTitleChange(item, newTitle)}
						onPriceChange={(newPrice) => handlePriceChange(item, newPrice)}
						onAmountChange={(newAmount) => handleAmountChange(item, newAmount)}
						onDeletePress={() => handleDeletePress(item)}
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
			paddingHorizontal: 8,
		},
	});
}