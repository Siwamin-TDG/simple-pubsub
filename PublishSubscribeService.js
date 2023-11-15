"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishSubscribeService = void 0;
class PublishSubscribeService {
    constructor() {
        this.subscribers = new Map();
    }
    subscribe(eventType, subscriber) {
        const subs = this.subscribers.get(eventType) || [];
        subs.push(subscriber);
        this.subscribers.set(eventType, subs);
    }
    unsubscribe(eventType, subscriber) {
        const subs = this.subscribers.get(eventType) || [];
        const index = subs.indexOf(subscriber);
        if (index !== -1) {
            subs.splice(index, 1);
        }
        this.subscribers.set(eventType, subs);
    }
    publish(event) {
        const subs = this.subscribers.get(event.type) || [];
        subs.forEach(subscriber => subscriber.handle(event));
    }
}
exports.PublishSubscribeService = PublishSubscribeService;
