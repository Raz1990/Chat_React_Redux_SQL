export default interface ICanChat {
    getId(): number,
    getName(): string,
    getPassword?(): string
    getType(): string
    setName(val: string): void
    getInfoString(): string
    getItems?(): ICanChat[]
}