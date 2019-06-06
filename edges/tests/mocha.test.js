const Edges = require("../index"),
    assert = require("assert");

describe("Test initializations", () => {
    it("Can initialize an instance of the class with a specified schema", () => {
        let Edge = new Edges({
            "name": "string",
            "cool": false
        });
    });
    it("Can initialize an instance of the class with the static shape method", () => {
        let Edge = new Edges(Edges.shape({
            "name": "Nathan Barber",
            "cool": "Hell yes"
        }));
    });
});

describe("Test task creation and execution", () => {
    var Edge = new Edges({
        "name": "string",
        "cool": "boolean"
    });
    it("Can create new tasks based off the schema", () => {
        Edge.task("change_name", async (data) => {
            data.name = "Bungholio";
            return data;
        });
    });
    it("Errors when the tasks created violate the schema", () => {
        Edge.task("change_name_fail", async (data) => {
            data.name = false;
            return data;
        });
        Edge.runs(["change_name_fail"], {"name": "Beavis"})
        .then(res => {
            throw new Error();
        })
        .catch(err => {
            return;
        })
    });
    it("Can run the tasks", () => {
        Edge.runs(["change_name"], {"name": "Beavis", "cool": true})
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        });
    });
    it("Errors when the data supplied to .runs() violates the schema", () => {
        Edge.runs(["change_name"], {"name": false})
        .then(res => {
            throw new Error();
        })
        .catch(err => {
            return;
        });
    });
});