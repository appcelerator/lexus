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

### Example 3 - Using the Distinct Method

```
{
  "version": "0.2",
  "invoke": {
    "method": "distinct",
    "field": "event"
  },
  "filters": {
    "$range": {
      "timestamp": {
        "gte": 1517430994082,
        "lte": 1517431004082
      }
    }
  }
}
```

We are again using `event` in the `field` field.
But this time `invoke.method` is `distinct`.
This will instruct Lexus to give us the distinct set of values in the `event` field.
Since this can be a rather large set, we will filter the results to only be within a 10-second time range specified in milliseconds where `1517430994082 <= timestamp <= 1517431004082`.
This is done by adding a `$range` filter in the `filters` section.
The `filters` section can contain additional filters.
We will see examples with more below.

The result of this query will look like this:
```
[
  {
    "version": "0.2",
    "result": {
      "reactor.audit.start": 873,
      "reactor.audit.end": 768,
      "process.set.token": 139,
      "geo.recalibrate": 101,
      "boundingbox.lookup": 85,
      "process.unset.token": 80,
      "storage.reshard": 73,
      "user.login": 66,
      "compass.access": 61,
      "audit.run.install": 54
    }
  }
]
```

The list of filters available are:
- $and
- $or
- $not
- $exists
- $geo
- $match
- $prefix
- $range
- $suffix

The `filters` section allows for an arbitrary boolean expression of ANDed, ORed and NOTed terms to be composed telling Lexus which values we are interested for which fields.

### Example 4 - Using group-by

```
{
  "version": "0.2",
  "invoke": {
    "method": "distinct",
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
  "group_by": [
    "target"
  ]
}
```
This example is identical to the above example except that a new section called `group_by` has been added.
The use of `group_by` in Lexus is similar to the SQL `group by` syntax.
The results returned will be broken down into sections for each value that can appear in the field named in the `group_by`.
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

### Example 5 - Multiple group-by items

```
{
  "version": "0.2",
  "invoke": {
    "method": "distinct",
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
  "group_by": [
    "target",
    "software_version"
  ]
}
```

This example is identical to the above example except that the `group_by` array now has `software_version` added.
In Lexus the value specified in the `group_by` field is an array of strings that name the fields in the database we want to perform the grouping on.
The fields appearing earlier in the list are outermost in the grouping.

(The results of this query below have been truncated to save space.)
```
[
  {
    "version": "0.2",
    "result": {
      "ios": {
        "5.4.11.168": {
          "reactor.audit.start": 22,
          "reactor.audit.end": 12,
          "storage.audit": 5,
          "geo.recalibrate": 5,
          "trucks": 2,
          "fencepost": 2,
          "local.query": 1,
          "sensor.check": 1
        },
        "1.0.0": {
          "settings.clear": 12,
          "xhr.check": 10,
          "audit.silo": 7,
          "reactor.audit.start": 4,
          "option.refresh": 1,
          "sensor.notification": 1
        }
      },
      "android": {
        "4.0.5": {
          "filter.apply": 5,
          "reactor.audit.start": 5,
          "database.update": 1,
          "crash.report": 1,
          "reactor.audit.end": 1
        },
        "5.4.11.168": {
          "reactor.audit.start": 4,
          "reactor.audit.end": 3,
          "boundingbox.lookup": 2,
          "total.audit.results": 1,
          "sensor.check": 1,
          "storage.audit": 1,
          "videocard.check": 1
        },
        "4.5.2": {
          "reactor.audit.end": 6,
          "reactor.audit.start": 5,
          "audit.run.install": 1
        },
        "2.19.5": {
          "reactor.audit.start": 8,
          "reactor.audit.end": 3
        },
        "6.2.3": {
          "reactor.audit.start": 6,
          "reactor.audit.end": 3
        }
      },
      "raspberrypi": {
        "2.61": {
          "reactor.audit.start": 1
        }
      },
      "osx": {
        "5.0.14": {
          "reactor.audit.end": 2,
          "reactor.audit.start": 2,
          "android.hardware.start": 1,
          "android.vm.start": 1,
          "iphone.vm.start": 1,
          "universal.vm.start": 1
        },
        "5.0.0.1509508333": {
          "reactor.CE": 1,
          "reactor.core.temp": 1,
          "code.analyze.fail": 1,
          "nav.simulator.outofmem": 1,
          "universal.vm.start": 1
        },
        "3.6.0": {
          "code.analyze.CUE": 1
        },
        "4.8.0.1467089556": {
          "reactor.core.temp": 1
        }
      },
      "win32": {
        "3.6.0": {
          "code.analyze.ruby": 2,
          "reactor.DTE": 1,
          "reactor.ruby": 1,
          "reactor.source": 1,
          "code.analyze.php": 1,
          "reactor.audit.end": 1
        },
        "5.0.0.1509508333": {
          "command.execute": 1,
          "tunnel.secure": 1,
          "upload.secure": 1
        },
        "3.6.2.1413590556": {
          "code.analyze.html": 1
        },
        "5.0.14": {
          "timing.run": 1
        }
      },
      "linux": {
        "3.6.2.1413590556": {
          "tunnel.secure": 2,
          "upload.secure": 2,
          "reactor.failover": 1,
          "code.analyze.php": 1,
          "code.analyze.ruby": 1,
          "code.analyze.xml": 1,
          "tunnel.unsecure": 1,
          "upload.unsecure": 1
        }
      }
    }
  }
]
```

### Example 6 - More Filtering, Limiting Distinct

Here we show an example of the `$match` filter where we ask for the `source` field to match `analytics-api`.
We also have added a `"limit": 3` section under `params` in the `invoke`.
This parameterizes the execution of the `distinct` method to only allow the most popular 3 terms in the distinct to be returned.

```
{
  "version": "0.2",
  "invoke": {
    "method": "distinct",
    "field": "event",
    "params":{
      "limit": 3
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
      "source": "analytics-api"
    }
  },
  "group_by": [
    "target",
    "software_version"
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
        "5.4.11.168": {
          "reactor.audit.start": 22,
          "reactor.audit.end": 12,
          "storage.audit": 5
        },
        "1.0.0": {
          "settings.clear": 12,
          "xhr.check": 10,
          "audit.silo": 7
        }
      },
      "android": {
        "4.0.5": {
          "filter.apply": 5,
          "reactor.audit.start": 5,
          "database.update": 1
        },
        "5.4.11.168": {
          "reactor.audit.start": 4,
          "reactor.audit.end": 3,
          "boundingbox.lookup": 2
        },
        "4.5.2": {
          "reactor.audit.end": 6,
          "reactor.audit.start": 5,
          "audit.run.install": 1
        },
        "2.19.5": {
          "reactor.audit.start": 8,
          "reactor.audit.end": 3
        },
        "6.2.3": {
          "reactor.audit.start": 6,
          "reactor.audit.end": 3
        }
      },
      "raspberrypi": {
        "2.61": {
          "reactor.audit.start": 1
        }
      }
    }
  }
]
```

### Example 7 - Shortcut for OR

Note that as a shorthand for `$or` we can supply an array of strings to a field in `$match` implicitly asking for an `$or` of any of the items in th list.
```
{
  "version": "0.2",
  "invoke": {
    "method": "distinct",
    "field": "event",
    "params":{
      "limit": 3
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
      "event": [
        "android.vm.start",
        "iphone.vm.start",
        "universal.vm.start",
        "windows.vm.start"
      ]
    }
  },
  "group_by": [
    "target",
    "software_version"
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
        "5.0.14": {
          "iphone.vm.start": 1,
          "universal.vm.start": 1
        },
        "5.0.0.1509508333": {
          "universal.vm.start": 1
        }
      }
    }
  }
]
```


### Example 8 - limit, offset, sort, include

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

- find
- count
- distinct
- cardinality
- avg
- max
- min
- sum

