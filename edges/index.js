class Edges {
    constructor(shape = {}) {
        this.schema = shape;
        this.tasks = {};
    }

    static shape(object) {
        var shaped = JSON.parse(JSON.stringify(object));
        for(let prop in object) {
            if(typeof object[prop] != "object") {
                shaped[prop] = typeof object[prop];
            } else if(Array.isArray(object[prop])) {
                shaped[prop] = typeof object[prop];
            } else {
                shaped[prop] = Edges.shape(object[prop])
            }
        }
        return shaped;
    }

    task(name = "", func = function(object) {}) {
        if(typeof func != "function") throw new Error("TASKERR! Please feed the task method a function to be executed");
        if(typeof name != "string") throw new Error("TASKERR! Please feed the task method a proper name to input by");
        if(func.constructor.name != "AsyncFunction" && func() instanceof Promise == false) throw new Error("TASKERR! Please feed the task method an asynchronous function");
        this.tasks[name] = func;
    }

    listTasks() {
        let tasks = [];
        for(let task in this.tasks) {
            tasks.push(task);
        }
        return tasks.join(", ");
    }

    isShape(data = this.schema, schema = undefined) {
        if(!schema) schema = this.schema;
        for(let node in schema) {
            if(typeof schema[node] != "object") {
                if(typeof data[node] != schema[node]) throw new Error(`SHAPEERR! Shape mismatch at '${node}'\nData value '${data[node]}' does not match type '${schema[node]}'`);
            } else {
                this.isShape(data[node], schema[node]);
            }
        }
        return true;
    }

    sorts(datas = [{}]) {
        datas.sort((a, b) => {
            a = a.finished;
            b = b.finished;
            return a<b ? -1 : a<b ? 1 : 0;
        });
    }

    async runs(tasks = [""], data = this.schema, options = {
        overlap: true
    }) {
        if(Array.isArray(tasks) == false) throw new Error("RUNERR! Please feed the run method an array of existing tasks");
        this.isShape(data);
        let datas = await (new Promise((resolve, reject) => {
            let altered = [];
            for(let task of tasks) {
                this.tasks[task](data).then(res => {
                    this.isShape(res);
                    altered.push({
                        "task": task,
                        "finished": Date.now(),
                        "data": res
                    });
                    if(altered.length >= tasks.length) resolve(altered);
                })
            }
        }))
        // We now have an object containing all changes to the previous data
        // We need to concatenate them based off of most to least recent
        function update(data, prev) {
            let stage = JSON.parse(JSON.stringify(prev));
            for(let p in prev) {
                if(typeof prev[p] != "object") {
                    if(stage[p] != data[p]) {
                        stage[p] = data[p];
                    }
                } else if(Array.isArray(prev[p])) {
                    if(JSON.stringify(stage[p]) != JSON.stringify(data[p])) {
                        stage[p] = data[p];
                    }
                } else {
                    stage[p] = update(data[p], stage[p]);
                }
            }
            return stage;
        }

        function concat(datas) {
            var concat = datas[0].data;
            for(let stage in datas) {
                concat = update(datas[stage].data, concat);
            }
            return concat;
        }

        this.sorts(datas);
        return concat(datas);
    }
}

module.exports = Edges;