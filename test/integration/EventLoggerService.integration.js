const {
  ServiceBroker
} = require('moleculer');

describe('EventLogger', () => {
  const broker = new ServiceBroker({
    transporter: process.env.TRANSPORTER || 'nats://localhost:4222',
    serializer: 'ProtoBuf',
    logger: true,
  });

  beforeAll(async () => {
    await broker.start();
  });

  afterAll(() => broker.stop());

  describe('Double star wildcard', () => {
    beforeEach(async () => {
      await broker.call('star-wildcards.clearAllLogs');
      await broker.call('double-star-wildcard.clearAllLogs')
    });

    it('should dispatch events', async () => {

      await broker.call('double-star-wildcard.emitEvent', {
        event: 'this.is.an.emit'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'this.is.a.broadcast'
      });

      const dispatched = await broker.call('double-star-wildcard.getDispatchedEvents');

      expect(dispatched).toContain('this.is.a.broadcast');
      expect(dispatched).toContain('this.is.an.emit');
      expect(dispatched).toHaveLength(2);
    });

    it('should react to events from external source', async () => {
      await broker.call('star-wildcards.emitEvent', {
        event: 'sanity.check.event'
      });

      await broker.call('star-wildcards.broadcastEvent', {
        event: 'some.other.event'
      });

      const dispatched = await broker.call('star-wildcards.getDispatchedEvents');
      expect(dispatched).toContain('sanity.check.event');
      expect(dispatched).toContain('some.other.event');
      expect(dispatched).toHaveLength(2);

      const captured = await broker.call('double-star-wildcard.getCapturedEvents');

      // This event is explicitly subscribed to so it should be captured twice.
      // Once by the subsctiption and once by the ** wildcard
      expect(captured).toContain('sanity.check.event');

      // this event will not be there but should be
      expect(captured).toContain('some.other.event');

      // if everything was working as expected we would see 3 events here
      expect(captured).toHaveLength(3);
      // we only have ["sanity.check.event", "sanity.check.event"] though
    });

    it('exploration of multiple wildcards', async () => {
      // subscribed to ** and *.*.*.*.*.*
      await broker.call('double-star-wildcard.emitEvent', {
        event: 'sanity.check.event'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'some.other.event'
      });

      const dispatched = await broker.call('double-star-wildcard.getDispatchedEvents');
      expect(dispatched).toContain('sanity.check.event');
      expect(dispatched).toContain('some.other.event');
      expect(dispatched).toHaveLength(2);

      const captured = await broker.call('star-wildcards.getCapturedEvents');

      // these events should show up but are not there
      expect(captured).toContain('sanity.check.event');
      expect(captured).toContain('some.other.event');

      expect(captured).toHaveLength(2);
      // no events were captured in the end
    });

    it('exploration of multiple wildcards part two', async () => {
      // subscribed to ** and *.*.*.*.*.*
      await broker.call('double-star-wildcard.emitEvent', {
        event: 'sanity.check.event'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'some.other.event'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'this.is.a.long.event.name'
      });

      const dispatched = await broker.call('double-star-wildcard.getDispatchedEvents');
      expect(dispatched).toContain('sanity.check.event');
      expect(dispatched).toContain('some.other.event');
      expect(dispatched).toContain('this.is.a.long.event.name');
      expect(dispatched).toHaveLength(3);

      const captured = await broker.call('star-wildcards.getCapturedEvents');

      // we expect to see these three events
      expect(captured).toContain('sanity.check.event');
      expect(captured).toContain('some.other.event');
      expect(captured).toContain('this.is.a.long.event.name');

      expect(captured).toHaveLength(3);
      // in the end we have  ["this.is.a.long.event.name", "this.is.a.long.event.name"]
    });

    it('other wildcard tests eg. domain.* ', async () => {
      // subscribed to ** and *.*.*.*.*.*
      await broker.call('double-star-wildcard.emitEvent', {
        event: 'sanity.check.event'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'domain.event'
      });

      await broker.call('double-star-wildcard.broadcastEvent', {
        event: 'domain.this.is.a.long.event.name'
      });

      const dispatched = await broker.call('double-star-wildcard.getDispatchedEvents');
      expect(dispatched).toContain('sanity.check.event');
      expect(dispatched).toContain('domain.event');
      expect(dispatched).toContain('domain.this.is.a.long.event.name');
      expect(dispatched).toHaveLength(3);

      const captured = await broker.call('star-wildcards.getCapturedEvents');

      // we expect to see these three events
      expect(captured).toContain('sanity.check.event');
      expect(captured).toContain('domain.event');
      expect(captured).toContain('domain.this.is.a.long.event.name');

      expect(captured).toHaveLength(3);
      // in the end we have  ["this.is.a.long.event.name", "this.is.a.long.event.name"]
    });
  });
});