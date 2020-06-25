interface ICashCassette {
    /**
     * ключ - номинал банкноты, значение - количество банкнот
     */
    [nominal: number]: number;
}

export class CashMachine {
    private sortedNominal: number[];

    private sortNominalCash(): void {
        this.sortedNominal =  Object
            .keys(this.cashCassette)
            .map(Number)
            .sort((a, b) => b - a);
    }

    constructor(private cashCassette: ICashCassette) {
        this.sortNominalCash();
    }

    public getCash(sum: number): ICashCassette | null {
        const copyCashCassette = Object.assign({}, this.cashCassette);
        const result : ICashCassette = {};

        for (let i = 0; i < this.sortedNominal.length; i++) {
            const nominal = this.sortedNominal[i];
            if (sum - nominal < 0 || copyCashCassette[nominal] <= 0) {
                continue;
            }

            sum -= nominal;
            copyCashCassette[nominal] -= 1;

            if (!result.hasOwnProperty(nominal)) {
                result[nominal] = 0
            }
            result[nominal] += 1;
            i -= 1;
        }

        if (sum === 0) {
            this.cashCassette = copyCashCassette;
            return result;
        }
        return null;
    }

    public addToCassette(cash: ICashCassette): void {
        const new_nominal = Object
            .keys(cash)
            .map(Number);

        for (let i = 0; i < new_nominal.length; i++) {
            const nominal = new_nominal[i];

            if (!this.cashCassette.hasOwnProperty(nominal)) {
                this.cashCassette[nominal] = 0
            }
            this.cashCassette[nominal] += cash[nominal]
        }

        this.sortNominalCash();
    }

    public getCashCassette(): string {
        let result = '';
        for (let i = 0; i < this.sortedNominal.length; i++) {
            const nominal = this.sortedNominal[i];
            result += `${nominal} x${this.cashCassette[nominal]}\n`
        }

        return result
    }
}
