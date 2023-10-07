import { ownerQQ } from '../lib/basic';

chlamydbot.eventEmitter.onCoreEvent(100, 'mcl:FriendMessage', async (event, listenerData) => {
    const { sender, messageChain } = event;
    if (sender.id !== ownerQQ) {
        return;
    }
    if (messageChain.length < 2) {
        return;
    }
    const firstMessage = messageChain[1];
    if (firstMessage.type != 'Plain') {
        return;
    }

    const isCommand = /^\/test-mcl(?:-(get|post))?\s+?(\S+?)\s+?(\S[\s\S]*)$/.exec(firstMessage.text);
    if (isCommand) {
        const method: string | undefined = isCommand[1]?.toUpperCase();
        const path = isCommand[2];
        let bodyText = isCommand[3];

        if (bodyText.includes('$session$')) {
            bodyText = bodyText.replace(/\$session\$/g, JSON.stringify(chlamydbot.mclHttpClient.sessionKey));
        }
        const body = JSON.parse(bodyText);

        await chlamydbot.mclHttpClient.send('/sendFriendMessage', {
            sessionKey: chlamydbot.mclHttpClient.sessionKey,
            target: sender.id,
            messageChain: [
                {
                    type: 'Plain',
                    text: `发送请求到 ${method ?? '自动'} ${path}，数据为：\n${body}`,
                },
            ],
        });

        try {
            const response = await (chlamydbot.mclHttpClient.send as (...args: any[]) => Promise<any>)(
                path,
                body,
                method,
            );
            await chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender.id,
                messageChain: [
                    {
                        type: 'Plain',
                        text: `请求成功，返回数据：\n${JSON.stringify(response)}`,
                    },
                ],
            });
        } catch (e) {
            await chlamydbot.mclHttpClient.send('/sendFriendMessage', {
                sessionKey: chlamydbot.mclHttpClient.sessionKey,
                target: sender.id,
                messageChain: [
                    {
                        type: 'Plain',
                        text: `请求失败，错误信息：\n${e}`,
                    },
                ],
            });
        }

        listenerData.handled = true;
    }
});
