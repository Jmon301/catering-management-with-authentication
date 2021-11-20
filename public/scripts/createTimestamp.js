function createTimestamp () {
    const timeNow = Date.now();
    const timestampNow = new Date(timeNow);
    const date = timestampNow.toLocaleDateString();
    const time = timestampNow.toLocaleTimeString();
    return `${date} ${time}`;
}


module.exports = createTimestamp;