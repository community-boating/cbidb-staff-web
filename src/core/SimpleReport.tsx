import * as React from 'react';
import BootstrapTable, { BootstrapTableProps, ColumnDescription } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

type SimpleReportRequiredProps<T_Data> = BootstrapTableProps & {
	keyField: keyof T_Data,
	data: T_Data[],
	columns: ColumnDescription[],
	sizePerPage?: number,
	sizePerPageList?: number[] | Array<{ text: string; value: number }>,
}

export class SimpleReport<T_Data> extends React.Component<SimpleReportRequiredProps<T_Data>> {
	render() {
		const pagination = (
			this.props.sizePerPage || this.props.sizePerPageList
			? paginationFactory({
				sizePerPage: this.props.sizePerPage,
				sizePerPageList: this.props.sizePerPageList,
			})
			: null
		);

		return <BootstrapTable
			keyField={this.props.keyField}
			data={this.props.data}
			columns={this.props.columns}
			bootstrap4
			bordered={false}
			pagination={pagination}
		/>;
	}
}
