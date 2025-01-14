import { COLORS } from "@/globals/colors";
import { StyleSheet } from "react-native";


export const getCurrentDate = (): string => {
	return new Date().toLocaleDateString();
}

export const createStyles = (theme: 'dark' | 'light') => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: COLORS[theme].background,
		},
		text: {
			color: COLORS[theme].text,
			fontSize: 18,
			padding: 11,
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
			borderColor: COLORS[theme].text,
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
			borderBottomColor: COLORS[theme].border,
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
			color: COLORS[theme].text,
			width: 24,
		},
		itemBought: {
			color: COLORS[theme].placeholder,
			textDecorationLine: 'line-through',
		},
		compareContainer: {
			flex: 1,
			justifyContent: 'space-between',
			marginBottom: 4,
		},
		compareDataContainer: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			gap: 20,
		},
		compareField: {
			flex: 1,
			gap: 4,
		},
		compareItemLabel: {
			fontSize: 12,
			color: COLORS[theme].text,
		},
		compareItemInput: {
			fontSize: 14,
			color: COLORS[theme].text,
			borderColor: COLORS[theme].placeholder,
			borderWidth: 1,
			paddingHorizontal: 8,
			borderRadius: 4,
		},
		compareItemResult: {
			fontSize: 20,
			color: COLORS[theme].text,
			flex: 1,
			textAlignVertical: 'center',
		},
		inputAlert: {
			borderColor: COLORS[theme].alert,
		}
	});
}