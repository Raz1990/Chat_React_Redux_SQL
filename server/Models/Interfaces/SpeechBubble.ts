import IChatEntity from "./ChatEntity";

export default interface ISpeechBubble {
    sender: IChatEntity,
    receiver: IChatEntity,
    content: string,
    timeSent: string,
}