import { Class, Staff, UapAppointment } from "."

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