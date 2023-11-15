export interface IEvent {
    type(): string;
    machineId(): string;
  }
  
  export interface ISubscriber {
    handle(event: IEvent): void;
  }
  
  export interface IPublishSubscribeService {
    publish(event: IEvent): void;
    subscribe(type: string, subscriber: ISubscriber): void;
    unsubscribe(type: string, subscriber: ISubscriber): void;
  }
  