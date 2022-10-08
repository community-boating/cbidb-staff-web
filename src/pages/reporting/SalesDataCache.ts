import { SalesRecord } from "async/rest/membership-sale"

type AggregateUnit = {
	count: number,
	value: number
}

type GenericSalesCache = {
	[K: number]: SalesCache,
	total: AggregateUnit
}

type SalesCache = GenericSalesCache & {
	[K_Year: number]: {
		[K_Month: number]: {
			[K_Date: number]: {
				[K_MembershipTypeId: number]: {
					[K_DiscountInstanceId: number]: {
						[K_UnitPrice: number]: {
							total: AggregateUnit
						},
						total: AggregateUnit
					},
					total: AggregateUnit
				},
				total: AggregateUnit
			},
			total: AggregateUnit
		},
		total: AggregateUnit
	}
}

export function initSalesCache(): SalesCache {
	return Object.assign({}, {total: { count: 0, value: 0 }})
}


export function addSales(year: number, cache: GenericSalesCache, ss: SalesRecord[]): GenericSalesCache {
	if (cache[year]) return cache;
	return ss.reduce((newCache, s) => {
		return addSale(newCache, s)
	}, cache);
}

export function addSale(cache: GenericSalesCache, s: SalesRecord): GenericSalesCache {
	const keys = saleToCacheKeys(s);
	if (keys == null) return cache;
	return addToTreeRecursively(cache, keys, s.price);
}

function addToTreeRecursively(tree: GenericSalesCache, ks: number[], value: number): GenericSalesCache {
	tree.total.count += 1;
	tree.total.value += value;
	if (ks.length > 0) {
		const key = ks[0];
		tree[key] = tree[key] || initSalesCache();
		return {
			...tree,
			[key]: addToTreeRecursively(tree[key], ks.slice(1), value)
		};
	} else {
		return tree;
	}
}

function saleToCacheKeys(s: SalesRecord) {
	return s.purchaseDate.map(d => [
		Number(d.format("YYYY")),
		Number(d.format("MM")),
		Number(d.format("DD")),
		s.membershipTypeId,
		s.discountInstanceId.getOrElse(-1),
		s.price
	]).getOrElse(null)
}