import { PublishSubscribeService } from './PublishSubscribeService';



// interfaces
interface IEvent {
  type(): string;
  machineId(): string;
}

interface ISubscriber {
  handle(event: IEvent): void;
}

interface IPublishSubscribeService {
  publish (event: IEvent): void;
  subscribe (type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
  unsubscribe(type: string, handler: ISubscriber): void;
}


// implementations
class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): string {
    return 'sale';
  }
}

class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getRefillQuantity(): number {
    return this._refill;
  }

  type(): string {
    return 'refill';
  }
}

class MachineSaleSubscriber implements ISubscriber {
  public machines: Map<string, Machine>;

  constructor(machines: Map<string, Machine>) {
    this.machines = machines; 
  }

  handle(event: MachineSaleEvent): void {
    const machine = this.machines.get(event.machineId());
    if (machine) {
      machine.stockLevel -= event.getSoldQuantity();
      machine.checkStockLevels();
    }
  }
}

class MachineRefillSubscriber implements ISubscriber {
  public machines: Map<string, Machine>;

  constructor(machines: Map<string, Machine>) {
    this.machines = machines;
  }

  handle(event: MachineRefillEvent): void {
    const machine = this.machines.get(event.machineId());
    if (machine) {
      machine.stockLevel += event.getRefillQuantity();
      machine.checkStockLevels();
    }
  }
}

class LowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'lowStockWarning';
  }
}

class StockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'stockLevelOk';
  }
}

class Machine {
  public stockLevel = 10;
  public id: string;
  private lowStockTriggered = false;
  private stockLevelOkTriggered = false;

  constructor(id: string) {
    this.id = id;
  }

  
  checkStockLevels(): void {
    if (this.stockLevel < 3 && !this.lowStockTriggered) {
      pubSubService.publish(new LowStockWarningEvent(this.id));
      this.lowStockTriggered = true;
      this.stockLevelOkTriggered = false;
    } else if (this.stockLevel >= 3 && !this.stockLevelOkTriggered) {
      pubSubService.publish(new StockLevelOkEvent(this.id));
      this.stockLevelOkTriggered = true;
      this.lowStockTriggered = false;
    }
  }
}


// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';

}

const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}


// program
let pubSubService: IPublishSubscribeService;
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Map<string, Machine> = new Map([
    ['001', new Machine('001')], 
    ['002', new Machine('002')], 
    ['003', new Machine('003')]
  ]);
  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber = new MachineRefillSubscriber(machines);

  // create the PubSub service
  pubSubService = new PublishSubscribeService();
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber); // implement and fix this

  // create 5 random events
  const events = [1,2,3,4,5].map(_ => eventGenerator());

  // publish the events
  events.forEach(event => pubSubService.publish(event));
})();
