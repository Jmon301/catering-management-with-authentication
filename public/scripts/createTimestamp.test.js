
const createTimestamp = require('./createTimestamp');

const date = "11/19/2021 9:34";


test('validate month', () => {
    expect(createTimestamp()).toContain('11');
});

test('validate day', () => {
    expect(createTimestamp()).toContain('19');
});

test('validate time', () => {
    expect(createTimestamp()).toContain('9:34');
});

test('validate complete date', () => {
    expect(createTimestamp()).toContain(date);
});

