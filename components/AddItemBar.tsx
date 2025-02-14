import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Appearance, Pressable, StyleSheet, TextInput, View } from "react-native";

interface AddItemBarProps {
	type: 'list' | 'item',
	onAddPress: (val: string) => void
}

export const getCurrentDate = (): string => {
	return new Date().toLocaleDateString();
}

export default function AddIemBar({ type, onAddPress }: AddItemBarProps) {
	const [newItem, setNetItem] = useState<string>('');

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	const handleAddPress = () => {
		switch (type) {
			case 'list':
				onAddPress(newItem || getCurrentDate());
				break;
			default:
				onAddPress(newItem || 'Novo item');
		}
		setNetItem('');
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={[styles.text, styles.input]}
				placeholderTextColor={theme.placeholder}
				placeholder={type === 'list' ? getCurrentDate() : 'Novo item'}
				value={newItem}
				onChangeText={setNetItem}
			/>
			<Pressable onPress={handleAddPress}>
				<Ionicons name="add-circle-outline" size={40} color={theme.text} />
			</Pressable>
		</View>
	);
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		container: {
			padding: 8,
			flexDirection: 'row',
			gap: 8,
			alignItems: 'center',
		},
		text: {
			color: theme.text,
			fontSize: 18,
			padding: 8,
		},
		input: {
			borderWidth: 1,
			borderRadius: 4,
			padding: 8,
			borderColor: theme.border,
			flex: 1,
		},
	});
}