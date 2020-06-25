import { expect } from 'chai';
import { CashMachine } from '../src/task2';

describe('CashMachine', () => {
    const myCashMachine = new CashMachine({
        2000: 20,
        1000: 11,
        500: 65,
        100: 9
    });

    it('банкомат выдает правильную сумму', () => {
        const result = myCashMachine.getCash(2100);
        expect(result).to.eql({2000: 1, 100: 1});
    });

    it('приоритет отдается крупным купюрам', () => {
        const result = myCashMachine.getCash(500);
        expect(result).to.eql({500: 1});
    });

    it('нельзя выдать сумму меньше, чем минимальный номинал', () => {
        const result = myCashMachine.getCash(50);
        expect(result).to.eql(null);
    });

    it('если снять деньги не получилось, баланс не меняется', () => {
        myCashMachine.getCash(2150);
        const result = myCashMachine.getCashCassette();
        expect(result).to.eql('2000 x19\n1000 x11\n500 x64\n100 x8\n');
    });

    it('нельзя выдать большем, чем имеем', () => {
        const result = myCashMachine.getCash(85000);
        expect(result).to.eql(null);
    });

    it('корректно добавляется наличность', () => {
        myCashMachine.addToCassette({5000: 1, 100: 5});
        const result = myCashMachine.getCashCassette();
        expect(result).to.eql('5000 x1\n2000 x19\n1000 x11\n500 x64\n100 x13\n');
    });
});
