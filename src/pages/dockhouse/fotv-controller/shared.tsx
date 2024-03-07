import { FOTVType } from 'async/staff/dockhouse/fotv-controller';
import { ProviderWithSetState } from 'async/providers/ProviderType';


export function imageVersionByID(fotv: ProviderWithSetState<FOTVType>) {
    const versionByID = {};
    fotv.state.logoImages.forEach((a) => {
        versionByID[a.imageID] = a.image.version;
    });
    return versionByID;
}

export function getImageSRC(imageID, versionByID) {
    return "http://74.207.231.244:3000/images/" + imageID + '/' + versionByID[imageID];
}

export function mergeTable<T_Array, T_KeyName extends keyof T_Array, T_Full extends T_Array & {[a in T_KeyName]: (number)}>(oldValues:(T_Full & T_Array)[], newValues:T_Full[], key: T_KeyName){
    const byID: {[id in T_Full[T_KeyName]]: T_Full} = {} as any;
    const newOnes: T_Full[] = [];
    const oldIDs: {[id in T_Full[T_KeyName]]: boolean} = {} as any;
    oldValues.forEach((a) => {
        oldIDs[a[key]] = true;
    })
    newValues.forEach((a) => {
        console.log(key);
        console.log(a);
        console.log(a[key]);
        console.log(a[key] != undefined && oldIDs[a[key]] != undefined)
        if(a[key] != undefined && oldIDs[a[key]] != undefined)
            byID[a[key]] = a;
        else
            newOnes.push(a);
    });
    console.log(newOnes);
    return oldValues.map((a) => byID[a[key]] != undefined ? byID[a[key]] : a).concat(newOnes);
}

export function findFileExtension(fileName: string){
    console.log(fileName.substring(fileName.lastIndexOf('.')));
    return fileName.substring(fileName.lastIndexOf('.') + 1);
}