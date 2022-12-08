
import red from 'assets/img/red.png';
import green from "assets/img/green.png";
import yellow from "assets/img/yellow.png";
import black from "assets/img/black.png";
import white from "assets/img/white.png";

export const FlagStatusIcons = {
    "R":{src:red, sortOrder:3, hr:"Red"},
    "G":{src:green, sortOrder:5, hr:"Green"},
    "Y":{src:yellow, sortOrder:4, hr:"Yellow"},
    "B":{src:black, sortOrder:2, hr:"Black"},
    "W":{src:white, sortOrder:1, hr:"White"},
}

export type Flag = keyof typeof FlagStatusIcons;