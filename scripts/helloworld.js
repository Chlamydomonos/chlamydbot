chlamydbot.eventEmitter.onCoreEvent('mcl:FriendMessage', (event) => {
    if (
        event.messageChain.length >= 2 &&
        event.messageChain[1].type == 'Plain' &&
        event.messageChain[1].text == '/hello'
    ) {
        chlamydbot.mclHttpClient.send('/sendFriendMessage', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: event.sender.id,
            messageChain: [
                {
                    type: 'Plain',
                    text: 'Hello world!',
                },
            ],
        });
    }
});
