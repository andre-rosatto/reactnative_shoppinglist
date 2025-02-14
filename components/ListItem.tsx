import { COLORS } from "@/constants/colors";
import { Item, List, isItem, isList } from "@/typings/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Appearance, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";

interface ListItemProps {
	lists: List[],
	listKey: string,
	item: List | Item,
	onListChange: (newList: List[]) => void
}

export default function ListItem({
	lists,
	listKey,
	item,
	onListChange
}: ListItemProps) {
	const [editKey, setEditKey] = useState<string | null>(null);
	const router = useRouter();

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	const handleItemPress = () => {
		if (isList(item)) {
			router.push(`lists/${item.key}` as Href);
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.map(i => i.key !== item.key ? i : { ...i, bought: !i.bought });
			onListChange(nextLists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	const handleChangeText = (val: string) => {
		if (isList(item)) {
			const nextLists = lists.map(list => list.key !== item.key ? list : { ...list, title: val });
			onListChange(nextLists);
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.map(i => i.key !== item.key ? i : { ...i, title: val });
			onListChange(nextLists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	const handleDeletePress = () => {
		if (isList(item)) {
			onListChange(lists.filter(list => list.key !== item.key));
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.filter(i => i.key !== item.key);
			onListChange(nextLists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	const isComplete = (
		(isList(item) && item.items.length > 0 && item.items.every(i => i.bought))
		|| (isItem(item) && item.bought)
	);

	return (
		<View style={styles.listItem}>

			<Pressable style={styles.itemText}
				onPress={handleItemPress}
				onLongPress={() => setEditKey(item.key)}
			>
				{isComplete && <Ionicons name="checkmark" size={24} style={styles.itemCheck} />}

				{item.key === editKey
					? <TextInput
						style={[styles.text, styles.input]}
						value={item.title}
						onChangeText={handleChangeText}
						onBlur={() => setEditKey(null)}
						selectTextOnFocus
						autoFocus
					/>
					: <Text
						style={[styles.text, isComplete && styles.itemBought]}
					>{item.title}</Text>}
			</Pressable>

			<Pressable onPress={handleDeletePress}>
				<Ionicons name="trash" size={24} color={theme.alert} />
			</Pressable>
		</View>
	);
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		listItem: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 4,
			paddingVertical: 4,
			paddingLeft: 2,
			paddingRight: 8,
			gap: 20,
			marginBottom: 4,
		},
		itemText: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 2,
			paddingVertical: 10,
			paddingHorizontal: 8,
		},
		itemCheck: {
			color: theme.text,
			width: 24,
		},
		text: {
			color: theme.text,
			fontSize: 18,
		},
		input: {
			paddingVertical: 0,
			paddingHorizontal: 0,
			flex: 1,
		},
		itemBought: {
			color: theme.placeholder,
			textDecorationLine: 'line-through',
		},
	});
}