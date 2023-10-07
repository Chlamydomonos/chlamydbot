const ownerQQ = 2457242458;

const handlingFriendRequests = new Map<number, { fromId: number; groupId: number }>();
let lastFriendRequestEventId = -1;

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:NewFriendRequestEvent', (event) => {
    const { eventId, fromId, groupId, nick } = event;
    handlingFriendRequests.set(eventId, { fromId, groupId });
    lastFriendRequestEventId = eventId;
    chlamydbot.mclHttpClient.send('/sendFriendMessage', {
        sessionKey: chlamydbot.mclHttpClient.sessionKey,
        target: ownerQQ,
        messageChain: [
            {
                type: 'Plain',
                text: `收到来自${nick}(${fromId})的好友请求。`,
            },
        ],
    });
});

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', (event, listenerData) => {
    const senderId = event.sender.id;
    const messageChain = event.messageChain;
    if (senderId !== ownerQQ) {
        return;
    }
    if (messageChain.length < 2) {
        return;
    }
    const firstMessage = messageChain[1];
    if (firstMessage.type != 'Plain') {
        return;
    }
    if (firstMessage.text == '/accept') {
        const { fromId, groupId } = handlingFriendRequests.get(lastFriendRequestEventId)!;
        chlamydbot.mclHttpClient.send('/resp/newFriendRequestEvent', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            eventId: lastFriendRequestEventId,
            fromId,
            groupId,
            operate: 0,
            message: '',
        });

        listenerData.handled = true;
    } else if (firstMessage.text == '/reject') {
        const { fromId, groupId } = handlingFriendRequests.get(lastFriendRequestEventId)!;
        chlamydbot.mclHttpClient.send('/resp/newFriendRequestEvent', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            eventId: lastFriendRequestEventId,
            fromId,
            groupId,
            operate: 1,
            message: '',
        });

        listenerData.handled = true;
    }

    let isCommand = /^\/(accept|reject)\s+([0-9]+)\s*$/.exec(firstMessage.text);
    if (isCommand) {
        const operate = isCommand[1] == 'accept' ? 0 : 1;
        const eventId = parseInt(isCommand[2]);
        const { fromId, groupId } = handlingFriendRequests.get(eventId)!;
        chlamydbot.mclHttpClient.send('/resp/newFriendRequestEvent', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            eventId,
            fromId,
            groupId,
            operate,
            message: '',
        });

        listenerData.handled = true;
    }
});
