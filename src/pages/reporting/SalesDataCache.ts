import * as _ from 'lodash'

export type AggregateUnit = {
	count: number,
	value: number
}

export type GenericSalesCache = {
	total: AggregateUnit,
	values: {
		[K: string]: GenericSalesCache
	}
}

export function evaluateTreePerValue(tree: GenericSalesCache, searchKeys: string[][]): AggregateUnit[] {
	return Object.keys(tree.values).map(v => evaluateTree(tree.values[v], searchKeys));
}

export function evaluateTree(tree: GenericSalesCache, searchKeys: string[][]): AggregateUnit {
	const subValues = Object.keys(tree.values);

	if (subValues.length == 0) return tree.total;
	if (searchKeys.reduce((agg, e) => agg + e.length, 0) == 0) return tree.total;

	const searchKey = searchKeys[0];

	const valuesToAggregate = (
		searchKey.length > 0
		? searchKey
		: subValues
	)

	return valuesToAggregate.reduce((agg, v) => {
		const recurseValues = evaluateTree(tree.values[v] || initSalesCache(), searchKeys.slice(1));
		const ret = {
			count: agg.count + recurseValues.count,
			value: agg.value + recurseValues.value
		};
		return ret;
	}, initSalesCache().total);
}

export function initSalesCache(): GenericSalesCache {
	return Object.assign({}, {total: { count: 0, value: 0 }, values: {}})
}

export function addSale(cache: GenericSalesCache, keys: string[], count: number, value: number): GenericSalesCache {
	return addToTreeRecursively(cache, keys, count, value);
}

function addToTreeRecursively(tree: GenericSalesCache, ks: string[], count: number, value: number): GenericSalesCache {
	tree.total.count += count;
	tree.total.value += value;
	if (ks.length > 0) {
		const key = ks[0];
		tree.values[key] = tree.values[key] || initSalesCache();
		return {
			...tree,
			values: {
				...tree.values,
				[key]: addToTreeRecursively(tree.values[key], ks.slice(1), count, value)
			}
		};
	} else {
		return tree;
	}
}
