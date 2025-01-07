import { COLORS } from "@/globals/colors";
import { createStyles } from "@/globals/utils";
import { isItem, isList, Item, List } from "@/typings/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { Appearance, Pressable, Text, TextInput } from "react-native";
import { View } from "react-native";

interface ListItemProps {
	lists: List[],
	listKey: string,
	item: List | Item,
	setLists: React.Dispatch<React.SetStateAction<List[]>>,
}

export default function ListItem({
	lists,
	listKey,
	item,
	setLists,
}: ListItemProps) {
	const [editKey, setEditKey] = useState<string | null>(null);
	const router = useRouter();

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);

	const handleItemPress = () => {
		if (isList(item)) {
			router.push(`lists/${item.key}` as Href);
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.map(i => i.key !== item.key ? i : {...i, bought: !i.bought});
			setLists(lists => lists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	const handleChangeText = (val: string) => {
		if (isList(item)) {
			setLists(lists =>
				lists.map(list =>
					list.key !== item.key ? list : {...list, title: val}
				)
			);
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.map(i => i.key !== item.key ? i : {...i, title: val});
			setLists(lists => lists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	const handleDeletePress = () => {
		if (isList(item)) {
			setLists(lists => lists.filter(list => list.key !== item.key));
		} else if (isItem(item)) {
			const nextLists = [...lists];
			const currentList = nextLists.find(list => list.key === listKey);
			if (!currentList) return;
			currentList.items = currentList.items.filter(i => i.key !== item.key);
			setLists(lists => lists.map(list => list.key !== currentList.key ? list : currentList));
		}
	}

	return (
		<View style={styles.listItem}>

			<Pressable style={styles.itemText}
				onPress={handleItemPress}
				onLongPress={() => setEditKey(item.key)}
			>
				{(isItem(item) && item.bought) && <Ionicons name="checkmark" size={24} style={styles.itemCheck} />}


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
					style={[styles.text, (isItem(item) && item.bought) && styles.itemBought]}
				>{item.title}</Text>}
			</Pressable>

			<Pressable onPress={handleDeletePress}>
				<Ionicons name="trash" size={24} color={COLORS[theme].alert} />
			</Pressable>
		</View>
	);
}