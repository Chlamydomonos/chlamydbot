declare interface States {
    dynamicKey: string;
    openAIInDebug: boolean;
    getHistory(sender: number): Promise<
        {
            isAssistant: boolean;
            message: string;
        }[]
    >;
    getBotState(sender: number): Promise<string>;
    setBotState(sender: number, state: string): Promise<void>;
    resetMemory(sender: number): Promise<void>;
}
