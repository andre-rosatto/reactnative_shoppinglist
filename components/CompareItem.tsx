import { COLORS } from "@/constants/colors";
import { PricedItem } from "@/typings/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Appearance, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface CompareItem {
	item: PricedItem;
	onTitleChange: (newTitle: string) => void;
	onPriceChange: (newPrice: number) => void;
	onAmountChange: (newAmount: number) => void;
	onDeletePress: () => void;
}

export default function CompareItem({
	item,
	onTitleChange,
	onPriceChange,
	onAmountChange,
	onDeletePress,
}: CompareItem) {
	const [itemTitle, setItemTitle] = useState(() => item.title);
	const [itemPrice, setItemPrice] = useState(() => item.price.toFixed(2));
	const [itemAmount, setItemAmount] = useState(() => item.amount.toFixed(2));

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	const pricePerUnit = () => formatNumber(itemPrice) / (formatNumber(itemAmount) || 1);

	const formatNumber = (val: string) => {
		const match = val.replaceAll(',', '.').match(/[\d\.]+/);
		return parseFloat(match ? match[0] : '0');
	}

	return (
		<View style={styles.listItem}>

			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<TextInput
						style={styles.titleInput}
						selectTextOnFocus
						value={itemTitle}
						onChangeText={setItemTitle}
						onBlur={() => onTitleChange(itemTitle)}
					/>
					<Pressable
						style={styles.deleteIcon}
						onPress={() => onDeletePress()}
					>
						<Ionicons name="trash" size={24} color={theme.alert} />
					</Pressable>
				</View>

				<View style={styles.dataContainer}>

					<View style={styles.compareField}>
						<Text style={styles.itemLabel}>Preço</Text>
						<TextInput
							style={[
								styles.itemInput,
								parseFloat(itemPrice) < 0.01 && styles.inputAlert
							]}
							selectTextOnFocus
							keyboardType="numeric"
							maxLength={7}
							value={itemPrice}
							onChangeText={setItemPrice}
							onBlur={() => {
								const value = formatNumber(itemPrice);
								setItemPrice(value.toFixed(2));
								onPriceChange(value);
							}}
						/>
					</View>

					<View style={styles.compareField}>
						<Text style={styles.itemLabel}>Quantidade</Text>
						<TextInput
							style={[
								styles.itemInput,
								parseFloat(itemAmount) < 0.01 && styles.inputAlert
							]}
							selectTextOnFocus
							keyboardType="numeric"
							maxLength={7}
							value={itemAmount}
							onChangeText={setItemAmount}
							onBlur={() => {
								const value = formatNumber(itemAmount);
								setItemAmount(value.toFixed(2));
								onAmountChange(value);
							}}
						/>
					</View>

					<View style={styles.ratioField}>
						<Text style={[styles.itemLabel, styles.rationLabel]}>Preço/unid.</Text>
						<Text style={styles.itemResult}>{pricePerUnit().toFixed(2)}</Text>
					</View>

				</View>
			</View>


		</View>
	);
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		listItem: {
			flex: 1,
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 4,
			paddingHorizontal: 8,
			paddingBottom: 4,
			marginBottom: 4,
		},
		container: {
			flex: 1,
			justifyContent: 'space-between',
			marginBottom: 4,
		},
		titleContainer: {
			flexDirection: 'row',
			gap: 8,
		},
		titleInput: {
			flex: 1,
			color: theme.text,
			fontSize: 18,
		},
		dataContainer: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			gap: 10,
		},
		compareField: {
			flex: 1,
			gap: 4,
		},
		itemLabel: {
			fontSize: 12,
			color: theme.text,
		},
		itemInput: {
			fontSize: 14,
			color: theme.text,
			borderColor: theme.placeholder,
			borderWidth: 1,
			paddingHorizontal: 8,
			borderRadius: 4,
		},
		inputAlert: {
			borderColor: theme.alert,
		},
		ratioField: {
			width: 100,
			marginRight: 8,
		},
		rationLabel: {
			textAlign: 'right',
		},
		itemResult: {
			fontSize: 20,
			color: theme.text,
			flex: 1,
			textAlignVertical: 'center',
			textAlign: 'right',
		},
		deleteIcon: {
			marginTop: 8,
		},
	});
}