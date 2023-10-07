declare interface States {
    dynamicKey: string;
    getHistory(sender: number): Promise<
        {
            isAssistant: boolean;
            message: string;
        }[]
    >;
    getBotState(sender: number): Promise<string>;
    setBotState(sender: number, state: string): Promise<void>;
}
