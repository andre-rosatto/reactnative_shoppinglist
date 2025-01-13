import { COLORS } from "@/globals/colors";
import { createStyles, getCurrentDate } from "@/globals/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Appearance, Pressable, TextInput, View } from "react-native";

interface AddItemBarProps {
	type: 'list' | 'item',
	onAddPress: (val: string) => void
}

export default function AddIemBar({ type, onAddPress }: AddItemBarProps) {
	const [newItem, setNetItem] = useState<string>('');

	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
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
		<View style={styles.inputContainer}>
			<TextInput
				style={[styles.text, styles.input]}
				placeholderTextColor={COLORS[theme].placeholder}
				placeholder={type === 'list' ? getCurrentDate() : 'Novo item'}
				value={newItem}
				onChangeText={setNetItem}
			/>
			<Pressable onPress={handleAddPress}>
				<Ionicons name="add-circle-outline" size={48} color={COLORS[theme].text} />
			</Pressable>
		</View>
	);
}