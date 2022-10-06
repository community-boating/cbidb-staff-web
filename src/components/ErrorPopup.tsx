import * as React from 'react';
import { Alert, UncontrolledAlert } from 'reactstrap';

export const ErrorPopup = (props: {errors: string[]}) => {
	if (props.errors.length == 0) {
		return null;
	} else {
		return <UncontrolledAlert color="warning" key="login-error">
			<div className="alert-message">
				{
					props.errors.length == 1 
					? props.errors[0] 
					: <ul style={{margin: "0"}}>
						{props.errors.map((v, i) => <li key={`validation-err-${i}`}>{v}</li>)}
					</ul>
				}
			</div>
		</UncontrolledAlert>
	}
}

export const ErrorPopupControlled = (props: {errors: string[], setErrors: (string: []) => void}) => {
	if (props.errors.length == 0) {
		return null;
	} else {
		return <Alert color="warning" key="login-error" toggle={() => props.setErrors([])}>
			<div className="alert-message" >
				{
					props.errors.length == 1 
					? props.errors[0] 
					: <ul style={{margin: "0"}}>
						{props.errors.map((v, i) => <li key={`validation-err-${i}`}>{v}</li>)}
					</ul>
				}
			</div>
		</Alert>
	}
}