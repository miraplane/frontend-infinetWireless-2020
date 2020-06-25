import sinon from "ts-sinon";
import { IPoolError, Pool } from '../src/task1';
import {expect} from "chai";

function makeTask<T = any>(spy: any): () => Promise<T>{
    return () => new Promise(resolve => {
        setTimeout(() => {
            spy();
            resolve();
        }, 100);
    });
}

describe('CashMachine', () => {
    it('Из 2 промисов параллельно исполняется только один с учетом порядка', () => {
        const pool = new Pool({limit: 1, timeout: 1000});
        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        pool.run(makeTask(firstSpy))
            .then( () => {
                expect(firstSpy.calledOnce).true;
                expect(secondSpy.calledOnce).false;
            });
        pool.run(makeTask(secondSpy))
            .then( () => {
                expect(firstSpy.calledOnce).true;
                expect(secondSpy.calledOnce).true;
                expect(firstSpy.calledBefore(secondSpy)).true;
            });
    });

    it('Промис выполняется долше чем нужно', () => {
        const pool = new Pool({limit: 10, timeout: 1});
        const firstSpy = sinon.spy();

        pool.run(makeTask(firstSpy))
            .then()
            .catch<IPoolError>((error) => {
                expect(error.isTimeout).true;
                return error;
            });
    });
});
