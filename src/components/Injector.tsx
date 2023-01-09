import * as React from 'react';
import RadioGroup from './wrapped/RadioGroup';

export function Injectable<T>(props: {receives?: (item: T) => boolean, children: ((item: T) => React.ReactNode)}){
    return <>derp</>;
}

export function Injector<T>(props: {item: T, children: React.ReactNode}){
    const children = injectRecurse(props.item, props.children, 0);
    return <>{children}</>;
}

export function findChildren(a: React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>){
    if(React.isValidElement(a.props.children)){
        return a.props.children;
    }
    if(a && typeof a.type == "function"){
        return a.type.call(a.type, a.props);
    }
    return a.props.children;
}

function injectRecurse<T>(item: T, children: React.ReactNode, depth: number): React.ReactNode {
    if(depth > 10){
        return children;
    }
    const childrenMapped = React.Children.map(React.Children.toArray(children), (a, i) => {
        if(React.isValidElement(a)){
            if(a.type == Injectable && (!a.props.receives || a.props.receives(item))){
                return a.props.children(item);
            }
            if(a.type == React.Fragment){
                return a;
            }
            if(a && typeof a.type == "function"){
                const b = a.type.call(a.type, a.props);
                return b;
            }
            return injectRecurse(item, findChildren(a.props.children), depth+1);
        }
        return a;
    });
    return childrenMapped;
}