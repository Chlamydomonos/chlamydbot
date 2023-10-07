import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import tokenizer from 'gpt-3-encoder';
import { HistoryMessage, compileFriendMessageChain, compileGroupMessageChain } from '../../lib/openai';

class Sender extends Model<InferAttributes<Sender>, InferCreationAttributes<Sender>> {
    declare id: CreationOptional<number>;
    declare qq: number;
    declare name: string;
    declare description: CreationOptional<string>;
    declare messageList: string;
    declare botState: CreationOptional<string>;
}

class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>> {
    declare id: CreationOptional<number>;
    declare qq: number;
    declare name: string;
    declare description: CreationOptional<string>;
    declare messageList: string;
    declare botState: CreationOptional<string>;
}

Sender.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qq: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        messageList: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        botState: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'standard',
        },
    },
    {
        sequelize: chlamydbot.dbConnector,
    },
);

Group.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qq: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        messageList: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        botState: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'standard',
        },
    },
    {
        sequelize: chlamydbot.dbConnector,
    },
);

function updateHistory(messageList: string, message: string, isAssistant: boolean) {
    const messageListObj = JSON.parse(messageList) as HistoryMessage[];
    messageListObj.push({ message, isAssistant });
    const tokenCounts = messageListObj.map((message) => tokenizer.encode(message.message).length);
    const outList: HistoryMessage[] = [];
    let currentTokenCount = 0;
    for (let i = tokenCounts.length - 1; i >= 0; i--) {
        currentTokenCount += tokenCounts[i];
        if (currentTokenCount > 2048) {
            break;
        }
        outList.unshift(messageListObj[i]);
    }
    if (chlamydbot.states.openAIInDebug) {
        console.log(JSON.stringify(outList));
    }
    return JSON.stringify(outList);
}

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', async (event) => {
    const sender = event.sender.id;
    let senderObj = await Sender.findOne({
        where: {
            qq: sender,
        },
    });
    if (!senderObj) {
        const senderName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
            })
        ).nickname;
        senderObj = Sender.build({
            qq: sender,
            name: senderName,
            messageList: '[]',
        });
    }
    senderObj.messageList = updateHistory(senderObj.messageList, compileFriendMessageChain(event.messageChain), false);
    await senderObj.save();
});

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:GroupMessage', async (event) => {
    const groupId = event.sender.group.id;
    let groupObj = await Group.findOne({
        where: {
            qq: groupId,
        },
    });
    if (!groupObj) {
        const groupName = (
            await chlamydbot.mclHttpClient.send(
                '/groupConfig',
                {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: groupId,
                },
                'GET',
            )
        ).name;
        groupObj = Group.build({
            qq: groupId,
            name: groupName,
            messageList: '[]',
        });
    }
    groupObj.messageList = updateHistory(
        groupObj.messageList,
        await compileGroupMessageChain(event.messageChain, groupId),
        false,
    );
    await groupObj.save();
});

type MsgChainSend = (typeof chlamydbot.eventEmitter.onCoreEvent<'mcl_http:send:/sendFriendMessage'> extends (
    priority: number,
    event: 'mcl_http:send:/sendFriendMessage',
    listener: (event: infer R, listenerData: any) => void,
) => void
    ? R
    : never)['request']['messageChain'];

const compileFriendMsgChainSend = async (messageChain: MsgChainSend, targetQQ: number) => {
    let out = '';
    for (let i of messageChain) {
        if (i.type == 'Plain') {
            out += i.text;
        } else if (i.type == 'Quote') {
            const quotedMessage = await chlamydbot.mclHttpClient.send('/messageFromId', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                messageId: i.id,
                target: targetQQ,
            });
            let quotedMessageStr: string;
            if (quotedMessage.data.type == 'FriendMessage') {
                quotedMessageStr = compileFriendMessageChain(quotedMessage.data.messageChain);
            } else {
                quotedMessageStr = '未知类型或已被遗忘的消息';
            }
            out += `[回复: ${quotedMessageStr}]`;
        } else if (i.type == 'Image' || i.type == 'FlashImage') {
            out += `[图片-你的API无法显示图片]`;
        } else {
            out += `[未知类型消息]`;
        }
    }
    return out;
};

const compileGroupMsgChainSend = async (messageChain: MsgChainSend, targetQQ: number) => {
    let out = '';
    for (let i of messageChain) {
        if (i.type == 'Plain') {
            out += i.text;
        } else if (i.type == 'Quote') {
            const quotedMessage = await chlamydbot.mclHttpClient.send('/messageFromId', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                messageId: i.id,
                target: targetQQ,
            });
            let quotedMessageStr: string;
            if (quotedMessage.data.type == 'FriendMessage') {
                quotedMessageStr = compileFriendMessageChain(quotedMessage.data.messageChain);
            } else {
                quotedMessageStr = '未知类型或已被遗忘的消息';
            }
            out += `[回复: ${quotedMessageStr}]`;
        } else if (i.type == 'Image' || i.type == 'FlashImage') {
            out += `[图片-你的API无法显示图片]`;
        } else if (i.type == 'At') {
            const targetName = (
                await chlamydbot.mclHttpClient.send('/memberProfile', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: targetQQ,
                    memberId: i.target,
                })
            ).nickname;
            out += `[@: {昵称: ${targetName}, QQ: ${i.target}}]`;
        } else if (i.type == 'AtAll') {
            out += `[@全体成员]`;
        } else {
            out += `[未知类型消息]`;
        }
    }
    return out;
};

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl_http:send:/sendFriendMessage', async (event) => {
    const target = (event.request as any).target ?? (event.request as any).qq;
    let targetObj = await Sender.findOne({
        where: {
            qq: target,
        },
    });
    if (!targetObj) {
        const targetName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target,
            })
        ).nickname;
        targetObj = Sender.build({
            qq: target,
            name: targetName,
            messageList: '[]',
        });
    }

    let message = await compileFriendMsgChainSend(event.request.messageChain, target);
    if (event.request.quote) {
        const quotedMessage = await chlamydbot.mclHttpClient.send('/messageFromId', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            messageId: event.request.quote,
            target,
        });
        let quotedMessageStr: string;
        if (quotedMessage.data.type == 'FriendMessage') {
            quotedMessageStr = compileFriendMessageChain(quotedMessage.data.messageChain);
        } else {
            quotedMessageStr = '未知类型或已被遗忘的消息';
        }
        message = `[回复: ${quotedMessageStr}]${message}`;
    }

    targetObj.messageList = updateHistory(targetObj.messageList, message, true);
    await targetObj.save();
});

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl_http:send:/sendGroupMessage', async (event) => {
    const target = (event.request as any).target ?? (event.request as any).group;
    let targetObj = await Group.findOne({
        where: {
            qq: target,
        },
    });
    if (!targetObj) {
        const targetName = (
            await chlamydbot.mclHttpClient.send(
                '/groupConfig',
                {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target,
                },
                'GET',
            )
        ).name;
        targetObj = Group.build({
            qq: target,
            name: targetName,
            messageList: '[]',
        });
    }

    let message = await compileGroupMsgChainSend(event.request.messageChain, target);
    if (event.request.quote) {
        const quotedMessage = await chlamydbot.mclHttpClient.send('/messageFromId', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            messageId: event.request.quote,
            target,
        });
        let quotedMessageStr: string;
        if (quotedMessage.data.type == 'FriendMessage') {
            quotedMessageStr = compileFriendMessageChain(quotedMessage.data.messageChain);
        } else {
            quotedMessageStr = '未知类型或已被遗忘的消息';
        }
        message = `[回复: ${quotedMessageStr}]${message}`;
    }

    targetObj.messageList = updateHistory(targetObj.messageList, message, true);
    await targetObj.save();
});

chlamydbot.states.getHistory = async (sender: number) => {
    let senderObj = await Sender.findOne({
        where: {
            qq: sender,
        },
    });
    if (!senderObj) {
        const senderName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
            })
        ).nickname;
        senderObj = await Sender.create({
            qq: sender,
            name: senderName,
            messageList: '[]',
        });
    }
    return JSON.parse(senderObj.messageList);
};

chlamydbot.states.getBotState = async (sender: number) => {
    let senderObj = await Sender.findOne({
        where: {
            qq: sender,
        },
    });
    if (!senderObj) {
        const senderName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
            })
        ).nickname;
        senderObj = await Sender.create({
            qq: sender,
            name: senderName,
            messageList: '[]',
        });
    }
    return senderObj.botState;
};

chlamydbot.states.setBotState = async (sender: number, state: string) => {
    let senderObj = await Sender.findOne({
        where: {
            qq: sender,
        },
    });
    if (!senderObj) {
        const senderName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
            })
        ).nickname;
        senderObj = Sender.build({
            qq: sender,
            name: senderName,
            messageList: '[]',
        });
    }
    senderObj.botState = state;
    await senderObj.save();
};

chlamydbot.states.resetMemory = async (sender: number) => {
    let senderObj = await Sender.findOne({
        where: {
            qq: sender,
        },
    });
    if (!senderObj) {
        const senderName = (
            await chlamydbot.mclHttpClient.send('/friendProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
            })
        ).nickname;
        senderObj = Sender.build({
            qq: sender,
            name: senderName,
            messageList: '[]',
        });
    }
    senderObj.messageList = '[]';
    await senderObj.save();
};
