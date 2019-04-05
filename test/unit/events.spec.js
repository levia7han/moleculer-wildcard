"use strict";

const {
	ServiceBroker
} = require("moleculer");
const {
	ValidationError
} = require("moleculer").Errors;

const DoubleStarWildcardService = require("../../services/double-star/services/double-star-wildcard.service");
const StarWildcardService = require("../../services/stars/services/star-wildcards.service");

describe("Events testing", () => {
	let broker = new ServiceBroker({
		transporter: 'nats://localhost:4222',
		serializer: 'ProtoBuf',
		logger: false
	});

	broker.createService(DoubleStarWildcardService());
	broker.createService(StarWildcardService());

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("WildcardServices", () => {

		it("Should react to all events", async () => {
			const testEvent = "some.emitted.event";
			await broker.call("star-wildcards.emitEvent", {
				event: testEvent
			});

			// double star is working here
			const eventsCapturedDoubleStar = await broker.call("double-star-wildcard.getCapturedEvents");
			console.log(eventsCapturedDoubleStar);

			// both the double star and *.*.*.*.*.* events are captured here. 
			const eventsCapturedStars = await broker.call("star-wildcards.getCapturedEvents");
			console.log(eventsCapturedStars);

			expect(eventsCapturedDoubleStar).toContain(testEvent);
			expect(eventsCapturedStars).toContain(testEvent);
		});

	});

});