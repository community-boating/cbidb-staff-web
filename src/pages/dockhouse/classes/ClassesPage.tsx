import { AppStateContext } from 'app/state/AppStateContext';
import { getWrapper } from 'async/staff/dockhouse/get-classes';
import { Card, CardLayout, FlexSize, LayoutDirection } from 'components/dockhouse/Card';
import { option } from 'fp-ts';
import * as React from 'react';
import ClassSelector from './ClassSelector';

export default function ClassesPage (props) {
    const asc = React.useContext(AppStateContext);
    getWrapper.sendWithParams(asc, option.none, {programId: 0}).call(undefined);
    return <CardLayout direction={LayoutDirection.VERTICAL}>
        <Card title="Select Class" weight={FlexSize.S_0}>
            <ClassSelector/>
        </Card>
        <CardLayout direction={LayoutDirection.HORIZONTAL}>
                <CardLayout direction={LayoutDirection.VERTICAL}>
                    <Card title="Class Roster (On Land)">

                    </Card>
                    <Card title="Members on waitlist">

                    </Card>
                    <Card title="Add members">

                    </Card>
                </CardLayout>
                <Card title="On the water">

                </Card>
            </CardLayout>
    </CardLayout>;
};