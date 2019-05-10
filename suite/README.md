# Lexus testsuite

This folder contains the reference test suite for Lexus.
Any backend implementations of Lexus should pass this test suite.

The reference records in `records/100.sensor.events.jsonl` should be added to the storage system.
After that each of the tests in the `queries/` subfolder should pass.
This involves issuing the `query` part to the system, and having the results that come back match what is in the `result` section.
Ideally these tests are part of an automated unit test script in your Lexus backend implementation.

## Tools

To assist in automatically translating or generating the tests in the programming language or environment of your implementation, a simple loader of all the above files is provided.
This can be `require()`d into a node.js script that helps you translate the tests. After `init()` is called and the callback is fired, the module then contains an initialized member variable `records` which is an array of all the records in the `records/100.sensor.events.jsonl` file. It also contains a `queries` member keyed by the name of each fo the files under the `queries` folder. The following snippet of code illustrates this:

```
> let suite = require('./suite');
undefined
> suite.init().then(function() { console.log("done"); });
undefined
done
>
> suite.records.length
100
> suite.records[0]
{ event: 'wind.sensor.reading',
  id: 'caa46a86-d0b6-d26e-59be-ff4d99f5fbb8',
  ts: 1553287091236,
  arrival: '2019-03-22T22:06:31.485Z',
  wind: { direction: 'se', speed: 7 },
  sensor:
   { deviceID: '1f7a4d18cbc4',
     position: { lat: 30.040565, lon: -84.843976 },
     firmware: '3.0',
     battery: '84%' },
  meta: { units: 'mph' } }
> suite.queries['query.sumMatchPrefixGroup.json'].query[0].group_by.length
1
> suite.queries['query.sumMatchPrefixGroup.json'].query[0].group_by[0]
'sensor.deviceID'
```
