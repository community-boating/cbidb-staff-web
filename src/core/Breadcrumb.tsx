import * as React from "react";

export interface State {
    display: JSX.Element,
    path: string
}

export interface Props {
    prevStates: State[],
    currState: State,
    nextStates: State[]
}

export default abstract class Breadcrumb extends React.PureComponent<Props> {
    abstract renderStates(): JSX.Element
    render() {
        return this.renderStates()
    }
}