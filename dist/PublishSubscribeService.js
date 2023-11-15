"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishSubscribeService = void 0;
class PublishSubscribeService {
    constructor() {
        this.subscribers = new Map();
    }
    publish(event) {
        const subscribers = this.subscribers.get(event.type()) || [];
        subscribers.forEach(subscriber => subscriber.handle(event));
    }
    subscribe(type, subscriber) {
        const subscribers = this.subscribers.get(type) || [];
        subscribers.push(subscriber);
        this.subscribers.set(type, subscribers);
    }
    unsubscribe(type, subscriber) {
        const subscribers = this.subscribers.get(type) || [];
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
        this.subscribers.set(type, subscribers);
    }
}
exports.PublishSubscribeService = PublishSubscribeService;
