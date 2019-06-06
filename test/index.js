const Edges = require("edges"),
    Edge = new Edges({
        "name": "string",
        "cool": "boolean"
    })

Edge.task("change_name", async (data) => {
    return (await new Promise(resolve => {
        setTimeout(() => {
            data.name = "Bool"
            resolve(data);
        }, 300);
    }));
});

let id = {
    "name": "Spook",
    "cool": true
}
Edge.runs(["change_name"], id).then(res => {
    console.log(res);
})