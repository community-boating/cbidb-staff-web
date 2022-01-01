import * as React from 'react';
import { Alert } from "react-bootstrap";

export const ErrorPopup = (props: {errors: string[]}) => {
	if (props.errors.length == 0) {
		return null;
	} else {
		return <Alert className="my-3" variant="warning">
			<div className="alert-message">
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