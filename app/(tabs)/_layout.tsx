import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Appearance } from "react-native";

export default function TabLayout() {
	const theme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: COLORS[theme].text,
				tabBarInactiveTintColor: COLORS[theme].placeholder,
				tabBarStyle: {
					backgroundColor: COLORS[theme].background
				}
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Listas',
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'list-circle' : 'list-circle-outline'}
							color={focused ? COLORS[theme].text : COLORS[theme].placeholder}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="notes"
				options={{
					title: 'Anotações',
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'document-text' : 'document-text-outline'}
							color={focused ? COLORS[theme].text : COLORS[theme].placeholder}
							size={24}
						/>
					)
				}}
			/>
			<Tabs.Screen
				name="compare"
				options={{
					title: 'Comparar',
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? 'pricetags' : 'pricetags-outline'}
							color={focused ? COLORS[theme].text : COLORS[theme].placeholder}
							size={24}
						/>
					)
				}}
			/>
		</Tabs>
	);
}
