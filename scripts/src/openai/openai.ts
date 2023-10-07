import * as fs from 'fs';
import { compileFriendMessageChain } from '../../lib/openai';
import { ownerQQ } from '../../lib/basic';

console.log('Loading script: openai...');

//#region proxy settings

const openaiProxyUrl = fs.readFileSync(chlamydbot.getFile('openai-proxy-url.txt'), 'utf-8').split('\n')[0];

chlamydbot.states.dynamicKey = '';

chlamydbot.backend.post('/set-dynamic-key', (req, res) => {
    chlamydbot.states.dynamicKey = req.body.key;
    console.log('Dynamic key set to', chlamydbot.states.dynamicKey);
    res.status(200).send('OK');
});

chlamydbot.axios.post(`http://${openaiProxyUrl}/update-dynamic-key`);

//#endregion

//#region data

const prompts = {
    standard:
        '你是一个QQ机器人，名叫Chlamydbot。你的主人名叫Chlamydomonos，他的QQ号是2457242458。你的责任是与好友聊天。你应该用可爱的语气做出回应，并尽量使用emoji。',
} as Record<string, string | undefined>;

const promptWithoutHistory =
    '默认情况下，你只能看到最新的一条消息，请尽量只根据这条消息来生成回复。如果遇到需要更详细的消息历史记录才能回答的问题，你可以调用`get_history`来获得一些历史消息。';
const promptWithHistory =
    '由于你的记忆力有限，你只能看到近期的聊天记录。如果你无法通过这些聊天记录回答问题，请告知用户你的记忆力有限。';

const functions = {
    standard: [
        {
            name: 'get_history',
            description: '获取你与当前好友的历史消息',
            parameters: { type: 'object', properties: {} },
        },
    ],
} as Record<string, any[] | undefined>;

//#endregion

function handleErrorInFriendChat(e: any, sender: number, status: 0 | 1) {
    let msg: string;
    if (status == 0) {
        msg = '无法连接OpenAI API';
    } else {
        msg = 'OpenAI API返回了错误数据';
    }
    const errMsg = e instanceof Error ? e.message : e;
    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
        sessionKey: chlamydbot.mclHttpClient.sessionKey,
        target: sender,
        messageChain: [
            {
                type: 'Plain',
                text: `${msg}，请把以下消息发给Chlamydomonos以确认情况：\n${errMsg}`,
            },
        ],
    });
}

let inDebugMode = false;

async function handleChat(request: any) {
    if (request.functions && request.functions.length == 0) {
        request.functions = undefined;
        request.function_call = undefined;
    }
    const response = await chlamydbot.axios.post(`http://${openaiProxyUrl}/chat`, {
        key: chlamydbot.states.dynamicKey,
        openAIrequest: request,
    });
    if (response.status == 200 && inDebugMode) {
        await chlamydbot.mclHttpClient.send('/sendFriendMessage', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: ownerQQ,
            messageChain: [
                {
                    type: 'Plain',
                    text: `调试模式：\n${JSON.stringify(response.data)}`,
                },
            ],
        });
    }
    return response;
}

//debug mode
chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', (event, listenerData) => {
    const sender = event.sender.id;
    if (sender == ownerQQ) {
        if (
            event.messageChain.length >= 2 &&
            event.messageChain[1].type == 'Plain' &&
            event.messageChain[1].text == '/-debug-openai'
        ) {
            inDebugMode = !inDebugMode;
            chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
                messageChain: [
                    {
                        type: 'Plain',
                        text: inDebugMode
                            ? 'Debug模式已启动，将把所有聊天的OpenAI API调用结果发给你。'
                            : 'Debug模式已关闭。',
                    },
                ],
            });
            listenerData.handled = true;
        }
    }
});

chlamydbot.eventEmitter.onCoreEvent(10, 'mcl:FriendMessage', async (event, listenerData) => {
    const sender = event.sender.id;
    const dynamicKey = chlamydbot.states.dynamicKey;

    // owner commands
    if (sender == ownerQQ) {
        if (
            event.messageChain.length >= 2 &&
            event.messageChain[1].type == 'Plain' &&
            event.messageChain[1].text.startsWith('/')
        ) {
            const msg = event.messageChain[1].text;
            const isSetOpenaiUrl = /^\/-set-openai-url (\S+)$/.exec(msg);
            if (isSetOpenaiUrl) {
                chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: sender,
                    messageChain: [
                        {
                            type: 'Plain',
                            text: `设置OpenAI API URL为：${isSetOpenaiUrl[1]}`,
                        },
                    ],
                });

                try {
                    const result = await chlamydbot.axios.post(`http://${openaiProxyUrl}/set-openai-url`, {
                        key: dynamicKey,
                        url: isSetOpenaiUrl[1],
                    });
                    if (result.status == 200) {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `设置成功`,
                                },
                            ],
                        });
                    } else {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `设置失败：${result.status}`,
                                },
                            ],
                        });
                    }
                } catch (e) {
                    const errMsg = e instanceof Error ? e.message : e;
                    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                        sessionKey: chlamydbot.mclHttpClient.sessionKey,
                        target: sender,
                        messageChain: [
                            {
                                type: 'Plain',
                                text: `设置失败：${errMsg}`,
                            },
                        ],
                    });
                }

                listenerData.handled = true;
            }

            const isSetOpenaiKey = /^\/-set-openai-key (\S+)$/.exec(msg);
            if (isSetOpenaiKey) {
                chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: sender,
                    messageChain: [
                        {
                            type: 'Plain',
                            text: `设置OpenAI API Key为：${isSetOpenaiKey[1]}`,
                        },
                    ],
                });

                try {
                    const result = await chlamydbot.axios.post(`http://${openaiProxyUrl}/set-openai-key`, {
                        key: dynamicKey,
                        newKey: isSetOpenaiKey[1],
                    });

                    if (result.status == 200) {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `设置成功`,
                                },
                            ],
                        });
                    } else {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `设置失败：${result.status}`,
                                },
                            ],
                        });
                    }
                } catch (e) {
                    const errMsg = e instanceof Error ? e.message : e;
                    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                        sessionKey: chlamydbot.mclHttpClient.sessionKey,
                        target: sender,
                        messageChain: [
                            {
                                type: 'Plain',
                                text: `设置失败：${errMsg}`,
                            },
                        ],
                    });
                }

                listenerData.handled = true;
            }

            const isChatApiCall = /^\/-chat-api-call\s+([\S\s]+)$/.exec(msg);
            if (isChatApiCall) {
                const dataStr = isChatApiCall[1];
                const data = JSON.parse(dataStr);

                chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: sender,
                    messageChain: [
                        {
                            type: 'Plain',
                            text: `调用OpenAI API，数据为：\n${dataStr}`,
                        },
                    ],
                });

                try {
                    const result = await chlamydbot.axios.post(`http://${openaiProxyUrl}/chat`, {
                        key: dynamicKey,
                        openAIrequest: data,
                    });

                    if (result.status == 200) {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `调用成功，结果为：\n${JSON.stringify(result.data)}`,
                                },
                            ],
                        });
                    } else {
                        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                            sessionKey: chlamydbot.mclHttpClient.sessionKey,
                            target: sender,
                            messageChain: [
                                {
                                    type: 'Plain',
                                    text: `调用失败：${result.status}`,
                                },
                            ],
                        });
                    }
                } catch (e) {
                    const errMsg = e instanceof Error ? e.message : e;
                    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                        sessionKey: chlamydbot.mclHttpClient.sessionKey,
                        target: sender,
                        messageChain: [
                            {
                                type: 'Plain',
                                text: `调用失败：${errMsg}`,
                            },
                        ],
                    });
                }

                listenerData.handled = true;
            }
        }
    } // owner commands

    if (listenerData.handled) {
        return;
    }

    for (let i = 0; ; i++) {
        //#region normal chat

        const senderName = (
            await chlamydbot.mclHttpClient.send('/memberProfile', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
                memberId: sender,
            })
        ).nickname;

        const message = compileFriendMessageChain(event.messageChain);

        const botState = await chlamydbot.states.getBotState(sender);

        const request = {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 512,
            function_call: 'auto',
            messages: [
                {
                    role: 'system',
                    content: prompts[botState] + promptWithoutHistory,
                },
                {
                    role: 'system',
                    content: `你现在正在与${senderName}聊天，其QQ号为${sender}。`,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            functions: functions[botState] ?? [],
        };

        let response: any;
        try {
            const result = await handleChat(request);
            if (result.status != 200) {
                throw new Error(`OpenAI API返回了${result.status}`);
            }
            response = result.data;
        } catch (e) {
            handleErrorInFriendChat(e, sender, 0);
        }

        if (!response.choices[0].message) {
            handleErrorInFriendChat(JSON.stringify(response), sender, 1);
            return;
        }

        let responseMessage = response.choices[0].message;

        if (responseMessage.content) {
            chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
                messageChain: [
                    {
                        type: 'Plain',
                        text: responseMessage.content,
                    },
                ],
            });
            listenerData.handled = true;
            return;
        }

        //#endregion

        //#region no function call (this is an error)

        if (!responseMessage.function_call) {
            handleErrorInFriendChat(JSON.stringify(response), sender, 1);
        }

        //#endregion

        let oldRequest: any = request;

        //#region function call - get_history

        if (responseMessage.function_call.name == 'get_history') {
            const history = await chlamydbot.states.getHistory(sender);
            const newRequest = {
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 512,
                function_call: 'auto',
                messages: [
                    {
                        role: 'system',
                        content: prompts[botState] + promptWithHistory,
                    },
                    {
                        role: 'system',
                        content: `你现在正在与${senderName}聊天，其QQ号为${sender}。`,
                    },
                    ...history.map((value) => ({
                        role: value.isAssistant ? 'assistant' : 'user',
                        content: value.message,
                    })),
                ],
                functions: functions[botState]?.filter((value) => value.name != 'get_history') ?? [],
            };

            if (inDebugMode) {
                await chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                    sessionKey: chlamydbot.mclHttpClient.sessionKey,
                    target: ownerQQ,
                    messageChain: [
                        {
                            type: 'Plain',
                            text: `调试模式：自动发送以下请求：\n${JSON.stringify(newRequest)}`,
                        },
                    ],
                });
            }

            try {
                const newResponse = await handleChat(newRequest);

                if (newResponse.status != 200) {
                    throw new Error(`OpenAI API返回了${newResponse.status}`);
                }

                if (!newResponse.data.choices[0].message) {
                    throw JSON.stringify(newResponse.data);
                }

                responseMessage = newResponse.data.choices[0].message;

                if (responseMessage.content) {
                    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                        sessionKey: chlamydbot.mclHttpClient.sessionKey,
                        target: sender,
                        messageChain: [
                            {
                                type: 'Plain',
                                text: responseMessage.content,
                            },
                        ],
                    });
                    listenerData.handled = true;
                    return;
                }

                oldRequest = newRequest;
            } catch (e) {
                handleErrorInFriendChat(e, sender, typeof e == 'string' ? 1 : 0);
            }
        }

        //#endregion

        // 用来应对将来可能添加的更多function call
        for (;;) {
            break;
        }

        if (i >= 5) {
            chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender,
                messageChain: [
                    {
                        type: 'Plain',
                        text: `你的消息似乎有问题，导致我思考多次也无法给出正确回复。`,
                    },
                ],
            });
            return;
        }
    }
}); // mcl:FriendMessage
