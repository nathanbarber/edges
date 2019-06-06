const Edges = require("../index"),
    Edge = new Edges({
        "name": "string",
        "cool": "boolean"
    })

Edge.task("change_name", async (data) => {
    return (await new Promise(resolve => {
        setTimeout(() => {
            data.name = "crazycorn"
            resolve(data);
        }, 300);
    }));
});

Edge.task("change_name_and_cool", async(data) => {
    return (await new Promise(resolve => {
        setTimeout(() => {
            data.cool = false;
            resolve(data);
        }, 100)
    }))
})

let id = {
    "name": "Spook",
    "cool": false
}
Edge.runs(["change_name", "change_name_and_cool"], id).then(res => {
    console.log(res);
})

shape = Edges.shape({
    "name": [],
    "family": {
        "name": "joe",
        "type": {
            "distant": true
        }
    },
    "tootsie": false
})

console.log(shape);