import * as React from 'react';

export default function MessageTest() {
	const [msg, setMsg] = React.useState("")
	const [origin, setOrigin] = React.useState("")

	const updateMessage = (message: string) => {
		const toPost = {
			topic: "test",
			payload: {
				message
			}
		}
		console.log("posting to parent: ", toPost)
		console.log("origin: ", origin)
		parent.postMessage(toPost, origin);
		setMsg(message)
	}

	return <div>
		<input type="text" value={msg} onChange={e => updateMessage(e.target.value)} />
		<input type="text" value={origin} onChange={e => setOrigin(e.target.value)} />
	</div>
}