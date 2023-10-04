console.log('Loading script: helloworld...');

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', (event, listenerData) => {
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

        listenerData.handled = true;
    }
});
