let inParseState = {};

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', (event, listenerData) => {
    const sender = event.sender.id;

    if (inParseState[sender]) {
        inParseState[sender] = false;
        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: sender,
            messageChain: [
                {
                    type: 'Plain',
                    text: `解析结果:\n${JSON.stringify(event.messageChain)}`,
                },
            ],
        });

        listenerData.handled = true;
    } else if (
        event.messageChain.length >= 2 &&
        event.messageChain[1].type == 'Plain' &&
        event.messageChain[1].text == '/parse'
    ) {
        inParseState[sender] = true;
        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: sender,
            messageChain: [
                {
                    type: 'Plain',
                    text: '进入解析状态',
                },
            ],
        });

        listenerData.handled = true;
    }
});
