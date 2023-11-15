"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PublishSubscribeService_1 = require("./PublishSubscribeService");
// implementations
class MachineSaleEvent {
    constructor(_sold, _machineId) {
        this._sold = _sold;
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    getSoldQuantity() {
        return this._sold;
    }
    type() {
        return 'sale';
    }
}
class MachineRefillEvent {
    constructor(_refill, _machineId) {
        this._refill = _refill;
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    getRefillQuantity() {
        return this._refill;
    }
    type() {
        return 'refill';
    }
}
class MachineSaleSubscriber {
    constructor(machines) {
        this.machines = machines;
    }
    handle(event) {
        const machine = this.machines.get(event.machineId());
        if (machine) {
            machine.stockLevel -= event.getSoldQuantity();
            machine.checkStockLevels();
        }
    }
}
class MachineRefillSubscriber {
    constructor(machines) {
        this.machines = machines;
    }
    handle(event) {
        const machine = this.machines.get(event.machineId());
        if (machine) {
            machine.stockLevel += event.getRefillQuantity();
            machine.checkStockLevels();
        }
    }
}
class LowStockWarningEvent {
    constructor(_machineId) {
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    type() {
        return 'lowStockWarning';
    }
}
class StockLevelOkEvent {
    constructor(_machineId) {
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    type() {
        return 'stockLevelOk';
    }
}
class Machine {
    constructor(id) {
        this.stockLevel = 10;
        this.lowStockTriggered = false;
        this.stockLevelOkTriggered = false;
        this.id = id;
    }
    checkStockLevels() {
        if (this.stockLevel < 3 && !this.lowStockTriggered) {
            pubSubService.publish(new LowStockWarningEvent(this.id));
            this.lowStockTriggered = true;
            this.stockLevelOkTriggered = false;
        }
        else if (this.stockLevel >= 3 && !this.stockLevelOkTriggered) {
            pubSubService.publish(new StockLevelOkEvent(this.id));
            this.stockLevelOkTriggered = true;
            this.lowStockTriggered = false;
        }
    }
}
// helpers
const randomMachine = () => {
    const random = Math.random() * 3;
    if (random < 1) {
        return '001';
    }
    else if (random < 2) {
        return '002';
    }
    return '003';
};
const eventGenerator = () => {
    const random = Math.random();
    if (random < 0.5) {
        const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
        return new MachineSaleEvent(saleQty, randomMachine());
    }
    const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new MachineRefillEvent(refillQty, randomMachine());
};
// program
let pubSubService;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // create 3 machines with a quantity of 10 stock
    const machines = new Map([
        ['001', new Machine('001')],
        ['002', new Machine('002')],
        ['003', new Machine('003')]
    ]);
    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    // create the PubSub service
    pubSubService = new PublishSubscribeService_1.PublishSubscribeService();
    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber); // implement and fix this
    // create 5 random events
    const events = [1, 2, 3, 4, 5].map(_ => eventGenerator());
    // publish the events
    events.forEach(event => pubSubService.publish(event));
}))();
