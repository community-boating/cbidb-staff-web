import * as React from 'react';

export enum LayoutDirection {
    VERTICAL = "layout-vertical",
    HORIZONTAL = "layout-horizontal"
}

type CardLayoutChildProps = {
    weight?: number,
    total?: number,
    parentDirection?: LayoutDirection
};

type CardProps = CardLayoutChildProps & {
    children?: React.ReactNode,
    title: string
}

export function Padding(props: CardLayoutChildProps & {children?: React.ReactNode}){
    return <div className="padding" style={getChildStyling(props)}>{props.children}</div>
}

export function Card(props: CardProps){
    return <Padding {...props}><div className="card"><h2 className="title">{props.title}</h2><div className="card-inner">{props.children}</div></div></Padding>;
}

type CardLayoutProps = CardLayoutChildProps & {
    children?: React.ReactNode,
    direction: LayoutDirection
}

function getWeight(props: CardLayoutChildProps){
    if(props.weight !== undefined){
        return props.weight;
    }else{
        return 1;
    }
}

function getChildStyling(props: CardLayoutChildProps): React.CSSProperties{
    const adjusted = getWeight(props) / props.total * 100;
    if(props.parentDirection == LayoutDirection.HORIZONTAL){
        return {width: adjusted + "%"};
    }else{
        return {height: adjusted + "%"};
    }
}

export function CardLayout(props: CardLayoutProps){
    var total = 0;
    React.Children.forEach(props.children, (child) => {
        if(React.isValidElement(child)){
            total += getWeight(child.props);
        }
    });
    const children = React.Children.map(props.children, (child: React.ReactElement<CardLayoutChildProps>) => {
        if(React.isValidElement(child)){
            return React.cloneElement(child, {total, parentDirection: props.direction});
        }
        return child;
    });
    return <Padding {...props}><div className={props.direction}>{children}</div></Padding>;
}