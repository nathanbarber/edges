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

a = {
    name: "Nathan Barber",
    date: "August",
    cool: [8,3,2,1],
    facts: {
        "hello": true,
        "old": "no"
    }
}

b = {
    name: "Nathan Barber",
    date: "December",
    cool: [1,2],
    facts: {
        "hello": false,
        "old": "new"
    }
}

let timelist = [];
for(let i = 0; i < 20; i++) {
    timelist.push({
        iter: i,
        finished: Math.floor(Math.random() * 10)
    })
}

function sorts(datas) {
    datas.sort((a, b) => {
        a = a.finished;
        b = b.finished;
        return a<b ? -1 : a<b ? 1 : 0;
    });
}
sorts(timelist);

console.log(timelist);