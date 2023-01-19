import * as React from 'react';
import APIWrapper from './APIWrapper';
import * as t from 'io-ts';
import { AppStateContext } from 'app/state/AppStateContext';

export type AsyncStateProviderProps<T_Validator extends t.Any> = {
    apiWrapper: APIWrapper<T_Validator, any, any>
    spinnerOnInit?: boolean
    initState?: t.TypeOf<T_Validator>
    refreshRate?: number
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
    mounted
    intervalID
    constructor(props){
        super(props);
        this.mounted = false;
        this.state = {mainState:props.initState, providerState: ProviderState.INITIAL};
        this.setState = this.setState.bind(this);
        this.loadAsync();
        this.render = this.render.bind(this);
    }
    loadAsync(){
        this.props.apiWrapper.send(this.context).then((a) => {
            if(!this.mounted){
                return;
            }
            if(a.type == "Success"){
                this.setState({mainState: a.success, providerState: ProviderState.SUCCESS});
            }else{
                this.setState((s) => ({...s, providerState: ProviderState.ERROR}));
            }
        });
    }
    componentDidMount(): void {
        this.mounted = true;
        if(this.props.refreshRate) {
            this.intervalID = setInterval(() => {
                this.loadAsync();
            }, this.props.refreshRate);
        }
    }
    componentWillUnmount(): void {
        this.mounted = false;
        if(this.intervalID){
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
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