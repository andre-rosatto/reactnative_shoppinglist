import { Colors } from "@/constants/Colors";
import { Appearance, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { List } from "@/typings/types";
import Animated, { LinearTransition } from 'react-native-reanimated';

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);
	const [newList, setNewList] = useState('');
	const [editKey, setEditKey] = useState<string | null>(null);

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);

	const handleAddPress = () => {
		setLists([{
			key: Date.now().toString(),
			title: newList || getCurrentDate(),
			items: []
		}, ...lists]);
		setNewList('');
	}

	const handleDeletePress = (item: List) => {
		setLists(lists => lists.filter(list => list.key !== item.key));
	}

	const handleItemPress = (item: List) => {
		
	}

	const handleItemLongPress = (item: List) => {
		setEditKey(item.key);
	}

	const handleChangeText = (item: List, val: string) => {
		setLists(lists => lists.map(list => list.key === item.key ? {...list, title: val} : list));
	}

  return (
    <SafeAreaView style={styles.container}>
			<StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

			<View style={styles.inputContainer}>
				<TextInput
					style={[styles.text, styles.input]}
					placeholderTextColor={Colors[theme].placeholder}
					placeholder={getCurrentDate()}
					defaultValue={newList}
					onChangeText={setNewList}
				/>
				<Pressable onPress={handleAddPress}>
					<Ionicons name="add-circle-outline" size={48} color={Colors[theme].text} />
				</Pressable>
			</View>
			<Animated.FlatList
				style={styles.listContainer}
				itemLayoutAnimation={LinearTransition}
				data={lists}
				renderItem={({ item }) => (
					<View style={styles.listItem}>
						<Pressable style={styles.itemText}
							onPress={() => handleItemPress(item)}
							onLongPress={() => handleItemLongPress(item)}
						>
							<TextInput
								style={[styles.text, item.key === editKey && styles.input]}
								value={item.title}
								editable={item.key === editKey}
								onChangeText={val => handleChangeText(item, val)}
								onBlur={() => setEditKey(null)}
								onFocus={e => e.target.focus()}
								selectTextOnFocus
							/>
						</Pressable>
						<Pressable onPress={() => handleDeletePress(item)}>
							<Ionicons name="trash" size={24} color={Colors[theme].alert} />
						</Pressable>
					</View>
				)}
			/>
		</SafeAreaView>
  );
}

const getCurrentDate = (): string => {
	return new Date().toLocaleDateString();
}

const createStyles = (theme: 'dark' | 'light') => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: Colors[theme].background,
		},
		text: {
			color: Colors[theme].text,
			fontSize: 18,
		},
		inputContainer: {
			padding: 10,
			flexDirection: 'row',
			gap: 10,
			alignItems: 'center',
		},
		input: {
			borderWidth: 1,
			borderRadius: 4,
			padding: 10,
			borderColor: Colors[theme].text,
			flex: 1,
		},
		listContainer: {
			flex: 1,
			padding: 10,
		},
		listItem: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderBottomColor: Colors[theme].border,
			padding: 4,
			gap: 20,
		},
		itemText: {
			flex: 1,
		}
	});
}
