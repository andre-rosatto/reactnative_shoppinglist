export type PricedItem = {
	key: string;
	title: string;
	price: number;
	amount: number;
}

export function isPricedItem(item: any): item is PricedItem {
	return (
		'key' in item
		&& 'title' in item
		&& 'price' in item
		&& 'amount' in item
	);
}

export type Item = {
	key: string;
	title: string;
	bought: boolean;
}

export function isItem(item: any): item is Item {
	return (
		'key' in item
		&& 'title' in item
		&& 'bought' in item
	);
}

export function isItems(items: any): items is Item[] {
	if (!('length' in items)) return false;
	return (items.length === 0) || (items.length > 0 && isItem(items[0]));
}

export type List = {
	key: string;
	title: string;
	items: Item[];
}

export function isList(item: any): item is List {
	return (
		'key' in item
		&& 'title' in item
		&& 'items' in item
	);
}

export function isLists(items: any): items is List[] {
	if (!('length' in items)) return false;
	return (items.length === 0) || (items.length > 0 && isList(items[0]));
}
