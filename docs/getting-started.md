# Getting Started with Lexus

Lexus is a small [JSON](http://www.json.org/) language used for querying data storage systems.
It is intended to be portable across systems and therefore does not try to cover the features of any one system comprehensively.
With Lexus you can query for a set of specific documents using filters that match them, or for counts of the documents that match.
You can also ask for basic historgrams or group by field values in the documents.
Other aggregations such as sums and averages are also possible.

This document will present a small set of examples to get you started.
For a more complete reference of the Lexus Syntax see the [schema](https://github.com/appcelerator/lexus-opensource/tree/master/schema).

The Lexus language is named after Dr. Lexus, a fictional character from the 2006 film [Idiocracy](https://en.wikipedia.org/wiki/Idiocracy).

### Example 1 - The Smallest Lexus Query

The most stripped down possible Lexus Query is the following:

```
{
  "version": "0.2",
  "invoke": {
    "method": "find"
  }
}
```

This will simply tell the Lexus to return any matching documents.
The `invoke` field is `{"method": "find"}` and there is no `filter` field.
So the query matches any document in the storage system and does no transformation or aggregation on the results.
By default, this backend implementation of Lexus is set to return 10 documents so the first 10 that are retrieved by the cursor of the data storage system are returned.

By using `limit` the number of documents retrieved can be changed. An `offset` can also be supplied to skip into any point in the cursor of documents retrieved. Finally, the `sort` parameter can tell Lexus how the documents should be ordered. See Example 8 for some of these being used.

The `version` field is required by Lexus.
It will cause Lexus to confirm the query is for a specification that matches the one it is implemented in.
In this case it is `0.2`.
The response will also contain the matching `version` field.
The response returned by Lexus also contains a `result` field, which in this case contains an array of the 10 raw documents.

### Example 2 - Using the Count Method

```
{
  "version": "0.2",
  "invoke": {
    "method": "count",
    "field": "event"
  }
}
```

In this example we would like a total count of the documents instead of the documents themselves.
We simply change the `invoke.method` from `find` to `count`, and add a `field` field.
The value in `field` is the name of the field that we want Lexus to use to count the documents.
This is useful when we want to count the subset of documents that have a particular field present.
In our example schema, every document contains the field `event` so the results of this query will be telling us the total number of documents in our data.

The result returned looks like:
```
[
  {
    "version": "0.2",
    "result": 8748139634
  }
]
```

### Example 3 - Using groups

```
{
  "version": "0.2",
  "invoke": {
    "method": "count",
    "field": "event"
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    }
  },
  "groups": [
    "event"
  ]
}
```

The use of `groups` in Lexus is similar to the SQL `group by` syntax.
The results returned will be broken down into sections for each value that can appear in the field named in the `groups`.

```
[
  {
    "version": "0.2",
    "result": {
      "reactor.audit.start": 873,
      "reactor.audit.end": 537,
      "boundingbox.lookup": 80,
      "process.set.token": 136,
      "process.unset.token": 80,
      "geo.recalibrate": 26,
      "audit.run.install": 55,
      "user.login": 35,
      "thermometer.reset": 13,
      "app.pause": 16
    }
  }
]
```

### Example 4 - Multiple groups

```
{
  "version": "0.2",
  "invoke": {
    "method": "count",
    "field": "event"
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    }
  },
  "groups": [
    "target",
    "event"
  ]
}
```

This example is identical to the above example except that the `groups` array now has `target` added.
In Lexus the value specified in the `groups` field is an array of strings that name the fields in the database we want to perform the grouping on.
The fields appearing earlier in the list are outermost in the grouping.

(The results of this query below have been truncated to save space.)
```
[
  {
    "version": "0.2",
    "result": {
      "ios": {
        "reactor.audit.start": 419,
        "reactor.audit.end": 269,
        "boundingbox.lookup": 80,
        "process.set.token": 64,
        "process.unset.token": 36,
        "geo.recalibrate": 26,
        "audit.run.install": 25,
        "user.login": 21,
        "thermometer.reset": 13
      },
      "android": {
        "reactor.audit.start": 451,
        "reactor.audit.end": 265,
        "process.set.token": 72,
        "process.unset.token": 44,
        "audit.run.install": 30,
        "app.pause": 16,
        "user.login": 13
      },
      "osx": {
        "reactor.init": 2,
        "reactor.audit.end": 2,
        "reactor.audit.start": 2,
        "universal.vm.start": 2,
        "android.hardware.start": 1,
        "android.vm.start": 1,
        "android.vm.install": 1,
        "reactor.CE": 1,
        "reactor.dashboard": 1,
        "code.analyze.CUE": 1
      },
      "win32": {
        "code.analyze.ruby": 2,
        "reactor.DTE": 1,
        "reactor.ruby": 1,
        "reactor.source": 1,
        "code.analyze.html": 1,
        "code.analyze.php": 1,
        "command.execute": 1,
        "tunnel.secure": 1,
        "upload.secure": 1,
        "reactor.audit.end": 1
      },
      "linux": {
        "tunnel.secure": 2,
        "upload.secure": 2,
        "reactor.failover": 1,
        "code.analyze.php": 1,
        "code.analyze.ruby": 1,
        "code.analyze.xml": 1,
        "tunnel.unsecure": 1,
        "upload.unsecure": 1
      },
      "curl": {
        "log.purge.api": 1,
        "user.login": 1
      },
      "raspberrypi": {
        "reactor.audit.start": 1
      }
    }
  }
]
```

### Example 5 - More Filtering, Limiting Groups

Here we show an example of the `$match` filter where we ask for the `source` field to match `analytics-api`.
We also have added a `"limit": 3` section under `params` in the `groups`.
This parameterizes the grouping to only allow the most popular 3 terms to be returned.

```
{
  "version": "0.2",
  "invoke": {
    "method": "count",
    "field": "event"
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    },
    "$match": {
      "source": "analytics-api"
    }
  },
  "groups": [
    {
      "type": "string",
      "field": "target",
      "params": {
        "limit": 3
      }
    },
    "event"
  ]
}
```

The above two additions will cause the same result to be returned as the previous example, but with no more than 3 terms in each event list and all non `analytics-api` related events removed. Because of this the `osx`, `win32` and `linux` `target` terms are gone.

```

[
  {
    "version": "0.2",
    "result": {
      "ios": {
        "reactor.audit.start": 419,
        "reactor.audit.end": 269,
        "boundingbox.lookup": 80,
        "process.set.token": 64,
        "process.unset.token": 36,
        "geo.recalibrate": 26,
        "audit.run.install": 25,
        "user.login": 21,
        "thermometer.reset": 13
      },
      "android": {
        "reactor.audit.start": 451,
        "reactor.audit.end": 265,
        "process.set.token": 72,
        "process.unset.token": 44,
        "audit.run.install": 30,
        "app.pause": 16,
        "user.login": 13
      }
    }
  }
]
```

### Example 6 - Shortcut for OR

Note that as a shorthand for `$or` we can supply an array of strings to a field in `$match` implicitly asking for an `$or` of any of the items in th list.
```
{
  "version": "0.2",
  "invoke": {
    "method": "count",
    "field": "event"
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    },
    "$match": {
      "event": [
        "android.vm.start",
        "iphone.vm.start",
        "universal.vm.start",
        "windows.vm.start"
      ]
    }
  },
  "groups": [
    "target",
    "event"
  ]
}
```

Only 2 `software_version` terms in the `target` of `osx` had events in the `$match` list.
```
[
  {
    "version": "0.2",
    "result": {
      "osx": {
        "iphone.vm.start": 1,
        "universal.vm.start": 1
        "universal.vm.start": 1
      }
    }
  }
]
```


### Example 7 - limit, offset, sort, include

In this example we ask Lexus for complete documents using `find` where `source = 'analytics-api'` and `event = 'reactor.audit.end'` and `target = 'android'` for the same time range as above.
We ask for a `limit` of 10 documents, and furthermore for an `offset` of 2.
That is, the first 2 documents will be skipped.
The `include` section tells Lexus we only wish to see the `deviceId` and `timestamp` fields in the results.
Finally, the `sort` field specifies that the `deviceId` field in the documents should be used to sort the results by descending deviceId.

```
{
  "version": "0.2",
  "invoke": {
    "method": "find",
    "params":{
      "limit": 10,
      "offset": 2,
      "include": ["deviceId", "timestamp"],
      "sort": {
        "deviceId": -1
      }
    }
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    },
    "$match": {
      "source": "analytics-api",
      "event": "reactor.audit.end",
      "target": "android"
    }
  }
}
```

The results look like this:
```
[
  {
    "version": "0.2",
    "result": [
      {
        "deviceId": "33daca0258563351",
        "timestamp": 1517431002690
      },
      {
        "deviceId": "356d9dd4b5af5926",
        "timestamp": 1517430995848
      },
      {
        "deviceId": "49f8151b492e9972",
        "timestamp": 1517431000757
      },
      {
        "deviceId": "4a135b492b1be304",
        "timestamp": 1517430998001
      },
      {
        "deviceId": "4ccae171e2c8d2e6",
        "timestamp": 1517430997446
      },
      {
        "deviceId": "62105cb5f202d5a5",
        "timestamp": 1517430998893
      },
      {
        "deviceId": "a2fa650a222aca9f",
        "timestamp": 1517431000721
      },
      {
        "deviceId": "b4b9ecffc538230d",
        "timestamp": 1517431002257
      },
      {
        "deviceId": "b4d396c189e442be",
        "timestamp": 1517430999542
      },
      {
        "deviceId": "c30e5cd8ca76b955",
        "timestamp": 1517430996460
      }
    ]
  }
]
```

### List of Methods

We have not covered all the methods Lexus provides in this tutorial. The current list is:

- avg
- count
- find
- max
- min
- sum
- unique

