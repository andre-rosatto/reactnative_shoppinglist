export type Item = {
	key: string;
	title: string;
	bought: boolean;
}

export type List = {
	key: string;
	title: string;
	items: Item[];
}
