# Lexus
[![Build Status](https://jenkins.appcelerator.org/buildStatus/icon?job=pem/lexus/master)](https://jenkins.appcelerator.org/job/pem/job/lexus/job/master/)

*Please note the open source Lexus project is a work in progress. There are some aspect of the current version that are likely to change soon. And other portions of the Lexus project will be open sourced in other repositories.*

Lexus is a small [JSON](http://www.json.org/) language used for querying data storage systems.
It is intended to be portable across systems and therefore does not try to cover the features of any one system comprehensively.
With Lexus you can query for a set of specific documents using filters that match them, or for counts of the documents that match.
You can also ask for basic histograms or group by field values in the documents.
Other aggregations such as sums and averages are also possible.

[This document](https://github.com/appcelerator/lexus-opensource/blob/master/docs/getting-started.md) will present a small set of examples to get you started.

There are various projects that translate other query languages to Lexus, and that translate Lexus to other query languages. For this reason Lexus can be used to bridge the translation between languages that normally have no direct translation.

The Lexus language is named after Dr. Lexus, a fictional character from the 2006 film [Idiocracy](https://en.wikipedia.org/wiki/Idiocracy).

## Project Organization

This repository contains the Lexus spec, docs, test suite and a list of ports that we are aware of and that pass the test suite.

The json-schema specification of the Lexus DSL syntax is located in [schema/](https://github.com/appcelerator/lexus-opensource/tree/master/schema). The documentation describing Lexus is in [docs/](https://github.com/appcelerator/lexus-opensource/tree/master/docs) and the Lexus test suite in [testsuite/](https://github.com/appcelerator/lexus-opensource/tree/master/testsuite).

To visualize the spec, use the small CLI included:

```bash
$ bin/lexus-spec bundle v0.2
```

To validate the syntax of a Lexus query against the spec:
```bash
$ bin/lexus-spec validate v0.2 query.json
```
where `query.json` is an example file containing a Lexus query to check for validation of.

The test suite ensures any ports of Lexus to a new data storage system will yield the same results for the same query on the same data as any other port for another system.

## Lexus Ports

TBD

## Contributing

If you would like to report a bug, feel something can be improved, or have any questions about Lexus please feel free to file a Github issue.

If you have implemented a new Lexus frontend or backend implementation, please try to implement tests that cover all the cases in the Lexus test suite in [testsuite/](https://github.com/appcelerator/lexus-opensource/tree/master/testsuite). The tool described [here](https://github.com/appcelerator/lexus/blob/master/testsuite/README.md) might make things easier to start out. You may then file a PR to add your project's repository to the table above in this README.md file.

## Licence

Lexus is open source software from [Axway](https://www.axway.com/) licensed under the Apache License 2.0.
