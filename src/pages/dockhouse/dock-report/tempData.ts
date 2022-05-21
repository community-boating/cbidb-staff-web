import { Class, Staff, UapAppointment, WeatherRecord } from "."

export const dockmasters: Staff[] = [{
	name: "Charlie Zechel",
	in: "09:00AM",
	out: "01:00PM"
}, {
	name: "Andrew Alletag",
	in: "01:00PM",
	out: "08:00PM"
}, {
	name: "Andrew Alletag",
	in: "01:00PM",
	out: "08:00PM"
}]

export const dockstaff: Staff[] = [{
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}, {
	name: "Evan McCarty",
	in: "09:00AM",
	out: "08:00PM"
}]

export const classes: Class[] = [{
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	className: "Shore School",
	location: "Main Bay",
	attend: 14,
	instructor: "Charlie Zechel"
}].map(e => ({
	...e,
	attend: String(e.attend)
}))

export const uapAppts: UapAppointment[] = [{
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}, {
	time: "09:00AM",
	apptType: "Lesson",
	person: "Andrew Alletag",
	boat: "Keel Merc",
	instructor: "Charlie Zechel"
}]

export const weatherRecords: WeatherRecord[] = [{
	time: "09:00AM",
	temp: "53",
	weather: "Cloudy",
	windDir: "NNE",
	windSpeedKts: "8",
	restrictions: "Wetsuits on hiper.  halfriver for fireworks barge. other random shit that i just thought of."
}, {
	time: "11:00AM",
	temp: "56",
	weather: "Ptly Cloudy",
	windDir: "N",
	windSpeedKts: "9",
	restrictions: "Wetsuits on hiper.  halfriver for fireworks barge. other random shit that i just thought of."
}]

export const loremIpsum =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"