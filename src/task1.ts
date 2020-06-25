type TPoolTask<T> = () => Promise<T>;

export interface IPoolError extends Error {
    isTimeout: boolean;
}

export class Pool<T> {
    private pendingTasks: any[];

    /**
     * @param {{limit: number, timeout: number}} options
     * @param {number} options.limit максимальное количество запущенных одновременно задач
     * @param {number} options.timeout [мс] таймаут выполнения задачи
     */
    constructor(private options: {limit: number; timeout?: number;}) {
        this.pendingTasks = [];
    }

    private runTask<T = any>(task: TPoolTask<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            task().then(resolve, reject);
            const poolError = new Error('Promise timeout') as IPoolError;
            poolError.isTimeout = true;
            setTimeout(
                () => reject(poolError),
                this.options.timeout
            );
        });
    }

    /**
     * Запуск задачи
     * @param {TPoolTask} task
     */
    public run<T = any>(task: TPoolTask<T>): Promise<T> {
        return (async () =>  {
            while (this.pendingTasks.length >= this.options.limit) {
                await Promise.race(this.pendingTasks);
            }

            const runningTask  = this.runTask(task);
            this.pendingTasks.push(runningTask);

            await runningTask;
            this.pendingTasks = this.pendingTasks.filter(pending => pending !== runningTask);

            return runningTask;
        })();
    }
}
