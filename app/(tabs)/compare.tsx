import AddIemBar from "@/components/AddItemBar";
import { COLORS } from "@/globals/colors";
import { createStyles } from "@/globals/utils";
import { PricedItem } from "@/typings/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Appearance, Pressable, Text, TextInput, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type EditItem = {
	key: string | null,
	value: string,
	field: 'title' | 'price' | 'amount'
};

export default function Compare() {
	const [items, setItems] = useState<PricedItem[]>([]);
	const [editItem, setEditItem] = useState<EditItem>({
		key: null,
		value: '',
		field: 'title'
	});

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
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
		setItems([{
			key: Date.now().toString(),
			title: val,
			price: 0,
			amount: 0
		}, ...items]);
	}
	
	const handleDeletePress = (item: PricedItem) => setItems(items => items.filter(i => i.key !== item.key));

	const handleTitleChange = (item: PricedItem) => {
		setItems(items => items.map(i => i.key !== item.key ? i : {...item, title: editItem.value}));
		setEditItem(editItem => ({...editItem, key: null}))
	}

	const handlePriceChange = (item: PricedItem) => {
		setItems(items => items.map(i => i.key !== item.key ? i : {...item, price: Math.abs(parseFloat(editItem.value))}));
		setEditItem(editItem => ({...editItem, key: null}))
	}

	const handleAmountChange = (item: PricedItem) => {
		setItems(items => items.map(i => i.key !== item.key ? i : {...item, amount: Math.max(0.01, parseFloat(editItem.value))}));
		setEditItem(editItem => ({...editItem, key: null}))
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: `Comparar Produtos`,
					headerTitleAlign: 'center',
					headerTintColor: COLORS[theme].text,
					headerStyle: {
						backgroundColor: COLORS[theme].background,
					}
				}}
			/>

			<StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

			<AddIemBar
				type="item"
				onAddPress={handleAddPress}
			/>

			<Animated.FlatList
				style={styles.listContainer}
				itemLayoutAnimation={LinearTransition}
				data={sortItems()}
				renderItem={({ item }) => (
					<View style={styles.listItem}>

						<View style={styles.compareContainer}>
							<TextInput
								style={styles.text}
								selectTextOnFocus
								value={(editItem.key === item.key && editItem.field === 'title') ? editItem.value : item.title}
								onChangeText={val => setEditItem(editItem => ({...editItem, value: val}))}
								onFocus={() => setEditItem({key: item.key, value: item.title, field: 'title'})}
								onBlur={() => handleTitleChange(item)}
							/>

							<View style={styles.compareDataContainer}>
								
								<View style={styles.compareField}>
									<Text style={styles.compareItemLabel}>Preço</Text>
									<TextInput
										style={[
											styles.compareItemInput,
											item.price < 0.01 && styles.inputAlert
										]}
										selectTextOnFocus
										keyboardType="numeric"
										value={(editItem.key === item.key && editItem.field === 'price') ? editItem.value : item.price.toFixed(2)}
										onChangeText={val => setEditItem(editItem => ({...editItem, value: val}))}
										onFocus={() => setEditItem({key: item.key, value: item.price.toFixed(2), field: 'price'})}
										onBlur={() => handlePriceChange(item)}
									/>
								</View>
								
								<View style={styles.compareField}>
									<Text style={styles.compareItemLabel}>Quantidade</Text>
									<TextInput
										style={[
											styles.compareItemInput,
											item.amount < 0.01 && styles.inputAlert
										]}
										selectTextOnFocus
										keyboardType="numeric"
										value={(editItem.key === item.key && editItem.field === 'amount') ? editItem.value : item.amount.toFixed(2)}
										onChangeText={val => setEditItem(editItem => ({...editItem, value: val}))}
										onFocus={() => setEditItem({key: item.key, value: item.amount.toFixed(2), field: 'amount'})}
										onBlur={() => handleAmountChange(item)}
									/>
								</View>

								<View>
									<Text style={styles.compareItemLabel}>Preço/unid.</Text>
									<Text style={styles.compareItemResult}>{pricePerUnit(item).toFixed(2)}</Text>
								</View>

							</View>
						</View>

						<Pressable onPress={() => handleDeletePress(item)}>
							<Ionicons name="trash" size={24} color={COLORS[theme].alert} />
						</Pressable>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}