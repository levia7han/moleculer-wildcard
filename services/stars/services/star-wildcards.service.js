"use strict";

module.exports = function () {
	let dispatchedEvents = [];
	let capturedEvents = [];

	return {
		name: "star-wildcards",

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
			clearAllLogs() {
				dispatchedEvents = [];
				capturedEvents = [];
				return true;
			}
		},

		events: {
			'**'(data, sender, eventName) {
				if (eventName.indexOf('$') == -1) {
					capturedEvents.push(eventName);
					this.logger.info(`event triggered:`, data, sender, eventName);
				}
			},
			'*.*.*.*.*.*'(data, sender, eventName) {
				if (eventName.indexOf('$') == -1) {
					capturedEvents.push(eventName);
					this.logger.info(`event triggered:`, data, sender, eventName);
				}
			},
			'domain.*'(data, sender, eventName) {
				if (eventName.indexOf('$') == -1) {
					capturedEvents.push(eventName);
					this.logger.info(`event triggered:`, data, sender, eventName);
				}
			},
			'domain.*.*'(data, sender, eventName) {
				if (eventName.indexOf('$') == -1) {
					capturedEvents.push(eventName);
					this.logger.info(`event triggered:`, data, sender, eventName);
				}
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