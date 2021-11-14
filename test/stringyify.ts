import { OptionalNumber, OptionalString } from "../src/util/OptionalTypeValidators";
import { destringify, StringifiedProps, stringify } from "../src/util/StringifyObjectProps";
import { some } from "fp-ts/lib/Option";
import * as t from 'io-ts';
import * as assert from "assert"

describe("Prop (De)Stringification", function() {
	const rawDataValidator = t.type({
		id: OptionalNumber,
		name: t.string,
		optionalText: OptionalString,
		bool: t.boolean,
		order: t.number
	})
	
	const rawData: t.TypeOf<typeof rawDataValidator> = {
		id: some(1),
		name: "theName",
		optionalText: some("this is text"),
		bool: true,
		order: 10
	};

	const rawDataStringified: StringifiedProps<typeof rawData> = stringify(rawData);

	it("should stringify", function() {
		assert.deepEqual(rawDataStringified, {
			id: "1",
			name: "theName",
			optionalText: "this is text",
			bool: "Y",
			order: "10"
		})
	})
	it("should cancel out", function() {
		const destringified = destringify(rawDataValidator, rawDataStringified, true);

		assert.deepEqual(rawData, destringified)
	})

})
