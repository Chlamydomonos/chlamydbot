import type { BotEventBase } from './base';

export interface BotOnlineEvent extends BotEventBase {
    type: 'BotOnlineEvent';
}

export interface BotOfflineEventActive extends BotEventBase {
    type: 'BotOfflineEventActive';
}

export interface BotOfflineEventForce extends BotEventBase {
    type: 'BotOfflineEventForce';
}

export interface BotOfflineEventDropped extends BeforeUnloadEvent {
    type: 'BotOfflineEventDropped';
}

export interface BotReloginEvent extends BotEventBase {
    type: 'BotReloginEvent';
}
