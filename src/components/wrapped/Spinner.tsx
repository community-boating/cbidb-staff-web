import * as React from 'react';
import spinner from 'assets/img/icons/spinner.svg';

export type SpinnerProps = {

};

export default function Spinner(props: SpinnerProps){
    return <img className="animate-spin h-[1em] my-auto" src={spinner}></img>;
}