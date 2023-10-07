console.log('Loading script: openai...');

const openaiProxyUrl = require('fs')
    .readFileSync(require('path').resolve(__dirname, 'openai-proxy-url.txt'), 'utf-8')
    .split('\n')[0];

chlamydbot.states.dynamicKey = '';

chlamydbot.backend.post('/set-dynamic-key', (req, res) => {
    chlamydbot.states.dynamicKey = req.body.key;
    console.log('Dynamic key set to', chlamydbot.states.dynamicKey);
    res.status(200).send('OK');
});

chlamydbot.axios.post(`http://${openaiProxyUrl}/update-dynamic-key`);

const ownerQQ = 2457242458;

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
}); // mcl:FriendMessage
