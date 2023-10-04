const { chlamydbot } = require('./global');

chlamydbot.app.eventEmitter.onCoreEvent('mcl:FriendMessage', (event) => {
    chlamydbot.app.mclHttpClient.send('/sendFriendMessage', {
        sessionKey: chlamydbot.app.mclHttpClient.sessionKey,
        target: event.sender.id,
        messageChain: [
            {
                type: 'Plain',
                text: 'Hello, World!',
            },
        ],
    });
});
