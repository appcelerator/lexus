const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

const ajv = new (require('ajv'))({
  strictTuples: false
});

/*
  Exported functions.
 */

async function bundle(vsn) {
  let parent = path.join(__dirname, '..', 'schema');
  let schema = path.join(parent, vsn, 'schema.yml');
  let define = await fs.readFile(schema, 'utf8');

  return yaml.load(define);
}

async function validate(query) {
  if (!query.version) {
    throw new Error('Unversion specification');
  }

  let schema = await bundle(query.version);

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
