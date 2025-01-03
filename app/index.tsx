import { Colors } from "@/constants/Colors";
import { Appearance, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { List } from "@/typings/List";
import Animated, { LinearTransition } from 'react-native-reanimated';

export default function Index() {
	const [lists, setLists] = useState<List[]>([]);
	const [newList, setNewList] = useState('');

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	const styles = createStyles(theme);

	const handleAddPress = () => {
		setLists([{
			key: Date.now().toString(),
			title: newList || getCurrentDate()
		}, ...lists]);
		setNewList('');
	}

	const handleDeletePress = (item: List) => {
		setLists(lists => lists.filter(list => list.key !== item.key));
	}

  return (
    <SafeAreaView style={styles.container}>
			<StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

			<View style={styles.inputContainer}>
				<TextInput
					style={[styles.text, styles.input]}
					placeholderTextColor={Colors[theme].placeholder}
					placeholder={getCurrentDate()}
					value={newList}
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
						<Text style={styles.text}>{item.title}</Text>
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
			borderBottomWidth: 1,
			borderBottomColor: Colors[theme].border,
			padding: 10,
		}
	});
}
