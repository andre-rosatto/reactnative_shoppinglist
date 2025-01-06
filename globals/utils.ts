import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const getCurrentDate = (): string => {
	return new Date().toLocaleDateString();
}

export const createStyles = (theme: 'dark' | 'light') => {
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
			flexDirection: 'row',
			alignItems: 'center',
			gap: 2,
		},
		itemCheck: {
			color: Colors[theme].text,
			width: 24,
		},
		itemBought: {
			color: Colors[theme].placeholder,
		}
	});
}