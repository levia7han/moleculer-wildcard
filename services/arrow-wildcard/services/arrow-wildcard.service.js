"use strict";

module.exports = function () {
	let dispatchedEvents = [];
	let capturedEvents = [];

	return {
		name: "arrow-wildcard",

		settings: {

		},

		dependencies: [],

		actions: {

			getDispatchedEvents() {
				return dispatchedEvents;
			},
			getCapturedEvents() {
				return capturedEvents;
			},

			emitEvent(ctx) {
				const {
					event
				} = ctx.params;
				dispatchedEvents.push(event);
				ctx.emit(event);
			},


			broadcastEvent: {
				params: {
					event: "string"
				},
				handler(ctx) {
					const {
						event
					} = ctx.params;
					dispatchedEvents.push(event);
					ctx.broadcast(event);
				},
			},
		},

		events: {
			'>'(data, sender, eventName) {
				capturedEvents.push(eventName);
				this.logger.info(`event triggered:`, data, sender, eventName);
			}

		},
		methods: {

		},
		created() {

		},
		started() {

		},
		stopped() {

		}
	}
};