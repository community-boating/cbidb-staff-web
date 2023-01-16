import * as React from 'react';
import * as t from 'io-ts';
import { ValidationGroup, ValidationType } from './Input';

export type ValidatedFormProps<T extends t.TypeC<any>, U extends object = t.TypeOf<T>> = {
    formData: U
    setFormData?: React.Dispatch<React.SetStateAction<U>>
    formValidator: T
    submit: (state: U) => Promise<any>
    children: React.ReactNode
};

export default function ValidatedForm<T extends t.TypeC<any>, U extends object = t.TypeOf<T>>(props: ValidatedFormProps<T, U> & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>){
    const [formData, setFormData] = props.setFormData ? [props.formData, props.setFormData] : React.useState(props.formData);
    const [validationErrors, setValidationErrors] = React.useState<ValidationType>({
        validationsById: {},
        globalValidations: []
    });
    const handleSubmit = () => {
        console.log("submitting");
        const result = props.formValidator.decode(formData)
        if(result.isRight()){
            props.submit(formData);
        }else{
            console.log("error");
            setValidationErrors((v) => ({...v,globalValidations: []}));
        }
    };
    return (
    <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <ValidationGroup validations={validationErrors}>
            {props.children}
        </ValidationGroup>
    </form>);
}