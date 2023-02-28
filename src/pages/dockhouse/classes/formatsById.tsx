import { ClassTypeType } from 'async/staff/dockhouse/class-types';
import { FormatById } from './ClassesCalendar';


export function formatsById(classTypes: ClassTypeType[]) {
    return classTypes.reduce((a, b) => {
        return b.$$apClassFormats.reduce((c, d) => {
            c[''] = { derp: 0 };
            c[d.formatId] = { b: b, d: d };
            return c;
        }, a);
    }, {} as FormatById);
}
