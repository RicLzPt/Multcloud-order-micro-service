export default class OrderCode {

    private value: string;

    constructor(
        readonly date: Date,
        readonly sequence: number
    ) {
        if (sequence < 0) throw new Error("Invalid sequence");
        const year = date.getFullYear();
        this.value = `${year}${String(sequence).padStart(8, "0")}`;
    }

    getValue(): string {
        return this.value;
    }
}