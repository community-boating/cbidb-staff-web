import * as React from 'react';
import {SalesRecord} from "@async/rest/membership-sale"

export const SalesDashboardPage = (props: {sales: {
	"2021": SalesRecord[], "2020": SalesRecord[], "2019": SalesRecord[], "2018": SalesRecord[], "2017": SalesRecord[]
}}) => {
	return <div>{JSON.stringify(props.sales["2018"].slice(0, 10))}</div>
}