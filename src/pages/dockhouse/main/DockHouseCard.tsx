import * as React from 'react';

export enum LayoutDirection {
    VERTICAL = "dockhousecardlayoutvertical",
    HORIZONTAL = "dockhousecardlayouthorizontal"
}

type DockHouseCardLayoutChildProps = {
    weight?: number,
    total?: number,
    parentDirection?: LayoutDirection
};

type DockHouseCardProps = DockHouseCardLayoutChildProps & {
    children?: React.ReactNode,
    title: string
}

export function Padding(props: DockHouseCardLayoutChildProps & {children?: React.ReactNode}){
    return <div className="padding" style={getChildStyling(props)}>{props.children}</div>
}

export function DockHouseCard(props: DockHouseCardProps){
    return <Padding {...props}><div className="dockhousecard"><h2>{props.title}</h2><div className="dockhousecardinner">{props.children}</div></div></Padding>;
}

type DockHouseCardLayoutProps = DockHouseCardLayoutChildProps & {
    children?: React.ReactNode,
    direction: LayoutDirection
}

function getWeight(props: DockHouseCardLayoutChildProps){
    if(props.weight !== undefined){
        return props.weight;
    }else{
        return 1;
    }
}

function getChildStyling(props: DockHouseCardLayoutChildProps): React.CSSProperties{
    const adjusted = getWeight(props) / props.total * 100;
    if(props.parentDirection == LayoutDirection.HORIZONTAL){
        return {width: adjusted + "%"};
    }else{
        return {height: adjusted + "%"};
    }
}

export function DockHouseCardLayout(props: DockHouseCardLayoutProps){
    var total = 0;
    React.Children.forEach(props.children, (child) => {
        if(React.isValidElement(child)){
            total += getWeight(child.props);
        }
    });
    const children = React.Children.map(props.children, (child: React.ReactElement<DockHouseCardLayoutChildProps>) => {
        if(React.isValidElement(child)){
            return React.cloneElement(child, {total, parentDirection: props.direction});
        }
        return child;
    });
    return <Padding {...props}><div className={props.direction}>{children}</div></Padding>;
}