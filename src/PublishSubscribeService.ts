import { IEvent, ISubscriber, IPublishSubscribeService } from './interfaces';

export class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: Map<string, ISubscriber[]> = new Map();

  publish(event: IEvent): void {
    const subscribers = this.subscribers.get(event.type()) || [];
    subscribers.forEach(subscriber => subscriber.handle(event));
  }

  subscribe(type: string, subscriber: ISubscriber): void {
    const subscribers = this.subscribers.get(type) || [];
    subscribers.push(subscriber);
    this.subscribers.set(type, subscribers);
  }

  unsubscribe(type: string, subscriber: ISubscriber): void {
    const subscribers = this.subscribers.get(type) || [];
    const index = subscribers.indexOf(subscriber);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
    this.subscribers.set(type, subscribers);
  }
}
