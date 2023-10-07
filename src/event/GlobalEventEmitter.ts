import { EVENT_DICT as MCL_EVENT_DICT, API_DICT as MCL_API_DICT } from '../mcl_definition';
import { EVENT_DICT as MCL_WS_EVENT_DICT } from '../app/mcl/WSClient';
import { EVENT_DICT as MCL_HTTP_EVENT_DICT, type SendedEventDict } from '../app/mcl/HTTPClient';
import app from '../app';
import EventEmitter from 'node:events';

type CoreEvent = typeof MCL_EVENT_DICT & typeof MCL_WS_EVENT_DICT & typeof MCL_HTTP_EVENT_DICT & SendedEventDict;

interface ListenerWithEvent {
    priority: number;
    listener: (...args: any[]) => any;
    event: string;
}

export interface ICoreEventEmitter {
    onCoreEvent<EventName extends keyof CoreEvent>(
        priority: number,
        eventName: EventName,
        listener: (event: CoreEvent[EventName], listenerData: Record<string, any>) => void,
    ): this;
}

export interface IGlobalEventEmitter extends ICoreEventEmitter {
    on(eventName: string, listener: (event: any, listenerData: Record<string, any>) => void): this;
    emit(eventName: string, event: any): boolean;
}

export default class GlobalEventEmitter extends EventEmitter implements IGlobalEventEmitter {
    constructor() {
        super();
    }

    private tempListeners: ListenerWithEvent[] = [];

    onCoreEvent<EventName extends keyof CoreEvent>(
        priority: number,
        eventName: EventName,
        listener: (event: CoreEvent[EventName], listenerData: Record<string, any>) => void,
    ) {
        this.tempListeners.push({ priority, event: eventName, listener });
        return this;
    }

    finishRegistry() {
        this.tempListeners.sort((a, b) => b.priority - a.priority);
        const mappedListeners = new Map<string, ListenerWithEvent[]>();
        for (const i of this.tempListeners) {
            if (!mappedListeners.has(i.event)) {
                mappedListeners.set(i.event, []);
            }
            mappedListeners.get(i.event)!.push(i);
        }

        for (const [eventName, listeners] of mappedListeners) {
            const listList: ListenerWithEvent[][] = [];
            let lastList: ListenerWithEvent[] = [];
            let lastPriority = listeners[0].priority;
            for (const i of listeners) {
                if (i.priority != lastPriority) {
                    lastPriority = i.priority;
                    listList.push(lastList);
                    lastList = [];
                }
                lastList.push(i);
            }

            const newList: ((...args: any[]) => any)[] = [];
            for (const list of listList) {
                newList.push(async (...args: any[]) => {
                    const results: any[] = [];
                    for (const i of list) {
                        results.push(i.listener(...args));
                    }
                    await Promise.all(results);
                });
            }

            const finalListener = async (...args: any[]) => {
                for (const i of newList) {
                    await i(...args);
                }
            };

            super.on(eventName, finalListener);
        }
    }

    emit(eventName: string, event: any): boolean {
        return super.emit(eventName, event, {});
    }

    start() {
        for (const i in MCL_EVENT_DICT) {
            app.mclWsClient.on(i, (e) => this.emit(i, e));
        }

        for (const i in MCL_WS_EVENT_DICT) {
            app.mclWsClient.on(i, (e) => this.emit(i, e));
        }

        for (const i in MCL_HTTP_EVENT_DICT) {
            app.mclHttpClient.on(i, (e) => this.emit(i, e));
        }

        for (const i in MCL_API_DICT) {
            const apiPath = i.split('$')[0];
            const eventName = `mcl_http:send:${apiPath}`;
            app.mclHttpClient.on(eventName, (e) => this.emit(eventName, e));
        }
    }
}
