import type { MsgChainSend } from '.';
import type { MsgSendBase } from './base';

export interface Quote extends MsgSendBase {
    type: 'Quote';
    id: number;
}

export interface At extends MsgSendBase {
    type: 'At';
    target: number;
}

export interface AtAll extends MsgSendBase {
    type: 'AtAll';
}

export interface Face extends MsgSendBase {
    type: 'Face';
}

export interface Face1 extends Face {
    faceId: number;
}

export interface Face2 extends Face {
    name: string;
}

export interface Plain extends MsgSendBase {
    type: 'Plain';
    text: string;
}

export interface Image extends MsgSendBase {
    type: 'Image';
}

export interface Image1 extends Image {
    imageId: string;
}

export interface Image2 extends Image {
    url: string;
}

export interface Image3 extends Image {
    path: string;
}

export interface Image4 extends Image {
    base64: string;
}

export interface FlashImage extends MsgSendBase {
    type: 'FlashImage';
}

export interface FlashImage1 extends FlashImage {
    imageId: string;
}

export interface FlashImage2 extends FlashImage {
    url: string;
}

export interface FlashImage3 extends FlashImage {
    path: string;
}

export interface FlashImage4 extends FlashImage {
    base64: string;
}

export interface Voice extends MsgSendBase {
    type: 'Voice';
}

export interface Voice1 extends Voice {
    voiceId: string;
}

export interface Voice2 extends Voice {
    url: string;
}

export interface Voice3 extends Voice {
    path: string;
}

export interface Voice4 extends Voice {
    base64: string;
}

export interface Xml extends MsgSendBase {
    type: 'Xml';
    xml: string;
}

export interface Json extends MsgSendBase {
    type: 'Json';
    json: string;
}

export interface App extends MsgSendBase {
    type: 'App';
    content: string;
}

export interface Poke extends MsgSendBase {
    type: 'Poke';
    content:
        | 'Poke'
        | 'ShowLove'
        | 'Like'
        | 'Heartbroken'
        | 'SixSixSix'
        | 'FangDaZhao';
}

export interface Dice extends MsgSendBase {
    type: 'Dice';
    value: number;
}

export interface MusicShare extends MsgSendBase {
    type: 'MusicShare';
    kind: string;
    title: string;
    summary: string;
    jumpUrl: string;
    pictureUrl: string;
    musicUrl: string;
    brief: string;
}

export interface ForwardMessage extends MsgSendBase {
    type: 'Forward';
}

export interface ForwardMessage1 extends ForwardMessage {
    nodeList: {
        senderId: number;
        time: number;
        senderName: string;
        messageChain: MsgChainSend[];
    }[];
}

export interface ForwardMessage2 extends ForwardMessage {
    messageId: number;
}

export interface File extends MsgSendBase {
    type: 'File';
    id: string;
    name: string;
    size: number;
}

export interface MiraiCode extends MsgSendBase {
    type: 'MiraiCode';
    code: string;
}
