import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Appearance, Pressable, StyleSheet, TextInput, View } from "react-native";

interface NoteItemProps {
	text: string;
	onChange: (newText: string) => void;
	onDeletePress: () => void;
}

export default function NoteItem({ text, onChange, onDeletePress }: NoteItemProps) {
	const [noteText, setNoteText] = useState(text);

	const theme = Appearance.getColorScheme() === 'dark' ? COLORS.dark : COLORS.light;
	const styles = createStyles(theme);

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				multiline
				autoFocus
				value={noteText}
				onChangeText={setNoteText}
				onBlur={() => onChange(noteText)}
			/>

			<Pressable onPress={onDeletePress}>
				<Ionicons name="trash" size={24} color={theme.alert} />
			</Pressable>
		</View>
	);
}

const createStyles = (theme: typeof COLORS.light) => {
	return StyleSheet.create({
		container: {
			borderWidth: 1,
			borderColor: theme.border,
			borderRadius: 4,
			flexDirection: 'row',
			justifyContent: 'space-between',
			gap: 4,
			paddingHorizontal: 8,
			paddingVertical: 8,
			marginBottom: 6,
		},
		input: {
			flex: 1,
			fontSize: 16,
			color: theme.text,
		},
	});
}