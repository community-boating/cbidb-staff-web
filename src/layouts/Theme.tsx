import * as React from 'react';
import { connect } from 'react-redux';

export enum ThemeType {
    DEFAULT = "my-theme"
}

export type ThemeProps = {
    theme?: ThemeType,
    children?: React.ReactNode,
}

function Theme(props: ThemeProps){
    return <span className={(props.theme == undefined ? ThemeType.DEFAULT : props.theme) + " bg-background"}>{props.children}</span>;
}

export default connect((store: any) => ({
	app: store.app
}))(Theme);