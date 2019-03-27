class PromiseA {
    constructor(fn) {
        this.status = 'pendding';
        this.value;
        this.result;

        let resolve = (data) => {
            if (this.status === 'pendding') {
                this.status = 'resolve';
                this.value = data;
            }
        }

        let reject = (data) => {
            if (this.status === 'pendding') {
                this.status = 'reject';
                this.value = data;
            }
        }

        try {
            fn(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFufilled, onRejected) {
        if (this.status === 'resolve') {
            onFufilled(this.value);
        }
        if (this.status === 'reject') {
            onRejected(this.result);
        }
    }
}

const promise = new PromiseA((resolve, reject) => {
    resolve(1);
});

console.log(promise);