type GetterAsyncChained<T> = { key: string; getter: () => Promise<T>; dependencyKeys: { [key: string]: true; }; };

const chainedGetters: GetterAsyncChained<any>[] = [];

export function addChainedGetter(getter: GetterAsyncChained<any>){
    chainedGetters.push(getter)
}

const chainedGetterResults: { [key: string]: any; } = {};

function findReadyGetters() {
    return chainedGetters.filter((a) => chainedGetterResults[a.key] == undefined && Object.keys(a.dependencyKeys).map((a) => chainedGetterResults[a] != undefined).reduce((a, b) => a && b, true));
}

async function performGet() {
    return new Promise<boolean>(async (res, rej) => {
        const readyGetters = findReadyGetters();
        if (readyGetters.length == 0 && Object.keys(chainedGetterResults).length < chainedGetters.length) {
            console.log("someone didn't give a result");
            res(true)
        }
        for (const readyGetter of readyGetters) {
            chainedGetterResults[readyGetter.key] = await readyGetter.getter().catch((e) => {
                console.log(e)
            });
            if(!chainedGetterResults[readyGetter.key])
                chainedGetterResults[readyGetter.key] = "NO RESULTS"
        }
        res(readyGetters.length == 0);
    });
}

var currentGetGroup: Promise<boolean> = undefined;

export async function performGetUntilDone() {
    while (true) {
        currentGetGroup = performGet();
        if (await currentGetGroup)
            break;
    }
}

export async function asyncGetterValue<T>(key: string): Promise<T> {
    while (chainedGetterResults[key] == undefined) {
        if(currentGetGroup == undefined)
            throw new Error("Tried to get value before performGetUntilDone was called")
        await currentGetGroup;
    }
    return chainedGetterResults[key];
}
