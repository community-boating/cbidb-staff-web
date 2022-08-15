export interface RawProgramType {
	PROGRAM_ID: number;
	PROGRAM_NAME: string;
	DISPLAY_ORDER: number;
	ACTIVE: boolean;
}

export interface RawRating {
	RATING_ID: number;
	RATING_NAME: string;
	DISPLAY_ORDER: number;
	ACTIVE: boolean;
	OVERRIDDEN_BY: number;
	TEST_MIN_CREW: number;
	TEST_MAX_CREW: number;
	TESTABLE: boolean;
	GROUP: string;
}

export interface RawRatingPrograms {
	ASSIGN_ID: number;
	RATING_ID: number;
	PROGRAM_ID: number;
}

export interface Rating {
	RATING: RawRating;
	PROGRAM: RawProgramType;
}

const rating_data: Rating[] = [
	{
		RATING: {
			RATING_ID: 4,
			RATING_NAME: "Kayak",
			DISPLAY_ORDER: 7,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1121,
			RATING_NAME: "Mercury Yellow Plus",
			DISPLAY_ORDER: 3.25,
			ACTIVE: true,
			OVERRIDDEN_BY: 3,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 61,
			RATING_NAME: "Rigging",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
			OVERRIDDEN_BY: 1,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 62,
			RATING_NAME: "Verbal",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
			OVERRIDDEN_BY: 1,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 64,
			RATING_NAME: "Sloop",
			DISPLAY_ORDER: 5,
			ACTIVE: true,
			OVERRIDDEN_BY: 65,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 65,
			RATING_NAME: "Advanced Helmsman",
			DISPLAY_ORDER: 6,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "Advanced"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 66,
			RATING_NAME: "HT Crew",
			DISPLAY_ORDER: 21,
			ACTIVE: true,
			OVERRIDDEN_BY: 67,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 5,
			TESTABLE: false,
			GROUP: "HT"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 67,
			RATING_NAME: "HT Skipper",
			DISPLAY_ORDER: 22,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 5,
			TESTABLE: false,
			GROUP: "HT"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 68,
			RATING_NAME: "Racing Skipper",
			DISPLAY_ORDER: 23,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Racing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 101,
			RATING_NAME: "Spinnaker Green",
			DISPLAY_ORDER: 27,
			ACTIVE: true,
			OVERRIDDEN_BY: 102,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 102,
			RATING_NAME: "Spinnaker Yellow",
			DISPLAY_ORDER: 28,
			ACTIVE: true,
			OVERRIDDEN_BY: 103,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 103,
			RATING_NAME: "Spinnaker Red",
			DISPLAY_ORDER: 29,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 104,
			RATING_NAME: "Laser Green",
			DISPLAY_ORDER: 30,
			ACTIVE: true,
			OVERRIDDEN_BY: 121,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 105,
			RATING_NAME: "Laser Yellow",
			DISPLAY_ORDER: 31,
			ACTIVE: true,
			OVERRIDDEN_BY: 122,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 106,
			RATING_NAME: "Laser Red",
			DISPLAY_ORDER: 32,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 107,
			RATING_NAME: "420 Green",
			DISPLAY_ORDER: 33,
			ACTIVE: true,
			OVERRIDDEN_BY: 123,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 108,
			RATING_NAME: "420 Yellow",
			DISPLAY_ORDER: 34,
			ACTIVE: true,
			OVERRIDDEN_BY: 124,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 109,
			RATING_NAME: "420 Red",
			DISPLAY_ORDER: 35,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 110,
			RATING_NAME: "Windsurfing Green",
			DISPLAY_ORDER: 36,
			ACTIVE: true,
			OVERRIDDEN_BY: 111,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 111,
			RATING_NAME: "Windsurfing Yellow",
			DISPLAY_ORDER: 37,
			ACTIVE: true,
			OVERRIDDEN_BY: 112,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 112,
			RATING_NAME: "Windsurfing Red",
			DISPLAY_ORDER: 38,
			ACTIVE: true,
			OVERRIDDEN_BY: 962,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 113,
			RATING_NAME: "Rhodes 19 Green",
			DISPLAY_ORDER: 39,
			ACTIVE: true,
			OVERRIDDEN_BY: 114,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 114,
			RATING_NAME: "Rhodes 19 Yellow",
			DISPLAY_ORDER: 40,
			ACTIVE: true,
			OVERRIDDEN_BY: 115,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 115,
			RATING_NAME: "Rhodes 19 Red",
			DISPLAY_ORDER: 41,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 116,
			RATING_NAME: "Sonar Green",
			DISPLAY_ORDER: 42,
			ACTIVE: true,
			OVERRIDDEN_BY: 117,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 117,
			RATING_NAME: "Sonar Yellow",
			DISPLAY_ORDER: 43,
			ACTIVE: true,
			OVERRIDDEN_BY: 118,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 118,
			RATING_NAME: "Sonar Red",
			DISPLAY_ORDER: 44,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 141,
			RATING_NAME: "Keelboat Green",
			DISPLAY_ORDER: 44.1,
			ACTIVE: true,
			OVERRIDDEN_BY: 142,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Keelboat"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 142,
			RATING_NAME: "Keelboat Yellow",
			DISPLAY_ORDER: 44.2,
			ACTIVE: true,
			OVERRIDDEN_BY: 143,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Keelboat"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 143,
			RATING_NAME: "Keelboat Red",
			DISPLAY_ORDER: 44.3,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Keelboat"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 261,
			RATING_NAME: "Mercury Green",
			DISPLAY_ORDER: 3.1,
			ACTIVE: true,
			OVERRIDDEN_BY: 2,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 262,
			RATING_NAME: "Mercury Yellow",
			DISPLAY_ORDER: 3.2,
			ACTIVE: true,
			OVERRIDDEN_BY: 1121,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 0,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 263,
			RATING_NAME: "Mercury Red",
			DISPLAY_ORDER: 3.3,
			ACTIVE: true,
			OVERRIDDEN_BY: 64,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 281,
			RATING_NAME: "Ideal 18 Green",
			DISPLAY_ORDER: 104,
			ACTIVE: true,
			OVERRIDDEN_BY: 282,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 282,
			RATING_NAME: "Ideal 18 Yellow",
			DISPLAY_ORDER: 105,
			ACTIVE: true,
			OVERRIDDEN_BY: 283,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 283,
			RATING_NAME: "Ideal 18 Red",
			DISPLAY_ORDER: 106,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 962,
			RATING_NAME: "Windsurfing Expert",
			DISPLAY_ORDER: 38.1,
			ACTIVE: true,
			OVERRIDDEN_BY: 963,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 963,
			RATING_NAME: "Windsurfing Foiling",
			DISPLAY_ORDER: 38.2,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1022,
			RATING_NAME: "Powerboat",
			DISPLAY_ORDER: 109,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Staff"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1041,
			RATING_NAME: "Windsurfing Volunteer",
			DISPLAY_ORDER: 110,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1081,
			RATING_NAME: "Keel Mercury Yellow",
			DISPLAY_ORDER: 0,
			ACTIVE: true,
			OVERRIDDEN_BY: 262,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Keel Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1082,
			RATING_NAME: "Keel Mercury Red",
			DISPLAY_ORDER: 0,
			ACTIVE: true,
			OVERRIDDEN_BY: 263,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Keel Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 28,
			RATING_NAME: "Stand Up Paddle",
			DISPLAY_ORDER: 8,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 0,
			TESTABLE: true,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 1,
			PROGRAM_NAME: "Adult Program",
			DISPLAY_ORDER: 1,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 4,
			RATING_NAME: "Kayak",
			DISPLAY_ORDER: 7,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 28,
			RATING_NAME: "Stand Up Paddle",
			DISPLAY_ORDER: 8,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 0,
			TESTABLE: true,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 101,
			RATING_NAME: "Spinnaker Green",
			DISPLAY_ORDER: 27,
			ACTIVE: true,
			OVERRIDDEN_BY: 102,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 102,
			RATING_NAME: "Spinnaker Yellow",
			DISPLAY_ORDER: 28,
			ACTIVE: true,
			OVERRIDDEN_BY: 103,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 103,
			RATING_NAME: "Spinnaker Red",
			DISPLAY_ORDER: 29,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Spinnaker"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 104,
			RATING_NAME: "Laser Green",
			DISPLAY_ORDER: 30,
			ACTIVE: true,
			OVERRIDDEN_BY: 121,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 105,
			RATING_NAME: "Laser Yellow",
			DISPLAY_ORDER: 31,
			ACTIVE: true,
			OVERRIDDEN_BY: 122,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 106,
			RATING_NAME: "Laser Red",
			DISPLAY_ORDER: 32,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Laser"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 107,
			RATING_NAME: "420 Green",
			DISPLAY_ORDER: 33,
			ACTIVE: true,
			OVERRIDDEN_BY: 123,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 108,
			RATING_NAME: "420 Yellow",
			DISPLAY_ORDER: 34,
			ACTIVE: true,
			OVERRIDDEN_BY: 124,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 109,
			RATING_NAME: "420 Red",
			DISPLAY_ORDER: 35,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 110,
			RATING_NAME: "Windsurfing Green",
			DISPLAY_ORDER: 36,
			ACTIVE: true,
			OVERRIDDEN_BY: 111,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 111,
			RATING_NAME: "Windsurfing Yellow",
			DISPLAY_ORDER: 37,
			ACTIVE: true,
			OVERRIDDEN_BY: 112,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 112,
			RATING_NAME: "Windsurfing Red",
			DISPLAY_ORDER: 38,
			ACTIVE: true,
			OVERRIDDEN_BY: 962,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Windsurfing"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 113,
			RATING_NAME: "Rhodes 19 Green",
			DISPLAY_ORDER: 39,
			ACTIVE: true,
			OVERRIDDEN_BY: 114,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 114,
			RATING_NAME: "Rhodes 19 Yellow",
			DISPLAY_ORDER: 40,
			ACTIVE: true,
			OVERRIDDEN_BY: 115,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 115,
			RATING_NAME: "Rhodes 19 Red",
			DISPLAY_ORDER: 41,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Rhodes 19"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 116,
			RATING_NAME: "Sonar Green",
			DISPLAY_ORDER: 42,
			ACTIVE: true,
			OVERRIDDEN_BY: 117,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 117,
			RATING_NAME: "Sonar Yellow",
			DISPLAY_ORDER: 43,
			ACTIVE: true,
			OVERRIDDEN_BY: 118,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 118,
			RATING_NAME: "Sonar Red",
			DISPLAY_ORDER: 44,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Sonar"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 161,
			RATING_NAME: "Prior Exp - Solo Review",
			DISPLAY_ORDER: 101,
			ACTIVE: false,
			OVERRIDDEN_BY: 162,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 162,
			RATING_NAME: "Prior Exp - Merc1",
			DISPLAY_ORDER: 102,
			ACTIVE: false,
			OVERRIDDEN_BY: 261,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "General"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 221,
			RATING_NAME: "Override - Race Team",
			DISPLAY_ORDER: 103,
			ACTIVE: false,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Racing"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 261,
			RATING_NAME: "Mercury Green",
			DISPLAY_ORDER: 3.1,
			ACTIVE: true,
			OVERRIDDEN_BY: 2,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 262,
			RATING_NAME: "Mercury Yellow",
			DISPLAY_ORDER: 3.2,
			ACTIVE: true,
			OVERRIDDEN_BY: 1121,
			TEST_MIN_CREW: 0,
			TEST_MAX_CREW: 0,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 263,
			RATING_NAME: "Mercury Red",
			DISPLAY_ORDER: 3.3,
			ACTIVE: true,
			OVERRIDDEN_BY: 64,
			TEST_MIN_CREW: 1,
			TEST_MAX_CREW: 1,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 281,
			RATING_NAME: "Ideal 18 Green",
			DISPLAY_ORDER: 104,
			ACTIVE: true,
			OVERRIDDEN_BY: 282,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 282,
			RATING_NAME: "Ideal 18 Yellow",
			DISPLAY_ORDER: 105,
			ACTIVE: true,
			OVERRIDDEN_BY: 283,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 283,
			RATING_NAME: "Ideal 18 Red",
			DISPLAY_ORDER: 106,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Ideal 18"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 1121,
			RATING_NAME: "Mercury Yellow Plus",
			DISPLAY_ORDER: 3.25,
			ACTIVE: true,
			OVERRIDDEN_BY: 3,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: false,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 2,
			PROGRAM_NAME: "Junior Program",
			DISPLAY_ORDER: 2,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 131,
			RATING_NAME: "Mercury Crew",
			DISPLAY_ORDER: 57,
			ACTIVE: true,
			OVERRIDDEN_BY: 132,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 4,
			PROGRAM_NAME: "High School",
			DISPLAY_ORDER: 4,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 134,
			RATING_NAME: "420 Skipper",
			DISPLAY_ORDER: 60,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 4,
			PROGRAM_NAME: "High School",
			DISPLAY_ORDER: 4,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 133,
			RATING_NAME: "420 Crew",
			DISPLAY_ORDER: 59,
			ACTIVE: true,
			OVERRIDDEN_BY: 134,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "420"
		},
		PROGRAM: {
			PROGRAM_ID: 4,
			PROGRAM_NAME: "High School",
			DISPLAY_ORDER: 4,
			ACTIVE: true,
		},
	},
	{
		RATING: {
			RATING_ID: 132,
			RATING_NAME: "Mercury Skipper",
			DISPLAY_ORDER: 58,
			ACTIVE: true,
			OVERRIDDEN_BY: null,
			TEST_MIN_CREW: null,
			TEST_MAX_CREW: null,
			TESTABLE: true,
			GROUP: "Mercury"
		},
		PROGRAM: {
			PROGRAM_ID: 4,
			PROGRAM_NAME: "High School",
			DISPLAY_ORDER: 4,
			ACTIVE: true,
		},
	},
];
export default rating_data;
