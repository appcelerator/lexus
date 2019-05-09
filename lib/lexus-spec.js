const fs = require('fs').promises;
const path = require('path');

const ajv = new(require('ajv'))();
const rp = new(require('json-schema-ref-parser'))();

/*
  Exported functions.
 */

async function bundle() {
  let spec = await locate();

  return new Promise(function (resolve, reject) {
    rp.bundle(spec, function (err, schema) {
      if (err) {
        return reject(err);
      }
      resolve(schema);
    });
  });
}

async function locate() {
  let parent = path.join(__dirname, '..', 'schema');
  let jSpecs = path.join(parent, 'schema.json');
  let ySpecs = path.join(parent, 'schema.yml');

  try {
    await fs.access(jSpecs);
    return jSpecs;
  } catch (_) {
    // nothing here
  }

  await fs.access(ySpecs);
  return ySpecs;
}

async function validate(query) {
  let schema = await bundle();

  if (!ajv.validate(schema, query)) {
    throw new Error(`${ajv.errors[0].schemaPath} ${ajv.errors[0].message}`);
  }

  return true;
}

/*
  Exported interface.
 */

exports.bundle = bundle;
exports.validate = validate;
