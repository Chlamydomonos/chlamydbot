import type { MsgChainObj } from '.';
import type { MsgChainObjBase } from './base';

export interface MsgSource extends MsgChainObjBase {
    type: 'Source';
    id: number;
    time: number;
}

export interface MsgQuote extends MsgChainObjBase {
    type: 'Quote';
    id: number;
    groupId: number;
    senderId: number;
    targetId: number;
    origin: [MsgSource, ...MsgChainObj[]];
}

export interface MsgAt extends MsgChainObjBase {
    type: 'At';
    target: number;
    display: string;
}

export interface MsgAtAll extends MsgChainObjBase {
    type: 'AtAll';
}

export interface MsgFace extends MsgChainObjBase {
    type: 'Face';
    faceId: number;
    name: string;
}

export interface MsgPlain extends MsgChainObjBase {
    type: 'Plain';
    text: string;
}

export interface MsgImage extends MsgChainObjBase {
    type: 'Image';
    imageId: string;
    url: string;
    path?: string;
    base64?: string;
}

export interface MsgFlashImage extends MsgChainObjBase {
    type: 'FlashImage';
    imageId: string;
    url: string;
    path?: string;
    base64?: string;
}

export interface MsgVoice extends MsgChainObjBase {
    type: 'Voice';
    voiceId: string;
    url: string;
    path?: string;
    base64?: string;
    length: number;
}

export interface MsgXml extends MsgChainObjBase {
    type: 'Xml';
    xml: string;
}

export interface MsgJson extends MsgChainObjBase {
    type: 'Json';
    json: string;
}

export interface MsgApp extends MsgChainObjBase {
    type: 'App';
    content: string;
}

export interface MsgPoke extends MsgChainObjBase {
    type: 'Poke';
    name: 'Poke' | 'ShowLove' | 'Like' | 'Heartbroken' | 'SixSixSix' | 'FangDaZhao';
}

export interface MsgDice extends MsgChainObjBase {
    type: 'Dice';
    value: number;
}

export interface MsgMarketFace extends MsgChainObjBase {
    type: 'MarketFace';
    id: number;
    name: string;
}

export interface MsgMusicShare extends MsgChainObjBase {
    type: 'MusicShare';
    kind: string;
    title: string;
    summary: string;
    jumpUrl: string;
    pictureUrl: string;
    musicUrl: string;
    brief: string;
}

export interface MsgForwardMessage extends MsgChainObjBase {
    type: 'Forward';
    nodeList: {
        senderId: number;
        time: number;
        senderName: string;
        messageChain: [MsgSource, ...MsgChainObj[]];
        messageId: number;
    }[];
}

export interface MsgFile extends MsgChainObjBase {
    type: 'File';
    id: string;
    name: string;
    size: number;
}

export interface MsgMiraiCode extends MsgChainObjBase {
    type: 'MiraiCode';
    code: string;
}
