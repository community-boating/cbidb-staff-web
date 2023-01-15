import * as React from 'react';
import APIWrapper from './APIWrapper';
import * as t from 'io-ts';
import Spinner from 'components/wrapped/Spinner';
import { AppStateContext } from 'app/state/AppStateContext';

export type AsyncStateProviderProps<T_Validator extends t.Any> = {
    apiWrapper: APIWrapper<T_Validator, any, any>
    spinnerOnInit?: boolean
    initState?: t.TypeOf<T_Validator>
    makeChildren: (state: t.TypeOf<T_Validator>, setState: React.Dispatch<React.SetStateAction<t.TypeOf<T_Validator>>>, providerState?: ProviderState) => React.ReactNode
}

export enum ProviderState{
    INITIAL, ERROR, SUCCESS
}

type AsyncStateProviderState<T_Validator extends t.Any> = {
    mainState: t.TypeOf<T_Validator>
    providerState: ProviderState
}

export default class AsyncStateProvider<T_Validator extends t.Any> extends React.Component<AsyncStateProviderProps<T_Validator>, AsyncStateProviderState<T_Validator>> {
    constructor(props){
        super(props);
        this.state = {mainState:props.initState, providerState: ProviderState.INITIAL};
        this.setState = this.setState.bind(this);
        this.loadAsync();
        this.render = this.render.bind(this);
    }
    loadAsync(){
        this.props.apiWrapper.send(this.context).then((a) => {
            if(a.type == "Success"){
                this.setState({mainState: a.success, providerState: ProviderState.SUCCESS});
            }else{
                this.setState((s) => ({...s, providerState: ProviderState.ERROR}));
            }
        });
    }
    render(): React.ReactNode {
        if(this.state.providerState == ProviderState.ERROR){
            return <p className="text-red-100">Error Loading</p>
        }
        if(this.props.spinnerOnInit && this.state.providerState == ProviderState.INITIAL){
            return <p>derp</p>;
        }
        return <>{this.props.makeChildren(this.state.mainState, this.setState, this.state.providerState)}</>;
    }
}
AsyncStateProvider.contextType = AppStateContext;