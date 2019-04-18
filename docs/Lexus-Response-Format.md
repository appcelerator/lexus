# Lexus Response Format

This document is an overview of the JSON format returned by Lexus. The Lexus Response Format (LRF) is designed to be agnostic to any one Lexus backend.

The following is the same query from Example 5 in [Getting Started With Lexus](./Getting-Started-With-Lexus.md):

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

We will use the following response for that query to explain the general format:

```
[
  {
    "version": "0.2",
    "id": "573b870891339dc2",
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

Each response payload from a query issued to Lexus conforms to this Lexus Response Format (LRF).

There will be a `version` field which contains the version of the Lexus specification it conforms to. This should match the version that was used in the request query.
If the Lexus implementation doesn't support a version that is asked for, an error will be returned.

[
  {
    "version": "0.2",
    "error": "version 0.3 requested but not supported"
  }
]

The LRF also contains an `id` field. The value of this field is a hash of the query that was sent in the request.
This value is provided as a convenience by Lexus and can be used for example as a key in a cache of queries and their responses.

Finally the `result` field will contain the results of the query that was run by Lexus.
The format will depend on the query issued but conforms to a simple structure described here:

|| invoke.method || what is contained in result | example ||
| find | an array of the raw JSON documents | xxx |
| count | a number matching what has been counted | xxx |
| distinct | a JSON object where each distinct value is a key in the object and its value is the number of time that value appears in the results | xxx |
| cardinality | the number of different values the specified field takes on in the results | xxx |
| avg | the average of the values of the field specified in the request | xxx |
| max | the maximum of the values of the field specified in the request | xxx |
| min | the minimum of the values of the field specified in the request | xxx |
| sum | the sum of the values of the field specified in the request | xxx |

However, the `group_by` field in the request modifies the format of result in the following way.
For each item in the `group_by` array, a JSON object is appended to the leaf of the result hierarchy with keys for each of values of the field being grouped, where each key's value conforms to the format in the above table.
This recurses for each item in the `group_by`.

Consider the following example:
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

This query contains a `distinct` method and so conforms to the result format described in the 3rd row of the table above. The result of the query is shown below:

```
[
  {
    "version": "0.2",
    "result": {
      "reactor.audit.start": 873,
      "reactor.audit.end": 768
    },
    "id": "139a20e19bb1f9d3"
  }
]
```

If we take the query and add a `group_by` field with a single field named in the array, in this case `target`, the result of the query is now broken down by each value that the `target` field can take on in the stored documents:

```
[
  {
    "version": "0.2",
    "result": {
      "ios": {
        "reactor.audit.start": 569,
        "reactor.audit.end": 557
      },
      "android": {
        "reactor.audit.start": 304,
        "reactor.audit.end": 211
      }
    },
    "id": "139a20e19bb1f9d3"
  }
]
```
