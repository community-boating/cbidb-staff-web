import * as React from "react";
import {post} from "async/staff/slack-sync-users"

export default function SyncSlackUsersPage(props: {}) {
	const [selectedFile, setSelectedFile] = React.useState(null as any)

	// On file select (from the pop up)
	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

		// Update the state
		setSelectedFile(event.target.files[0]);

	};

	// On file upload (click the upload button)
	const onFileUpload = () => {

		// Create an object of formData
		const formData = new FormData();

		// Update the formData object
		formData.append(
			"myFile",
			selectedFile,
			selectedFile.name
		);

		// Details of the uploaded file
		console.log(selectedFile);
		console.log(formData)

		// Request made to the backend api
		// Send formData object
		post.postFormData(formData).then(res => console.log(res));
	};

	// File content to be displayed after
	// file upload is complete
	const fileData = () => {
		if (selectedFile) {
			console.log(selectedFile)
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {selectedFile.name}</p>

					<p>File Type: {selectedFile.type}</p>

					<p>
						Last Modified:{" "}
						{selectedFile.lastModifiedDate.toDateString()}
					</p>

				</div>
			);
		} else {
			return (
				<div>
					<br />
					<h4>Choose before Pressing the Upload button</h4>
				</div>
			);
		}
	};

	return (
		<div>
			<h1>
				GeeksforGeeks
			</h1>
			<h3>
				File Upload using React!
			</h3>
			<div>
				<input type="file" onChange={onFileChange} />
				<button onClick={onFileUpload}>
					Upload!
				</button>
			</div>
			{fileData()}
		</div>
	);
}
