import { programsHR } from "pages/dockhouse/signouts/Constants";

export function getProgramHR(programId: number){
    return ((programsHR.filter((a) => a.value == programId)[0]) || {display: "Invalid Program"}).display;
}