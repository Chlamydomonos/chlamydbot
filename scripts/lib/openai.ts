type MessageEvent = typeof chlamydbot.eventEmitter.onCoreEvent<'mcl:FriendMessage'> extends (
    priority: number,
    event: 'mcl:FriendMessage',
    listener: (event: infer R, listenerData: any) => void,
) => void
    ? R
    : never;

type MessageChain = MessageEvent['messageChain'];

export function compileFriendMessageChain(messageChain: MessageChain) {
    let out = '';
    for (let i = 1; i < messageChain.length; i++) {
        const message = messageChain[i];
        if (message.type == 'Plain') {
            out += message.text;
        } else if (message.type == 'Face') {
            out += `[表情: ${message.name}]`;
        } else if (message.type == 'Image' || message.type == 'FlashImage') {
            out += `[图片-你的API无法显示图片]`;
        } else if (message.type == 'Quote') {
            const quotedMessage = message.origin;
            const quotedMessageStr = compileFriendMessageChain(quotedMessage);
            out += `[回复: ${quotedMessageStr}]`;
        } else if (message.type == 'Poke') {
            out += `[戳一戳: ${message.name}]`;
        } else {
            out += `[未知类型消息]`;
        }
    }
    return out;
}

export async function compileGroupMessageChain(messageChain: MessageChain, groupId: number) {
    let out = '';

    const senderName = (
        await chlamydbot.mclHttpClient.send('/memberProfile', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: groupId,
            memberId: messageChain[0].id,
        })
    ).nickname;

    out += `[发送者：${senderName}]\n`;
    for (let i = 1; i < messageChain.length; i++) {
        const message = messageChain[i];
        if (message.type == 'Plain') {
            out += message.text;
        } else if (message.type == 'Face') {
            out += `[表情: ${message.name}]`;
        } else if (message.type == 'Image' || message.type == 'FlashImage') {
            out += `[图片-你的API无法显示图片]`;
        } else if (message.type == 'At') {
            const targetName = (
                await chlamydbot.mclHttpClient.send('/memberProfile', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: groupId,
                    memberId: message.target,
                })
            ).nickname;
            out += `[@: {昵称: ${targetName}, QQ: ${message.target}}]`;
        } else if (message.type == 'AtAll') {
            out += `[@全体成员]`;
        } else if (message.type == 'Quote') {
            const quotedMessage = message.origin;
            const quotedMessageStr = await compileGroupMessageChain(quotedMessage, groupId);
            out += `[回复: ${quotedMessageStr}]`;
        } else {
            out += `[未知类型消息]`;
        }
    }
    return out;
}

export interface HistoryMessage {
    isAssistant: boolean;
    message: string;
}
