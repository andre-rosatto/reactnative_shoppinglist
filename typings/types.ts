export type PricedItem = {
	key: string;
	title: string;
	price: number;
	amount: number;
}

export type Item = {
	key: string;
	title: string;
	bought: boolean;
}

export const isItem = (obj: any): obj is Item => {
	return (
		'key' in obj
		&& 'title' in obj
		&& 'bought' in obj
	);
}

export type List = {
	key: string;
	title: string;
	items: Item[];
}

export const isList = (obj: any): obj is List => {
	return (
		'key' in obj
		&& 'title' in obj
		&& 'items' in obj
	);
}

export type Note = {
	key: string;
	text: string;
}