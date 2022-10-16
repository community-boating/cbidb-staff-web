import { SalesRecord } from "async/rest/membership-sale"
import * as _ from 'lodash'

type AggregateUnit = {
	count: number,
	value: number
}

type GenericSalesCache = {
	total: AggregateUnit,
	values: {
		[K: string]: GenericSalesCache
	}
}

type CacheKey = {
	year?: string,
	month?: string,
	day?: string,
	membershipTypeId?: string,
	discountInstanceId?: string,
	unitPrice?: string
}

type SearchKey = {
	[K in keyof CacheKey]: string[]
}

export function cacheKeyToCacheArray(c: CacheKey): string[] {
	return [c.year, c.month, c.day, c.membershipTypeId, c.discountInstanceId, c.unitPrice];
}

export function searchKeyToSearchArray(c: SearchKey): string[][] {
	const ret = [
		c.year,
		c.month,
		c.day,
		c.membershipTypeId,
		c.discountInstanceId,
		c.unitPrice
	];
	return (_.dropWhile(ret, e => e === undefined)).map(e => e || []);
}

export type DashboardSalesCache = GenericSalesCache & {
	total: AggregateUnit,
	values: {
		[K_Year: string]: {
			total: AggregateUnit,
			values: {
				[K_Month: string]: {
					total: AggregateUnit,
					values: {
						[K_Date: string]: {
							total: AggregateUnit,
							values: {
								[K_MembershipTypeId: string]: {
									total: AggregateUnit,
									values: {
										[K_DiscountInstanceId: string]: {
											total: AggregateUnit,
											values: {
												[K_UnitPrice: string]: {
													total: AggregateUnit,
													values: {}
												},
											}
										},
									}
								},
							}
						},
					}
				},
			}
		}
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

export function initSalesCache(): DashboardSalesCache {
	return Object.assign({}, {total: { count: 0, value: 0 }, values: {}})
}

export function addSales(year: number, cache: GenericSalesCache, ss: SalesRecord[], getValue: (s: SalesRecord) => number): GenericSalesCache {
	if (cache.values[year]) return cache;
	return ss.reduce((newCache, s) => {
		return addSale(newCache, s, getValue)
	}, cache);
}

export function addSale(cache: GenericSalesCache, s: SalesRecord, getValue: (s: SalesRecord) => number): GenericSalesCache {
	const keys = saleToCacheKeyList(s);
	if (keys == null) return cache;
	return addToTreeRecursively(cache, keys, getValue(s));
}

function addToTreeRecursively(tree: GenericSalesCache, ks: string[], value: number): GenericSalesCache {
	tree.total.count += 1;
	tree.total.value += value;
	if (ks.length > 0) {
		const key = ks[0];
		tree.values[key] = tree.values[key] || initSalesCache();
		return {
			...tree,
			values: {
				...tree.values,
				[key]: addToTreeRecursively(tree.values[key], ks.slice(1), value)
			}
		};
	} else {
		return tree;
	}
}

function saleToCacheKeyList(s: SalesRecord): string[] {
	return s.purchaseDate.map(d => cacheKeyToCacheArray({
		year: d.format("YYYY"),
		month: String(Number(d.format("MM"))),
		day: d.format("DD"),
		membershipTypeId: String(s.membershipTypeId),
		discountInstanceId: String(s.discountInstanceId.getOrElse(-1)),
		unitPrice: String(s.price)
	})).getOrElse(null)
}
