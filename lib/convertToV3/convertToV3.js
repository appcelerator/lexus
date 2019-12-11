function swapFieldName(o, oldname, newname) {
  if (oldname in o) {
    o[newname] = o[oldname];
    delete o[oldname];
  }
}

function convertToV3 (query) {
  // handle an array of queries
  if (Array.isArray(query)) {
    let newArray = [];
    for (let q of query) {
      newArray.push(convertToV3(q));
    }
    return newArray;
  } else {
    query.version = '0.3';

    // invoke -> operation
    swapFieldName(query, 'invoke', 'operation');

    // 'cardinality' -> 'unique'
    if (query.operation.method === 'cardinality') {
      query.operation.method = 'unique';
    }

    // group_by -> groups
    swapFieldName(query, 'group_by', 'groups');

    // the distinct operator now becomes a count with the field being added to the "groups" section
    if (query.operation.method === 'distinct') {
      if (!query.groups) {
        query.groups = [];
      }
      query.groups.push(query.operation.field);
      delete query.operation.field;
      if (query.operation.params) {
        if ('limit' in query.operation.params) {
          delete query.operation.params.limit;
        }
        if ('count' in query.operation.params) {
          delete query.operation.params.count;
        }
        if (Object.keys(query.operation.params).length === 0) {
          delete query.operation.params;
        }
      }
      query.operation.method = 'count';
    }
  }
  return query;
}

module.exports = convertToV3;
