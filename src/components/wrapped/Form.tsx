import * as React from 'react';
import * as t from 'io-ts';
import { Injectable, Injector } from 'components/Injector';


export type ValidatedFormProps<T extends t.TypeC<any>, U extends object = t.TypeOf<T>> = {
    formData: U
    setFormData?: React.Dispatch<React.SetStateAction<U>>
    formValidator: T
    submit: (state: U) => Promise<any>
    children: React.ReactNode
};

export default function ValidatedForm<T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: ValidatedFormProps<T, U> & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>){
    const [formData, setFormData] = props.setFormData ? [props.formData, props.setFormData] : React.useState(props.formData);
    const [validationErrors, setValidationErrors] = React.useState([]);
    const handleSubmit = () => {
        if(props.formValidator.decode(formData).isRight()){
            props.submit(formData);
        }else{
            setValidationErrors([]);
        }
    };
    return (
    <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <Injector item={formData}>
            {props.children}
        </Injector>
    </form>);
}