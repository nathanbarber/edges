# Async Data "Pipeline"

Edges takes a user-specified data chunk and performs asynchronous tasks on it, returning the end result.
The point of this project is to create a data pipeline framework that can take full advantage of the async nature of Node.js.

# Usage

Edges works by being assigned named async functions and then updating a schema-based JSON object with the ending of each subsequent Promise.  
Here are the Docs so far.

## Initializing your Edge
```javascript
const Edges = require("edges"),
    Edge = new Edges({
        //Your JSON Schema Here
    });
```

## Data-to-schema
If you want to create a schema out of an existing chunk of data, you can initialize your Edge with the static `Edge.shape()` method.
```javascript
Edge = new Edges(Edges.shape({
    // Your chunk of data here
}));
```

## Adding a task  
For each task, add a descriptor and an asynchronous function with one parameter for the data you'll be modifying. You can have any number of tasks.
```javascript
Edge.task("populate data for something", async inputData => {
    // perform some async task
    let datapoint = await rp.get("{some-api-url}");
    // modify your data
    inputData.some_random_property = datapoint;
    // send it back into the mix
    return inputData;
});
```


## Running your tasks
When running tasks, be sure to have your first argument as an array of task names (`['task1', 'task2', ...]`), and your second argument as the data to be modified through the async pipeline.   
The object that's fed in to `Edge.runs()` will be checked for likeness to the 'shape' object defined in the Edge constructor.   
`Edge.runs()` will return a Promise containing the modified data.
```javascript
Edge.runs(["populate data for something", "another task", "..."], {/* Your schema based object */})
.then(datas => {
    // Woot
    console.log(datas);
})
.catch(err => {
    // Shoot
    throw err;
});
```
