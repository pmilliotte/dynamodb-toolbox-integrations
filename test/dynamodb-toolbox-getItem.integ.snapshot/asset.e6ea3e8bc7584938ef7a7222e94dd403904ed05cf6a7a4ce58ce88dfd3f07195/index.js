"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/node_modules/dynamodb-toolbox/dist/lib/utils.js
var require_utils = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transformAttr = exports.conditionError = exports.keyTypeError = exports.typeError = exports.error = exports.isEmpty = exports.hasValue = exports.toBool = exports.hasProperty = exports.isDynamoDbKeyType = exports.isDynamoDbType = exports.validKeyTypes = exports.validTypes = void 0;
    exports.validTypes = [
      "string",
      "boolean",
      "number",
      "list",
      "map",
      "binary",
      "set"
    ];
    exports.validKeyTypes = ["string", "number", "binary"];
    var isDynamoDbType = (value) => exports.validTypes.includes(value);
    exports.isDynamoDbType = isDynamoDbType;
    var isDynamoDbKeyType = (value) => exports.validKeyTypes.includes(value);
    exports.isDynamoDbKeyType = isDynamoDbKeyType;
    var hasProperty = (obj, prop) => obj.hasOwnProperty(prop);
    exports.hasProperty = hasProperty;
    var toBool = (val) => typeof val === "boolean" ? val : ["false", "0", "no"].includes(String(val).toLowerCase()) ? false : Boolean(val);
    exports.toBool = toBool;
    var hasValue = (val) => val !== void 0 && val !== null;
    exports.hasValue = hasValue;
    var isEmpty = (val) => val === void 0 || typeof val === "object" && Object.keys(val).length === 0;
    exports.isEmpty = isEmpty;
    var error = (err) => {
      throw new Error(err);
    };
    exports.error = error;
    var typeError = (field) => {
      exports.error(`Invalid or missing type for '${field}'. Valid types are '${exports.validTypes.slice(0, -1).join(`', '`)}', and '${exports.validTypes.slice(-1)}'.`);
    };
    exports.typeError = typeError;
    var keyTypeError = (field) => {
      exports.error(`Invalid or missing type for '${field}'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`);
    };
    exports.keyTypeError = keyTypeError;
    var conditionError = (op) => exports.error(`You can only supply one sortKey condition per query. Already using '${op}'`);
    exports.conditionError = conditionError;
    var transformAttr = (mapping, value, data) => {
      value = mapping.transform ? mapping.transform(value, data) : value;
      return mapping.prefix || mapping.suffix ? `${mapping.prefix || ""}${value}${mapping.suffix || ""}` : value;
    };
    exports.transformAttr = transformAttr;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseTableAttributes.js
var require_parseTableAttributes = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseTableAttributes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    exports.default = (attrs, partitionKey, sortKey) => Object.keys(attrs).reduce((acc, field) => {
      const attribute = attrs[field];
      if (typeof attribute === "string") {
        if ([partitionKey, sortKey].includes(field) && !utils_1.isDynamoDbKeyType(attribute)) {
          utils_1.keyTypeError(field);
        }
        if (!utils_1.isDynamoDbType(attribute)) {
          utils_1.typeError(field);
        }
        return Object.assign(acc, parseAttributeConfig(field, { type: attribute }));
      }
      if ([partitionKey, sortKey].includes(field) && !utils_1.isDynamoDbKeyType(attribute.type)) {
        utils_1.keyTypeError(field);
      }
      if (!utils_1.isDynamoDbType(attribute.type)) {
        utils_1.typeError(field);
      }
      return Object.assign(acc, parseAttributeConfig(field, attribute));
    }, {});
    var parseAttributeConfig = (field, config) => {
      Object.keys(config).forEach((prop) => {
        switch (prop) {
          case "type":
            break;
          case "setType":
            if (config.type !== "set")
              utils_1.error(`'setType' is only valid for type 'set'`);
            if (!["string", "number", "binary"].includes(config[prop]))
              utils_1.error(`Invalid 'setType', must be 'string', 'number', or 'binary'`);
            break;
          default:
            utils_1.error(`'${prop}' is not a valid property type`);
        }
      });
      return {
        [field]: Object.assign(Object.assign({}, config), { mappings: {} })
      };
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseTable.js
var require_parseTable = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseTable.js"(exports) {
    "use strict";
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseTable = void 0;
    var parseTableAttributes_1 = __importDefault(require_parseTableAttributes());
    var utils_1 = require_utils();
    var parseTable = (table) => {
      let {
        name,
        alias,
        partitionKey,
        sortKey,
        entityField,
        attributes,
        indexes,
        autoExecute,
        autoParse,
        removeNullAttributes,
        entities,
        DocumentClient: DocumentClient2
      } = table, args = __rest(
        table,
        ["name", "alias", "partitionKey", "sortKey", "entityField", "attributes", "indexes", "autoExecute", "autoParse", "removeNullAttributes", "entities", "DocumentClient"]
      );
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid Table configuration options: ${Object.keys(args).join(", ")}`);
      name = typeof name === "string" && name.trim().length > 0 ? name.trim() : utils_1.error(`'name' must be defined`);
      alias = typeof alias === "string" && alias.trim().length > 0 ? alias.trim() : alias ? utils_1.error(`'alias' must be a string value`) : null;
      partitionKey = typeof partitionKey === "string" && partitionKey.trim().length > 0 ? partitionKey.trim() : utils_1.error(`'partitionKey' must be defined`);
      sortKey = typeof sortKey === "string" && sortKey.trim().length > 0 ? sortKey.trim() : sortKey ? utils_1.error(`'sortKey' must be a string value`) : null;
      entityField = entityField === false ? false : typeof entityField === "string" && entityField.trim().length > 0 ? entityField.trim() : "_et";
      attributes = utils_1.hasValue(attributes) && typeof attributes === "object" && !Array.isArray(attributes) ? attributes : attributes ? utils_1.error(`Please provide a valid 'attributes' object`) : {};
      if (entityField)
        attributes[entityField] = "string";
      indexes = utils_1.hasValue(indexes) && typeof indexes === "object" && !Array.isArray(indexes) ? parseIndexes(indexes, partitionKey) : indexes ? utils_1.error(`Please provide a valid 'indexes' object`) : {};
      return Object.assign(
        {
          name,
          alias,
          Table: {
            partitionKey,
            sortKey,
            entityField,
            attributes: parseTableAttributes_1.default(attributes, partitionKey, sortKey),
            indexes
          },
          autoExecute,
          autoParse,
          removeNullAttributes,
          _entities: []
        },
        DocumentClient2 ? { DocumentClient: DocumentClient2 } : {},
        entities ? { entities } : {}
      );
    };
    exports.parseTable = parseTable;
    var parseIndexes = (indexes, pk) => Object.keys(indexes).reduce((acc, index) => {
      const _a = indexes[index], { partitionKey, sortKey } = _a, args = __rest(_a, ["partitionKey", "sortKey"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid index options: ${Object.keys(args).join(", ")}`);
      if (partitionKey && typeof partitionKey !== "string")
        utils_1.error(`'partitionKey' for ${index} must be a string`);
      if (sortKey && typeof sortKey !== "string")
        utils_1.error(`'sortKey' for ${index} must be a string`);
      if (!sortKey && !partitionKey)
        utils_1.error(`A 'partitionKey', 'sortKey' or both, must be provided for ${index}`);
      const type = !partitionKey || partitionKey === pk ? "LSI" : "GSI";
      return Object.assign(acc, {
        [index]: Object.assign({}, partitionKey && type === "GSI" ? { partitionKey } : {}, sortKey ? { sortKey } : {}, { type })
      });
    }, {});
    exports.default = exports.parseTable;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/checkAttribute.js
var require_checkAttribute = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/checkAttribute.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    exports.default = (attr, attrs) => {
      const path = attr.split(".");
      const list = path[0].split("[");
      if (list[0] in attrs) {
        path[0] = (attrs[list[0]].map ? attrs[list[0]].map : list[0]) + (list.length > 1 ? `[${list.slice(1).join("[")}` : "");
        return path.join(".");
      } else {
        return utils_1.error(`'${attr}' is not a valid attribute.`);
      }
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/expressionBuilder.js
var require_expressionBuilder = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/expressionBuilder.js"(exports) {
    "use strict";
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var checkAttribute_1 = __importDefault(require_checkAttribute());
    var utils_1 = require_utils();
    var buildExpression = (exp, table, entity, group = 0, level = 0) => {
      const clauses = Array.isArray(exp) ? exp : [exp];
      let expression = "";
      let names = {};
      let values = {};
      let logic;
      clauses.forEach((_, id) => {
        if (Array.isArray(clauses[id])) {
          let sub = buildExpression(clauses[id], table, entity, group, level);
          logic = logic ? logic : sub.logic;
          expression += `${id > 0 ? ` ${sub.logic} ` : ""}(${sub.expression})`;
          names = Object.assign(names, sub.names);
          values = Object.assign(values, sub.values);
          group = sub.group;
        } else {
          const exp2 = Object.assign({}, clauses[id]);
          group++;
          if (entity && !exp2.entity)
            exp2.entity = entity;
          const clause = parseClause(exp2, group, table);
          expression += `${id > 0 ? ` ${clause.logic} ` : ""}${clause.clause}`;
          names = Object.assign(names, clause.names);
          values = Object.assign(values, clause.values);
          logic = logic ? logic : clause.logic;
        }
      });
      return {
        logic,
        expression,
        names,
        values,
        group
      };
    };
    exports.default = buildExpression;
    var conditionError = (op) => utils_1.error(`You can only supply one filter condition per query. Already using '${op}'`);
    var parseClause = (_clause, grp, table) => {
      if (!table) {
        throw new Error(`'table' should be defined`);
      }
      let clause = "";
      const names = {};
      const values = {};
      const {
        attr,
        size,
        negate,
        or,
        eq,
        ne,
        in: _in,
        lt,
        lte,
        gt,
        gte,
        between,
        exists,
        contains,
        beginsWith,
        type,
        entity
      } = _clause, args = __rest(
        _clause,
        ["attr", "size", "negate", "or", "eq", "ne", "in", "lt", "lte", "gt", "gte", "between", "exists", "contains", "beginsWith", "type", "entity"]
      );
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid expression options: ${Object.keys(args).join(", ")}`);
      if (entity !== void 0 && (typeof entity !== "string" || !table[entity] || !table[entity].schema || !table[entity].schema.attributes))
        utils_1.error(`'entity' value of '${entity}' must be a string and a valid table Entity name`);
      names[`#attr${grp}`] = typeof attr === "string" ? checkAttribute_1.default(attr, entity ? table[entity].schema.attributes : table.Table.attributes) : typeof size === "string" ? checkAttribute_1.default(size, entity ? table[entity].schema.attributes : table.Table.attributes) : utils_1.error(`A string for 'attr' or 'size' is required for condition expressions`);
      let operator, value, f;
      if (eq !== void 0) {
        value = eq;
        f = "eq";
        operator = "=";
      }
      if (ne !== void 0) {
        value = value ? conditionError(f) : ne;
        f = "ne";
        operator = "<>";
      }
      if (_in) {
        value = value ? conditionError(f) : _in;
        f = "in";
        operator = "IN";
      }
      if (lt !== void 0) {
        value = value ? conditionError(f) : lt;
        f = "lt";
        operator = "<";
      }
      if (lte !== void 0) {
        value = value ? conditionError(f) : lte;
        f = "lte";
        operator = "<=";
      }
      if (gt !== void 0) {
        value = value ? conditionError(f) : gt;
        f = "gt";
        operator = ">";
      }
      if (gte !== void 0) {
        value = value ? conditionError(f) : gte;
        f = "gte";
        operator = ">=";
      }
      if (between) {
        value = value ? conditionError(f) : between;
        f = "between";
        operator = "BETWEEN";
      }
      if (exists !== void 0) {
        value = value ? conditionError(f) : exists;
        f = "exists";
        operator = "EXISTS";
      }
      if (contains) {
        value = value ? conditionError(f) : contains;
        f = "contains";
        operator = "CONTAINS";
      }
      if (beginsWith) {
        value = value ? conditionError(f) : beginsWith;
        f = "beginsWith";
        operator = "BEGINS_WITH";
      }
      if (type) {
        value = value ? conditionError(f) : type;
        f = "type";
        operator = "ATTRIBUTE_TYPE";
      }
      if (operator) {
        if (operator === "BETWEEN") {
          if (Array.isArray(value) && value.length === 2) {
            values[`:attr${grp}_0`] = value[0];
            values[`:attr${grp}_1`] = value[1];
            clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} between :attr${grp}_0 and :attr${grp}_1`;
          } else {
            utils_1.error(`'between' conditions require an array with two values.`);
          }
        } else if (operator === "IN") {
          if (!attr)
            utils_1.error(`'in' conditions require an 'attr'.`);
          if (Array.isArray(value)) {
            clause = `#attr${grp} IN (${value.map((x, i) => {
              values[`:attr${grp}_${i}`] = x;
              return `:attr${grp}_${i}`;
            }).join(",")})`;
          } else {
            utils_1.error(`'in' conditions require an array.`);
          }
        } else if (operator === "EXISTS") {
          if (!attr)
            utils_1.error(`'exists' conditions require an 'attr'.`);
          clause = value ? `attribute_exists(#attr${grp})` : `attribute_not_exists(#attr${grp})`;
        } else {
          values[`:attr${grp}`] = value;
          if (operator === "BEGINS_WITH") {
            if (!attr)
              utils_1.error(`'beginsWith' conditions require an 'attr'.`);
            clause = `begins_with(#attr${grp},:attr${grp})`;
          } else if (operator === "CONTAINS") {
            if (!attr)
              utils_1.error(`'contains' conditions require an 'attr'.`);
            clause = `contains(#attr${grp},:attr${grp})`;
          } else if (operator === "ATTRIBUTE_TYPE") {
            if (!attr)
              utils_1.error(`'type' conditions require an 'attr'.`);
            clause = `attribute_type(#attr${grp},:attr${grp})`;
          } else {
            clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} ${operator} :attr${grp}`;
          }
        }
        if (negate) {
          clause = `(NOT ${clause})`;
        }
      } else {
        utils_1.error("A condition is required");
      }
      return {
        logic: or ? "OR" : "AND",
        clause,
        names,
        values
      };
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/validateTypes.js
var require_validateTypes = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/validateTypes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    exports.default = (DocumentClient2) => (mapping, field, value) => {
      if (!utils_1.hasValue(value))
        return value;
      switch (mapping.type) {
        case "string":
          return typeof value === "string" || mapping.coerce ? String(value) : utils_1.error(`'${field}' must be of type string`);
        case "boolean":
          return typeof value === "boolean" || mapping.coerce ? utils_1.toBool(value) : utils_1.error(`'${field}' must be of type boolean`);
        case "number":
          return typeof value === "number" || mapping.coerce ? String(parseInt(value)) === String(value) ? parseInt(value) : String(parseFloat(value)) === String(value) ? parseFloat(value) : utils_1.error(`Could not convert '${value}' to a number for '${field}'`) : utils_1.error(`'${field}' must be of type number`);
        case "list":
          return Array.isArray(value) ? value : mapping.coerce ? String(value).split(",").map((x) => x.trim()) : utils_1.error(`'${field}' must be a list (array)`);
        case "map":
          return typeof value === "object" && !Array.isArray(value) ? value : utils_1.error(`'${field}' must be a map (object)`);
        case "set":
          if (Array.isArray(value)) {
            if (!DocumentClient2)
              utils_1.error("DocumentClient required for this operation");
            let set = DocumentClient2.createSet(value, { validate: true });
            return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set : utils_1.error(`'${field}' must be a valid set (array) containing only ${mapping.setType} types`);
          } else if (mapping.coerce) {
            if (!DocumentClient2)
              utils_1.error("DocumentClient required for this operation");
            let set = DocumentClient2.createSet(String(value).split(",").map((x) => x.trim()));
            return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set : utils_1.error(`'${field}' must be a valid set (array) of type ${mapping.setType}`);
          } else {
            return utils_1.error(`'${field}' must be a valid set (array)`);
          }
        default:
          return value;
      }
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseMapping.js
var require_parseMapping = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseMapping.js"(exports) {
    "use strict";
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    exports.default = (field, config, track) => {
      Object.keys(config).forEach((prop) => {
        switch (prop) {
          case "type":
          case "default":
            break;
          case "dependsOn":
            if (typeof config[prop] !== "string" && !Array.isArray(config[prop]))
              utils_1.error(`'dependsOn' must be the string name of an attribute or alias`);
            break;
          case "transform":
            if (typeof config[prop] !== "function")
              utils_1.error(`'${prop}' must be a function`);
            break;
          case "coerce":
          case "onUpdate":
          case "hidden":
          case "save":
            if (typeof config[prop] !== "boolean")
              utils_1.error(`'${prop}' must be a boolean`);
            break;
          case "required":
            if (typeof config[prop] !== "boolean" && config[prop] !== "always")
              utils_1.error(`'required' must be a boolean or set to 'always'`);
            break;
          case "alias":
          case "map":
            if (typeof config[prop] !== "string" || track.fields.includes((config[prop] || "").trim()) || (config[prop] || "").trim().length === 0)
              utils_1.error(`'${prop}' must be a unique string`);
            break;
          case "setType":
            if (config.type !== "set")
              utils_1.error(`'setType' is only valid for type 'set'`);
            if (!["string", "number", "binary"].includes(config[prop] || ""))
              utils_1.error(`Invalid 'setType', must be 'string', 'number', or 'binary'`);
            break;
          case "delimiter":
            if (typeof config[prop] !== "string" || (config[prop] || "").trim().length === 0)
              utils_1.error(`'delimiter' must be a 'string'`);
            config[prop] = (config[prop] || "").trim();
            break;
          case "prefix":
          case "suffix":
            if (config.type && config.type !== "string")
              utils_1.error(`'${prop}' can only be used on 'string' types`);
            if (typeof config[prop] !== "string" || (config[prop] || "").trim().length === 0)
              utils_1.error(`'${prop}' must be a 'string'`);
            break;
          case "partitionKey":
          case "sortKey":
            if (config.map || config.alias)
              utils_1.error(`Attributes with a ${prop} cannot have a 'map' or 'alias' associated`);
            if (typeof config[prop] === "boolean" || typeof config[prop] === "string" || Array.isArray(config[prop])) {
              const indexes = Array.isArray(config[prop]) ? config[prop] : [config[prop]];
              for (let i in indexes) {
                if (typeof indexes[i] === "boolean") {
                  if (track.keys[prop])
                    utils_1.error(`'${track.keys[prop]}' has already been declared as the ${prop}`);
                  if (indexes[i])
                    track.keys[prop] = field;
                  if (track.keys.partitionKey && track.keys.partitionKey === track.keys.sortKey)
                    utils_1.error(`'${field}' attribute cannot be both the partitionKey and sortKey`);
                } else if (typeof indexes[i] === "string") {
                  const index = indexes[i];
                  if (!track.keys[index])
                    track.keys[index] = {};
                  if (track.keys[index][prop]) {
                    utils_1.error(`'${track.keys[index][prop]}' has already been declared as the ${prop} for the ${index} index`);
                  }
                  track.keys[index][prop] = field;
                  if (track.keys[index].partitionKey === track.keys[index].sortKey)
                    utils_1.error(`'${field}' attribute cannot be both the partitionKey and sortKey for the ${index} index`);
                } else {
                  utils_1.error(`Index assignments for '${field}' must be string or boolean values`);
                }
              }
            } else {
              utils_1.error(`'${prop}' must be a boolean, string, or array`);
            }
            break;
          default:
            utils_1.error(`'${prop}' is not a valid property type`);
        }
      });
      if (config.alias && config.map)
        utils_1.error(`'${field}' cannot contain both an alias and a map`);
      if (!config.type)
        config.type = "string";
      if (["string", "boolean", "number"].includes(config.type) && typeof config.coerce === "undefined")
        config.coerce = true;
      if (config.default !== void 0)
        track.defaults[field] = config.default;
      if (config.required === true)
        track.required[config.map || field] = false;
      if (config.required === "always")
        track.required[config.map || field] = true;
      const { map, alias } = config, _config = __rest(
        config,
        ["map", "alias"]
      );
      return Object.assign({
        [field]: config
      }, alias ? {
        [alias]: Object.assign({}, _config, { map: field })
      } : {}, map ? {
        [map]: Object.assign({}, _config, { alias: field })
      } : {});
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseCompositeKey.js
var require_parseCompositeKey = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseCompositeKey.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    var parseMapping_1 = __importDefault(require_parseMapping());
    var parseCompositeKey = (field, config, track, schema) => {
      if (config.length >= 2 && config.length <= 3) {
        let link = schema[config[0]] ? config[0] : utils_1.error(`'${field}' must reference another field`);
        let pos = parseInt(config[1].toString()) === config[1] ? config[1] : utils_1.error(`'${field}' position value must be numeric`);
        let sub_config = !config[2] ? { type: "string" } : ["string", "number", "boolean"].includes(config[2].toString()) ? { type: config[2] } : typeof config[2] === "object" && !Array.isArray(config[2]) ? config[2] : utils_1.error(`'${field}' type must be 'string', 'number', 'boolean' or a configuration object`);
        if (!track.linked[link])
          track.linked[link] = [];
        track.linked[link][pos] = field;
        return Object.assign({
          [field]: Object.assign(
            { save: true },
            parseMapping_1.default(field, sub_config, track)[field],
            { link, pos }
          )
        }, sub_config.alias ? {
          [sub_config.alias]: Object.assign({}, sub_config, { map: field })
        } : {});
      } else {
        utils_1.error(`Composite key configurations must have 2 or 3 items`);
      }
    };
    exports.default = parseCompositeKey;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseEntityAttributes.js
var require_parseEntityAttributes = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseEntityAttributes.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var parseMapping_1 = __importDefault(require_parseMapping());
    var parseCompositeKey_1 = __importDefault(require_parseCompositeKey());
    var utils_1 = require_utils();
    var parseEntityAttributes = (attributes, track) => {
      const parsedAttributes = Object.keys(attributes).reduce((acc, field) => {
        const attributeDefinition = attributes[field];
        if (typeof attributeDefinition === "string") {
          if (utils_1.isDynamoDbType(attributeDefinition)) {
            return Object.assign(acc, parseMapping_1.default(field, { type: attributeDefinition }, track));
          } else {
            utils_1.typeError(field);
          }
        }
        if (Array.isArray(attributeDefinition)) {
          return Object.assign(acc, parseCompositeKey_1.default(
            field,
            attributes[field],
            track,
            attributes
          ));
        }
        const fieldVal = attributes[field];
        fieldVal.type = fieldVal.type || "string";
        if (!utils_1.validTypes.includes(fieldVal.type)) {
          utils_1.typeError(field);
        }
        return Object.assign(acc, parseMapping_1.default(field, fieldVal, track));
      }, {});
      if (!track.keys.partitionKey)
        utils_1.error("Entity requires a partitionKey attribute");
      return {
        keys: track.keys,
        attributes: parsedAttributes
      };
    };
    exports.default = parseEntityAttributes;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/parseEntity.js
var require_parseEntity = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/parseEntity.js"(exports) {
    "use strict";
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEntity = void 0;
    var parseEntityAttributes_1 = __importDefault(require_parseEntityAttributes());
    var utils_1 = require_utils();
    function parseEntity(entity) {
      let { name, timestamps, created, createdAlias, modified, modifiedAlias, typeAlias, attributes, autoExecute, autoParse, table } = entity, args = __rest(
        entity,
        ["name", "timestamps", "created", "createdAlias", "modified", "modifiedAlias", "typeAlias", "attributes", "autoExecute", "autoParse", "table"]
      );
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid Entity configuration options: ${Object.keys(args).join(", ")}`);
      name = typeof name === "string" && name.trim().length > 0 ? name.trim() : utils_1.error(`'name' must be defined`);
      timestamps = typeof timestamps === "boolean" ? timestamps : true;
      created = typeof created === "string" && created.trim().length > 0 ? created.trim() : "_ct";
      createdAlias = typeof createdAlias === "string" && createdAlias.trim().length > 0 ? createdAlias.trim() : "created";
      modified = typeof modified === "string" && modified.trim().length > 0 ? modified.trim() : "_md";
      modifiedAlias = typeof modifiedAlias === "string" && modifiedAlias.trim().length > 0 ? modifiedAlias.trim() : "modified";
      typeAlias = typeof typeAlias === "string" && typeAlias.trim().length > 0 ? typeAlias.trim() : "entity";
      attributes = typeof attributes === "object" && !Array.isArray(attributes) ? attributes : utils_1.error(`Please provide a valid 'attributes' object`);
      if (timestamps) {
        ;
        attributes[created] = {
          type: "string",
          alias: createdAlias,
          default: () => new Date().toISOString()
        };
        attributes[modified] = {
          type: "string",
          alias: modifiedAlias,
          default: () => new Date().toISOString(),
          onUpdate: true
        };
      }
      let track = {
        fields: Object.keys(attributes),
        defaults: {},
        required: {},
        linked: {},
        keys: {}
      };
      return Object.assign({
        name,
        schema: parseEntityAttributes_1.default(attributes, track),
        defaults: track.defaults,
        required: track.required,
        linked: track.linked,
        autoExecute,
        autoParse,
        _etAlias: typeAlias
      }, table ? { table } : {});
    }
    exports.parseEntity = parseEntity;
    exports.default = parseEntity;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/normalizeData.js
var require_normalizeData = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/normalizeData.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var validateTypes_1 = __importDefault(require_validateTypes());
    var utils_1 = require_utils();
    exports.default = (DocumentClient2) => (schema, linked, data, filter = false) => {
      const validateType = validateTypes_1.default(DocumentClient2);
      const dependsOn = (map, attr) => {
        if (schema[attr].dependsOn) {
          ;
          (Array.isArray(schema[attr].dependsOn) ? schema[attr].dependsOn : [schema[attr].dependsOn]).forEach((dependent) => {
            if (schema[dependent]) {
              if (typeof map[dependent] === "function") {
                map = dependsOn(map, dependent);
              }
            } else {
              utils_1.error(`'${dependent}' is not a valid attribute or alias name`);
            }
          });
          map[attr] = map[attr](map);
          return map;
        } else {
          try {
            map[attr] = map[attr](map);
            if (schema[attr].alias)
              map[schema[attr].alias] = map[attr];
            if (schema[attr].map)
              map[schema[attr].map] = map[attr];
          } catch (e) {
          }
          return map;
        }
      };
      let dataMap = Object.keys(data).reduce((acc, field) => {
        return Object.assign(acc, schema[field] ? {
          data: Object.assign(Object.assign({}, acc.data), { [schema[field].map || field]: data[field] }),
          aliases: Object.assign(Object.assign({}, acc.aliases), { [schema[field].alias || field]: data[field] })
        } : filter ? {} : field === "$remove" ? { data: Object.assign(Object.assign({}, acc.data), { $remove: data[field] }) } : utils_1.error(`Field '${field}' does not have a mapping or alias`));
      }, { data: {}, aliases: {} });
      let defaultMap = Object.assign(Object.assign({}, dataMap.data), dataMap.aliases);
      const defaults = Object.keys(defaultMap).reduce((acc, attr) => {
        if (typeof defaultMap[attr] === "function") {
          let map = dependsOn(defaultMap, attr);
          defaultMap = map;
        }
        return Object.assign(acc, { [attr]: defaultMap[attr] });
      }, {});
      let _data = Object.keys(dataMap.data).reduce((acc, field) => {
        return Object.assign(acc, {
          [field]: defaults[field]
        });
      }, {});
      let composites = Object.keys(linked).reduce((acc, attr) => {
        const field = schema[attr] && schema[attr].map || attr;
        if (_data[field] !== void 0)
          return acc;
        let values = linked[attr].map((f) => {
          if (_data[f] === void 0) {
            return null;
          }
          return utils_1.transformAttr(schema[f], validateType(schema[f], f, _data[f]), _data);
        }).filter((x) => x !== null);
        if (values.length === linked[attr].length) {
          return Object.assign(acc, {
            [field]: values.join(schema[attr].delimiter || "#")
          });
        } else {
          return acc;
        }
      }, {});
      return Object.assign(composites, _data);
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/formatItem.js
var require_formatItem = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/formatItem.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var validateTypes_1 = __importDefault(require_validateTypes());
    exports.default = (DocumentClient2) => (attributes, linked, item, include = []) => {
      const validateType = validateTypes_1.default(DocumentClient2);
      return Object.keys(item).reduce((acc, field) => {
        const link = linked[field] || attributes[field] && attributes[field].alias && linked[attributes[field].alias];
        if (link) {
          Object.assign(acc, link.reduce((acc2, f, i) => {
            if (attributes[f].save || attributes[f].hidden || include.length > 0 && !include.includes(f))
              return acc2;
            return Object.assign(acc2, {
              [attributes[f].alias || f]: validateType(attributes[f], f, item[field].replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`), "").replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`), "").split(attributes[field].delimiter || "#")[i])
            });
          }, {}));
        }
        if (attributes[field] && attributes[field].hidden || include.length > 0 && !include.includes(field))
          return acc;
        if (attributes[field] && attributes[field].type === "set" && Array.isArray(item[field].values)) {
          item[field] = item[field].values;
        }
        return Object.assign(acc, {
          [attributes[field] && attributes[field].alias || field]: attributes[field] && (attributes[field].prefix || attributes[field].suffix) ? item[field].replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`), "").replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`), "") : item[field]
        });
      }, {});
    };
    function escapeRegExp(text) {
      return text ? text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") : "";
    }
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/getKey.js
var require_getKey = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/getKey.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var validateTypes_1 = __importDefault(require_validateTypes());
    var utils_1 = require_utils();
    exports.default = (DocumentClient2) => (data, schema, partitionKey, sortKey) => {
      partitionKey = schema[partitionKey].map || partitionKey;
      sortKey = schema[sortKey] && schema[sortKey].map || sortKey || null;
      let validateType = validateTypes_1.default(DocumentClient2);
      let pk = data[partitionKey];
      if (pk === void 0 || pk === null || pk === "") {
        utils_1.error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ""} is required`);
      }
      const sk = data[sortKey];
      if (sortKey && (sk === void 0 || sk === null || sk === "")) {
        utils_1.error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ""} is required`);
      }
      return Object.assign({
        [partitionKey]: utils_1.transformAttr(schema[partitionKey], validateType(schema[partitionKey], partitionKey, pk), data)
      }, sortKey !== null ? {
        [sortKey]: utils_1.transformAttr(schema[sortKey], validateType(schema[sortKey], sortKey, sk), data)
      } : {});
    };
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/lib/projectionBuilder.js
var require_projectionBuilder = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/lib/projectionBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    var checkAttribute_1 = __importDefault(require_checkAttribute());
    var projectionBuilder = (attributes, table, entity, type = false) => {
      let index = 0;
      const attrs = Array.isArray(attributes) ? attributes : typeof attributes === "string" ? attributes.split(",").map((x) => x.trim()) : [attributes];
      if (!table || !table.Table || Object.keys(table.Table.attributes).length == 0) {
        throw new Error("Tables must be valid and contain attributes");
      }
      if (type && table.Table.entityField)
        attrs.push(table.Table.entityField);
      let names = {};
      let tableAttrs = [];
      let entities = {};
      for (const attribute of attrs) {
        if (typeof attribute === "string") {
          const attr = checkAttribute_1.default(attribute, entity ? table[entity].schema.attributes : table.Table.attributes);
          if (!Object.values(names).includes(attr)) {
            names[`#proj${++index}`] = attr;
            tableAttrs.push(attribute);
          }
        } else if (typeof attribute === "object") {
          for (const entity2 in attribute) {
            if (table[entity2]) {
              if (!entities[entity2])
                entities[entity2] = [];
              const ent_attrs = Array.isArray(attribute[entity2]) ? attribute[entity2] : typeof attribute[entity2] === "string" ? String(attribute[entity2]).split(",").map((x) => x.trim()) : utils_1.error(`Only arrays or strings are supported`);
              for (const ent_attribute of ent_attrs) {
                if (typeof ent_attribute != "string")
                  utils_1.error(`Entity projections must be string values`);
                const attr = checkAttribute_1.default(ent_attribute, table[entity2].schema.attributes);
                if (!Object.values(names).includes(attr)) {
                  names[`#proj${++index}`] = attr;
                }
                entities[entity2].push(attr);
              }
            } else {
              utils_1.error(`'${entity2}' is not a valid entity on this table`);
            }
          }
        } else {
          utils_1.error(`'${typeof attribute}' is an invalid type. Projections require strings or arrays`);
        }
      }
      return {
        names,
        projections: Object.keys(names).join(","),
        entities: Object.keys(entities).reduce((acc, ent) => {
          return Object.assign(acc, { [ent]: [.../* @__PURE__ */ new Set([...entities[ent], ...tableAttrs])] });
        }, {}),
        tableAttrs
      };
    };
    exports.default = projectionBuilder;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/Entity.js
var require_Entity = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/Entity.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldParse = exports.shouldExecute = void 0;
    var parseEntity_1 = __importDefault(require_parseEntity());
    var validateTypes_1 = __importDefault(require_validateTypes());
    var normalizeData_1 = __importDefault(require_normalizeData());
    var formatItem_1 = __importDefault(require_formatItem());
    var getKey_1 = __importDefault(require_getKey());
    var expressionBuilder_1 = __importDefault(require_expressionBuilder());
    var projectionBuilder_1 = __importDefault(require_projectionBuilder());
    var utils_1 = require_utils();
    var Entity2 = class {
      constructor(entity) {
        if (typeof entity !== "object" || Array.isArray(entity)) {
          utils_1.error("Please provide a valid entity definition");
        }
        const { attributes, timestamps = true, createdAlias = "created", modifiedAlias = "modified", typeAlias = "entity" } = entity;
        this.attributes = attributes;
        this.timestamps = timestamps;
        this.createdAlias = createdAlias;
        this.modifiedAlias = modifiedAlias;
        this.typeAlias = typeAlias;
        Object.assign(this, parseEntity_1.default(entity));
      }
      set table(table) {
        var _a;
        if ((_a = table === null || table === void 0 ? void 0 : table.Table) === null || _a === void 0 ? void 0 : _a.attributes) {
          if (this._table) {
            utils_1.error(`This entity is already assigned a Table (${this._table.name})`);
          } else if (!table.entities.includes(this.name)) {
            table.addEntity(this);
          }
          this._table = table;
          if (table.Table.entityField) {
            this.schema.attributes[table.Table.entityField] = {
              type: "string",
              alias: this._etAlias,
              default: this.name
            };
            this.defaults[table.Table.entityField] = this.name;
            this.schema.attributes[this._etAlias] = {
              type: "string",
              map: table.Table.entityField,
              default: this.name
            };
            this.defaults[this._etAlias] = this.name;
          }
        } else {
          utils_1.error("Invalid Table");
        }
      }
      get table() {
        if (this._table) {
          return this._table;
        } else {
          return utils_1.error(`The '${this.name}' entity must be attached to a Table to perform this operation`);
        }
      }
      get DocumentClient() {
        var _a;
        if ((_a = this.table) === null || _a === void 0 ? void 0 : _a.DocumentClient) {
          return this.table.DocumentClient;
        } else {
          return utils_1.error("DocumentClient required for this operation");
        }
      }
      set autoExecute(val) {
        this._execute = typeof val === "boolean" ? val : void 0;
      }
      get autoExecute() {
        var _a;
        return typeof this._execute === "boolean" ? this._execute : typeof ((_a = this.table) === null || _a === void 0 ? void 0 : _a.autoExecute) === "boolean" ? this.table.autoExecute : true;
      }
      set autoParse(val) {
        this._parse = typeof val === "boolean" ? val : void 0;
      }
      get autoParse() {
        var _a;
        return typeof this._parse === "boolean" ? this._parse : typeof ((_a = this.table) === null || _a === void 0 ? void 0 : _a.autoParse) === "boolean" ? this.table.autoParse : true;
      }
      get partitionKey() {
        return this.schema.keys.partitionKey ? this.attribute(this.schema.keys.partitionKey) : utils_1.error(`No partitionKey defined`);
      }
      get sortKey() {
        return this.schema.keys.sortKey ? this.attribute(this.schema.keys.sortKey) : null;
      }
      attribute(attr) {
        return this.schema.attributes[attr] && this.schema.attributes[attr].map ? this.schema.attributes[attr].map : this.schema.attributes[attr] ? attr : utils_1.error(`'${attr}' does not exist or is an invalid alias`);
      }
      parse(input, include = []) {
        include = include.map((attr) => {
          const _attr = attr.split(".")[0].split("[")[0];
          return this.schema.attributes[_attr] && this.schema.attributes[_attr].map || _attr;
        });
        const { schema, linked } = this;
        const data = input.Item || input.Items || input;
        if (Array.isArray(data)) {
          return data.map((item) => formatItem_1.default(this.DocumentClient)(schema.attributes, linked, item, include));
        } else {
          return formatItem_1.default(this.DocumentClient)(schema.attributes, linked, data, include);
        }
      }
      get(item, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const getParams = this.getParams(item, options, params);
          if (!exports.shouldExecute(options.execute, this.autoExecute)) {
            return getParams;
          }
          const output = yield this.DocumentClient.get(getParams).promise();
          if (!exports.shouldParse(options.parse, this.autoParse)) {
            return output;
          }
          const { Item } = output, restOutput = __rest(output, ["Item"]);
          if (!Item) {
            return restOutput;
          }
          const parsedItem = this.parse(Item, options.include);
          return Object.assign({ Item: parsedItem }, restOutput);
        });
      }
      getBatch(item) {
        return {
          Table: this.table,
          Key: this.getParams(item).Key
        };
      }
      getTransaction(item, options = {}) {
        const { attributes } = options, args = __rest(
          options,
          ["attributes"]
        );
        if (Object.keys(args).length > 0) {
          utils_1.error(`Invalid get transaction options: ${Object.keys(args).join(", ")}`);
        }
        let payload = this.getParams(item, options);
        return {
          Entity: this,
          Get: payload
        };
      }
      getParams(item, options = {}, params = {}) {
        const { schema, defaults, linked, _table } = this;
        const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item), true);
        const {
          consistent,
          capacity,
          attributes
        } = options, _args = __rest(
          options,
          ["consistent", "capacity", "attributes"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid get options: ${args.join(", ")}`);
        if (consistent !== void 0 && typeof consistent !== "boolean") {
          utils_1.error(`'consistent' requires a boolean`);
        }
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))) {
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        let ExpressionAttributeNames;
        let ProjectionExpression;
        if (attributes) {
          const { names, projections } = projectionBuilder_1.default(attributes, this.table, this.name);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = names;
            ProjectionExpression = projections;
          }
        }
        const payload = Object.assign({
          TableName: _table.name,
          Key: getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey)
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, ProjectionExpression ? { ProjectionExpression } : null, consistent ? { ConsistentRead: consistent } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, typeof params === "object" ? params : {});
        return payload;
      }
      delete(item, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const deleteParams = this.deleteParams(item, options, params);
          if (!exports.shouldExecute(options.execute, this.autoExecute)) {
            return deleteParams;
          }
          const output = yield this.DocumentClient.delete(deleteParams).promise();
          if (!exports.shouldParse(options.parse, this.autoParse)) {
            return output;
          }
          const { Attributes } = output, restOutput = __rest(output, ["Attributes"]);
          if (!Attributes) {
            return restOutput;
          }
          const parsedAttributes = this.parse(Attributes, options.include);
          return Object.assign({ Attributes: parsedAttributes }, restOutput);
        });
      }
      deleteBatch(item) {
        const payload = this.deleteParams(item);
        return { [payload.TableName]: { DeleteRequest: { Key: payload.Key } } };
      }
      deleteTransaction(item, options = {}) {
        const {
          conditions,
          returnValues
        } = options, args = __rest(
          options,
          ["conditions", "returnValues"]
        );
        if (Object.keys(args).length > 0) {
          utils_1.error(`Invalid delete transaction options: ${Object.keys(args).join(", ")}`);
        }
        let payload = this.deleteParams(item, options);
        if ("ReturnValues" in payload) {
          let { ReturnValues } = payload, _payload = __rest(payload, ["ReturnValues"]);
          payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        return { Delete: payload };
      }
      deleteParams(item, options = {}, params = {}) {
        const { schema, defaults, linked, _table } = this;
        const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item), true);
        const {
          conditions,
          capacity,
          metrics,
          returnValues
        } = options, _args = __rest(
          options,
          ["conditions", "capacity", "metrics", "returnValues"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid delete options: ${args.join(", ")}`);
        if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase()))) {
          utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))) {
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD"].includes(returnValues.toUpperCase()))) {
          utils_1.error(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`);
        }
        let ExpressionAttributeNames;
        let ExpressionAttributeValues;
        let ConditionExpression;
        if (conditions) {
          const { expression, names, values } = expressionBuilder_1.default(conditions, this.table, this.name);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = names;
            ExpressionAttributeValues = values;
            ConditionExpression = expression;
          }
        }
        const payload = Object.assign({
          TableName: _table.name,
          Key: getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey)
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, !utils_1.isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : null, ConditionExpression ? { ConditionExpression } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null, typeof params === "object" ? params : {});
        return payload;
      }
      update(item, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const updateParams = this.updateParams(item, options, params);
          if (!exports.shouldExecute(options.execute, this.autoExecute)) {
            return updateParams;
          }
          const output = yield this.DocumentClient.update(updateParams).promise();
          if (!exports.shouldParse(options.parse, this.autoParse)) {
            return output;
          }
          const { Attributes } = output, restOutput = __rest(output, ["Attributes"]);
          if (!Attributes) {
            return restOutput;
          }
          const parsedAttributes = this.parse(Attributes, options.include);
          return Object.assign({ Attributes: parsedAttributes }, restOutput);
        });
      }
      updateTransaction(item, options = {}) {
        const {
          conditions,
          returnValues
        } = options, args = __rest(
          options,
          ["conditions", "returnValues"]
        );
        if (Object.keys(args).length > 0) {
          utils_1.error(`Invalid update transaction options: ${Object.keys(args).join(", ")}`);
        }
        let payload = this.updateParams(item, options);
        if ("ReturnValues" in payload) {
          let { ReturnValues } = payload, _payload = __rest(payload, ["ReturnValues"]);
          payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        return { Update: payload };
      }
      updateParams(item, options = {}, _a = {}) {
        var { SET = [], REMOVE = [], ADD = [], DELETE = [], ExpressionAttributeNames = {}, ExpressionAttributeValues = {} } = _a, params = __rest(_a, ["SET", "REMOVE", "ADD", "DELETE", "ExpressionAttributeNames", "ExpressionAttributeValues"]);
        if (!Array.isArray(SET))
          utils_1.error("SET must be an array");
        if (!Array.isArray(REMOVE))
          utils_1.error("REMOVE must be an array");
        if (!Array.isArray(ADD))
          utils_1.error("ADD must be an array");
        if (!Array.isArray(DELETE))
          utils_1.error("DELETE must be an array");
        if (typeof ExpressionAttributeNames !== "object" || Array.isArray(ExpressionAttributeNames)) {
          utils_1.error("ExpressionAttributeNames must be an object");
        }
        if (typeof ExpressionAttributeValues !== "object" || Array.isArray(ExpressionAttributeValues)) {
          utils_1.error("ExpressionAttributeValues must be an object");
        }
        const { schema, defaults, required, linked, _table } = this;
        const validateType = validateTypes_1.default(this.DocumentClient);
        const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item));
        const {
          conditions,
          capacity,
          metrics,
          returnValues
        } = options, _args = __rest(
          options,
          ["conditions", "capacity", "metrics", "returnValues"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid update options: ${args.join(", ")}`);
        if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase()))) {
          utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))) {
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(returnValues.toUpperCase()))) {
          utils_1.error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`);
        }
        let ConditionExpression;
        if (conditions) {
          const { expression: expression2, names: names2, values: values2 } = expressionBuilder_1.default(conditions, this.table, this.name);
          if (Object.keys(names2).length > 0) {
            ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names2);
            ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values2);
            ConditionExpression = expression2;
          }
        }
        Object.keys(required).forEach((field) => required[field] && (data[field] === void 0 || data[field] === null) && utils_1.error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ""}' is a required field`));
        const Key = getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
        const names = {};
        const values = {};
        Object.keys(data).forEach((field) => {
          var _a2, _b, _c, _d, _e, _f, _g;
          const mapping = schema.attributes[field];
          if (field === "$remove") {
            const attrs = Array.isArray(data[field]) ? data[field] : [data[field]];
            for (const i in attrs) {
              if (!schema.attributes[attrs[i]]) {
                utils_1.error(`'${attrs[i]}' is not a valid attribute and cannot be removed`);
              }
              if (schema.attributes[attrs[i]].partitionKey === true || schema.attributes[attrs[i]].sortKey === true) {
                utils_1.error(`'${attrs[i]}' is the ${schema.attributes[attrs[i]].partitionKey === true ? "partitionKey" : "sortKey"} and cannot be removed`);
              }
              if (schema.attributes[attrs[i]].required) {
                utils_1.error(`'${attrs[i]}' is required and cannot be removed`);
              }
              const attr = schema.attributes[attrs[i]].map || attrs[i];
              REMOVE.push(`#${attr}`);
              names[`#${attr}`] = attr;
            }
          } else if (this._table._removeNulls === true && (data[field] === null || String(data[field]).trim() === "") && (!mapping.link || mapping.save)) {
            if (schema.attributes[field].required)
              utils_1.error(`'${field}' is required and cannot be removed`);
            REMOVE.push(`#${field}`);
            names[`#${field}`] = field;
          } else if (mapping.partitionKey !== true && mapping.sortKey !== true && (mapping.save === void 0 || mapping.save === true) && (!mapping.link || mapping.link && mapping.save === true)) {
            if (["number", "set"].includes(mapping.type) && ((_a2 = data[field]) === null || _a2 === void 0 ? void 0 : _a2.$add) !== void 0 && ((_b = data[field]) === null || _b === void 0 ? void 0 : _b.$add) !== null) {
              ADD.push(`#${field} :${field}`);
              values[`:${field}`] = validateType(mapping, field, data[field].$add);
              names[`#${field}`] = field;
            } else if (mapping.type === "set" && ((_c = data[field]) === null || _c === void 0 ? void 0 : _c.$delete)) {
              DELETE.push(`#${field} :${field}`);
              values[`:${field}`] = validateType(mapping, field, data[field].$delete);
              names[`#${field}`] = field;
            } else if (mapping.type === "list" && Array.isArray((_d = data[field]) === null || _d === void 0 ? void 0 : _d.$remove)) {
              data[field].$remove.forEach((i) => {
                if (typeof i !== "number") {
                  utils_1.error(`Remove array for '${field}' must only contain numeric indexes`);
                }
                REMOVE.push(`#${field}[${i}]`);
              });
              names[`#${field}`] = field;
            } else if (mapping.type === "list" && (((_e = data[field]) === null || _e === void 0 ? void 0 : _e.$append) || ((_f = data[field]) === null || _f === void 0 ? void 0 : _f.$prepend))) {
              if (data[field].$append) {
                SET.push(`#${field} = list_append(#${field},:${field})`);
                values[`:${field}`] = validateType(mapping, field, data[field].$append);
              } else {
                SET.push(`#${field} = list_append(:${field},#${field})`);
                values[`:${field}`] = validateType(mapping, field, data[field].$prepend);
              }
              names[`#${field}`] = field;
            } else if (mapping.type === "list" && !Array.isArray(data[field]) && typeof data[field] === "object") {
              Object.keys(data[field]).forEach((i) => {
                if (String(parseInt(i)) !== i) {
                  utils_1.error(`Properties must be numeric to update specific list items in '${field}'`);
                }
                SET.push(`#${field}[${i}] = :${field}_${i}`);
                values[`:${field}_${i}`] = data[field][i];
              });
              names[`#${field}`] = field;
            } else if (mapping.type === "map" && ((_g = data[field]) === null || _g === void 0 ? void 0 : _g.$set)) {
              Object.keys(data[field].$set).forEach((f) => {
                let props = f.split(".");
                let acc = [`#${field}`];
                props.forEach((prop, i) => {
                  let id = `${field}_${props.slice(0, i + 1).join("_")}`;
                  names[`#${id.replace(/\[(\d+)\]/, "")}`] = prop.replace(/\[(\d+)\]/, "");
                  if (i === props.length - 1) {
                    let input = data[field].$set[f];
                    let path = `${acc.join(".")}.#${id}`;
                    let value = `${id.replace(/\[(\d+)\]/, "_$1")}`;
                    if (input === void 0) {
                      REMOVE.push(`${path}`);
                    } else if (input.$add) {
                      ADD.push(`${path} :${value}`);
                      values[`:${value}`] = input.$add;
                    } else if (input.$append) {
                      SET.push(`${path} = list_append(${path},:${value})`);
                      values[`:${value}`] = input.$append;
                    } else if (input.$prepend) {
                      SET.push(`${path} = list_append(:${value},${path})`);
                      values[`:${value}`] = input.$prepend;
                    } else if (input.$remove) {
                      input.$remove.forEach((i2) => {
                        if (typeof i2 !== "number") {
                          utils_1.error(`Remove array for '${field}' must only contain numeric indexes`);
                        }
                        REMOVE.push(`${path}[${i2}]`);
                      });
                    } else {
                      SET.push(`${path} = :${value}`);
                      values[`:${value}`] = input;
                    }
                    if (input.$set) {
                      Object.keys(input.$set).forEach((i2) => {
                        if (String(parseInt(i2)) !== i2) {
                          utils_1.error(`Properties must be numeric to update specific list items in '${field}'`);
                        }
                        SET.push(`${path}[${i2}] = :${value}_${i2}`);
                        values[`:${value}_${i2}`] = input.$set[i2];
                      });
                    }
                  } else {
                    acc.push(`#${id.replace(/\[(\d+)\]/, "")}`);
                  }
                });
              });
              names[`#${field}`] = field;
            } else {
              let value = utils_1.transformAttr(mapping, validateType(mapping, field, data[field]), data);
              if (value !== void 0) {
                SET.push(
                  mapping.default !== void 0 && item[field] === void 0 && !mapping.onUpdate ? `#${field} = if_not_exists(#${field},:${field})` : `#${field} = :${field}`
                );
                names[`#${field}`] = field;
                values[`:${field}`] = value;
              }
            }
          }
        });
        const expression = ((SET.length > 0 ? "SET " + SET.join(", ") : "") + (REMOVE.length > 0 ? " REMOVE " + REMOVE.join(", ") : "") + (ADD.length > 0 ? " ADD " + ADD.join(", ") : "") + (DELETE.length > 0 ? " DELETE " + DELETE.join(", ") : "")).trim();
        ExpressionAttributeValues = Object.assign(values, ExpressionAttributeValues);
        const payload = Object.assign({
          TableName: _table.name,
          Key,
          UpdateExpression: expression,
          ExpressionAttributeNames: Object.assign(names, ExpressionAttributeNames)
        }, typeof params === "object" ? params : {}, !utils_1.isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {}, ConditionExpression ? { ConditionExpression } : {}, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null);
        return payload;
      }
      put(item, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const putParams = this.putParams(item, options, params);
          if (!exports.shouldExecute(options.execute, this.autoExecute)) {
            return putParams;
          }
          const output = yield this.DocumentClient.put(putParams).promise();
          if (!exports.shouldParse(options.parse, this.autoParse)) {
            return output;
          }
          const { Attributes } = output, restOutput = __rest(output, ["Attributes"]);
          if (!Attributes) {
            return output;
          }
          const parsedAttributes = this.parse(Attributes, options.include);
          return Object.assign({ Attributes: parsedAttributes }, restOutput);
        });
      }
      putBatch(item) {
        const payload = this.putParams(item);
        return { [payload.TableName]: { PutRequest: { Item: payload.Item } } };
      }
      putTransaction(item, options = {}) {
        const {
          conditions,
          returnValues
        } = options, args = __rest(
          options,
          ["conditions", "returnValues"]
        );
        if (Object.keys(args).length > 0) {
          utils_1.error(`Invalid put transaction options: ${Object.keys(args).join(", ")}`);
        }
        let payload = this.putParams(item, options);
        if ("ReturnValues" in payload) {
          let { ReturnValues } = payload, _payload = __rest(payload, ["ReturnValues"]);
          payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        return { Put: payload };
      }
      putParams(item, options = {}, params = {}) {
        const { schema, defaults, required, linked, _table } = this;
        const validateType = validateTypes_1.default(this.DocumentClient);
        const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item));
        const {
          conditions,
          capacity,
          metrics,
          returnValues
        } = options, _args = __rest(
          options,
          ["conditions", "capacity", "metrics", "returnValues"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid put options: ${args.join(", ")}`);
        if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase()))) {
          utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        }
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))) {
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        }
        if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(returnValues.toUpperCase()))) {
          utils_1.error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`);
        }
        let ExpressionAttributeNames;
        let ExpressionAttributeValues;
        let ConditionExpression;
        if (conditions) {
          const { expression, names, values } = expressionBuilder_1.default(conditions, this.table, this.name);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = names;
            ExpressionAttributeValues = values;
            ConditionExpression = expression;
          }
        }
        Object.keys(required).forEach((field) => required[field] !== void 0 && (data[field] === void 0 || data[field] === null) && utils_1.error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ""}' is a required field`));
        getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
        const payload = Object.assign({
          TableName: _table.name,
          Item: Object.keys(data).reduce((acc, field) => {
            let mapping = schema.attributes[field];
            let value = validateType(mapping, field, data[field]);
            return value !== void 0 && (mapping.save === void 0 || mapping.save === true) && (!mapping.link || mapping.link && mapping.save === true) && (!_table._removeNulls || _table._removeNulls && value !== null) ? Object.assign(acc, {
              [field]: utils_1.transformAttr(mapping, value, data)
            }) : acc;
          }, {})
        }, ExpressionAttributeNames ? { ExpressionAttributeNames } : null, !utils_1.isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : null, ConditionExpression ? { ConditionExpression } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, returnValues ? { ReturnValues: returnValues.toUpperCase() } : null, typeof params === "object" ? params : {});
        return payload;
      }
      conditionCheck(item, options = {}) {
        const {
          conditions,
          returnValues
        } = options, args = __rest(
          options,
          ["conditions", "returnValues"]
        );
        if (Object.keys(args).length > 0) {
          utils_1.error(`Invalid conditionCheck options: ${Object.keys(args).join(", ")}`);
        }
        let payload = this.deleteParams(item, options);
        if (!("ConditionExpression" in payload))
          utils_1.error(`'conditions' are required in a conditionCheck`);
        if ("ReturnValues" in payload) {
          let { ReturnValues } = payload, _payload = __rest(payload, ["ReturnValues"]);
          payload = Object.assign({}, _payload, { ReturnValuesOnConditionCheckFailure: ReturnValues });
        }
        return { ConditionCheck: payload };
      }
      query(pk, options = {}, params = {}) {
        if (!this.table) {
          throw new Error("Entity table is not defined");
        }
        options.entity = this.name;
        return this.table.query(pk, options, params);
      }
      scan(options = {}, params = {}) {
        if (!this.table) {
          throw new Error("Entity table is not defined");
        }
        options.entity = this.name;
        return this.table.scan(options, params);
      }
    };
    exports.default = Entity2;
    var shouldExecute = (execute, autoExecute) => execute === true || execute === void 0 && autoExecute;
    exports.shouldExecute = shouldExecute;
    var shouldParse = (parse, autoParse) => parse === true || parse === void 0 && autoParse;
    exports.shouldParse = shouldParse;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/types.js
var require_types = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/index.js
var require_Entity2 = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Entity/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = void 0;
    var Entity_1 = require_Entity();
    Object.defineProperty(exports, "default", { enumerable: true, get: function() {
      return __importDefault(Entity_1).default;
    } });
    __exportStar(require_Entity(), exports);
    __exportStar(require_types(), exports);
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/Table.js
var require_Table = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/Table.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __rest = exports && exports.__rest || function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
            t[p[i]] = s[p[i]];
        }
      return t;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var parseTable_1 = require_parseTable();
    var expressionBuilder_1 = __importDefault(require_expressionBuilder());
    var validateTypes_1 = __importDefault(require_validateTypes());
    var Entity_1 = __importDefault(require_Entity2());
    var projectionBuilder_1 = __importDefault(require_projectionBuilder());
    var utils_1 = require_utils();
    var Table2 = class {
      constructor(table) {
        this._execute = true;
        this._parse = true;
        this._removeNulls = true;
        this._entities = [];
        if (typeof table !== "object" || Array.isArray(table))
          utils_1.error("Please provide a valid table definition");
        Object.assign(this, parseTable_1.parseTable(table));
      }
      set autoExecute(val) {
        this._execute = typeof val === "boolean" ? val : true;
      }
      get autoExecute() {
        return this._execute;
      }
      set autoParse(val) {
        this._parse = typeof val === "boolean" ? val : true;
      }
      get autoParse() {
        return this._parse;
      }
      set removeNullAttributes(val) {
        this._removeNulls = typeof val === "boolean" ? val : true;
      }
      get removeNullAttributes() {
        return this._removeNulls;
      }
      get DocumentClient() {
        return this._docClient;
      }
      set DocumentClient(docClient) {
        if (docClient && docClient.get && docClient.put && docClient.delete && docClient.update) {
          if (docClient.options.convertEmptyValues !== false)
            docClient.options.convertEmptyValues = true;
          this._docClient = docClient;
        } else {
          utils_1.error("Invalid DocumentClient");
        }
      }
      addEntity(entity) {
        let entities = Array.isArray(entity) ? entity : [entity];
        for (let i in entities) {
          let entity2 = entities[i];
          if (entity2 instanceof Entity_1.default) {
            if (this._entities && this._entities.includes(entity2.name)) {
              utils_1.error(`Entity name '${entity2.name}' already exists`);
            }
            const reservedWords = Object.getOwnPropertyNames(this).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
            if (reservedWords.includes(entity2.name)) {
              utils_1.error(`'${entity2.name}' is a reserved word and cannot be used to name an Entity`);
            }
            if (!this.Table.sortKey && entity2.schema.keys.sortKey) {
              utils_1.error(`${entity2.name} entity contains a sortKey, but the Table does not`);
            } else if (this.Table.sortKey && !entity2.schema.keys.sortKey) {
              utils_1.error(`${entity2.name} entity does not have a sortKey defined`);
            }
            for (const key in entity2.schema.keys) {
              const attr = entity2.schema.keys[key];
              switch (key) {
                case "partitionKey":
                case "sortKey":
                  if (attr !== this.Table[key] && this.Table[key]) {
                    if (!entity2.schema.attributes[this.Table[key]]) {
                      entity2.schema.attributes[this.Table[key]] = Object.assign({}, entity2.schema.attributes[attr], { alias: attr });
                      entity2.schema.attributes[attr].map = this.Table[key];
                    } else {
                      utils_1.error(`The Table's ${key} name (${String(this.Table[key])}) conflicts with an Entity attribute name`);
                    }
                  }
                  break;
                default:
                  if (!this.Table.indexes[key])
                    utils_1.error(`'${key}' is not a valid secondary index name`);
                  for (const keyType in attr) {
                    if (!this.Table.indexes[key][keyType])
                      utils_1.error(`${entity2.name} contains a ${keyType}, but it is not used by ${key}`);
                    if (attr[keyType] !== this.Table.indexes[key][keyType]) {
                      if (!entity2.schema.attributes[this.Table.indexes[key][keyType]]) {
                        if (entity2.schema.attributes[attr[keyType]].map && entity2.schema.attributes[attr[keyType]].map !== this.Table.indexes[key][keyType])
                          utils_1.error(`${key}'s ${keyType} cannot map to the '${attr[keyType]}' alias because it is already mapped to another table attribute`);
                        entity2.schema.attributes[this.Table.indexes[key][keyType]] = Object.assign({}, entity2.schema.attributes[attr[keyType]], { alias: attr[keyType] });
                        entity2.schema.attributes[attr[keyType]].map = this.Table.indexes[key][keyType];
                      } else {
                        const config = entity2.schema.attributes[this.Table.indexes[key][keyType]];
                        if (!config.partitionKey && !config.sortKey || config.partitionKey && !config.partitionKey.includes(key) || config.sortKey && !config.sortKey.includes(key)) {
                          utils_1.error(
                            `${key}'s ${keyType} name (${this.Table.indexes[key][keyType]}) conflicts with another Entity attribute name`
                          );
                        }
                      }
                    }
                  }
                  if (this.Table.indexes[key].partitionKey && this.Table.indexes[key].sortKey && (!entity2.schema.attributes[this.Table.indexes[key].partitionKey] || !entity2.schema.attributes[this.Table.indexes[key].sortKey])) {
                    utils_1.error(`${key} requires mappings for both the partitionKey and the sortKey`);
                  }
                  break;
              }
            }
            for (let attr in entity2.schema.attributes) {
              if (this.Table.entityField && (attr === this.Table.entityField || attr === entity2._etAlias)) {
                utils_1.error(`Attribute or alias '${attr}' conflicts with the table's 'entityField' mapping or entity alias`);
              } else if (this.Table.attributes[attr]) {
                if (this.Table.attributes[attr].type && this.Table.attributes[attr].type !== entity2.schema.attributes[attr].type)
                  utils_1.error(`${entity2.name} attribute type for '${attr}' (${entity2.schema.attributes[attr].type}) does not match table's type (${this.Table.attributes[attr].type})`);
                this.Table.attributes[attr].mappings[entity2.name] = Object.assign(
                  {
                    [entity2.schema.attributes[attr].alias || attr]: entity2.schema.attributes[attr].type
                  },
                  entity2.schema.attributes[attr].type === "set" ? { _setType: entity2.schema.attributes[attr].setType } : {}
                );
              } else if (!entity2.schema.attributes[attr].map) {
                this.Table.attributes[attr] = Object.assign({
                  mappings: {
                    [entity2.name]: Object.assign(
                      {
                        [entity2.schema.attributes[attr].alias || attr]: entity2.schema.attributes[attr].type
                      },
                      entity2.schema.attributes[attr].type === "set" ? { _setType: entity2.schema.attributes[attr].setType } : {}
                    )
                  }
                }, entity2.schema.attributes[attr].partitionKey || entity2.schema.attributes[attr].sortKey ? { type: entity2.schema.attributes[attr].type } : null);
              }
            }
            this._entities.push(entity2.name);
            this[entity2.name] = entity2;
            entity2.table = this;
          } else {
            utils_1.error("Invalid Entity");
          }
        }
      }
      set entities(entity) {
        this.addEntity(entity);
      }
      get entities() {
        return this._entities;
      }
      query(pk, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const { payload, EntityProjections, TableProjections } = this.queryParams(pk, options, params, true);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.query(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return Object.assign(
                result,
                {
                  Items: result.Items && result.Items.map((item) => {
                    if (typeof item !== "object" || item === null) {
                      return item;
                    }
                    const entityField = String(this.Table.entityField);
                    if (!utils_1.hasProperty(item, entityField)) {
                      return item;
                    }
                    const entityName = item[entityField];
                    if (typeof entityName !== "string") {
                      return item;
                    }
                    if (this[entityName]) {
                      return this[entityName].parse(item, EntityProjections[entityName] ? EntityProjections[entityName] : TableProjections ? TableProjections : []);
                    }
                    return item;
                  })
                },
                result.LastEvaluatedKey ? {
                  next: () => {
                    return this.query(pk, Object.assign(options, { startKey: result.LastEvaluatedKey }), params);
                  }
                } : null
              );
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      queryParams(pk, options = {}, params = {}, projections = false) {
        const {
          index,
          limit,
          reverse,
          consistent,
          capacity,
          select,
          eq,
          lt,
          lte,
          gt,
          gte,
          between,
          beginsWith,
          filters,
          attributes,
          startKey,
          entity
        } = options, _args = __rest(
          options,
          ["index", "limit", "reverse", "consistent", "capacity", "select", "eq", "lt", "lte", "gt", "gte", "between", "beginsWith", "filters", "attributes", "startKey", "entity"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid query options: ${args.join(", ")}`);
        if (typeof pk !== "string" && typeof pk !== "number" || typeof pk === "string" && pk.trim().length === 0)
          utils_1.error(`Query requires a string, number or binary 'partitionKey' as its first parameter`);
        if (index !== void 0 && !this.Table.indexes[index])
          utils_1.error(`'${index}' is not a valid index name`);
        if (limit !== void 0 && (!Number.isInteger(limit) || limit < 0))
          utils_1.error(`'limit' must be a positive integer`);
        if (reverse !== void 0 && typeof reverse !== "boolean")
          utils_1.error(`'reverse' requires a boolean`);
        if (consistent !== void 0 && typeof consistent !== "boolean")
          utils_1.error(`'consistent' requires a boolean`);
        if (select !== void 0 && (typeof select !== "string" || !["ALL_ATTRIBUTES", "ALL_PROJECTED_ATTRIBUTES", "SPECIFIC_ATTRIBUTES", "COUNT"].includes(select.toUpperCase())))
          utils_1.error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`);
        if (entity !== void 0 && (typeof entity !== "string" || !(entity in this)))
          utils_1.error(`'entity' must be a string and a valid table Entity name`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        if (startKey && (typeof startKey !== "object" || Array.isArray(startKey)))
          utils_1.error(`'startKey' requires a valid object`);
        let ExpressionAttributeNames = {
          "#pk": index && this.Table.indexes[index].partitionKey || this.Table.partitionKey
        };
        let ExpressionAttributeValues = { ":pk": pk };
        let KeyConditionExpression = "#pk = :pk";
        let FilterExpression;
        let ProjectionExpression;
        let EntityProjections = {};
        let TableProjections;
        let operator, value, f = "";
        if (eq !== void 0) {
          value = eq;
          f = "eq";
          operator = "=";
        }
        if (lt !== void 0) {
          value = value ? utils_1.conditionError(f) : lt;
          f = "lt";
          operator = "<";
        }
        if (lte !== void 0) {
          value = value ? utils_1.conditionError(f) : lte;
          f = "lte";
          operator = "<=";
        }
        if (gt !== void 0) {
          value = value ? utils_1.conditionError(f) : gt;
          f = "gt";
          operator = ">";
        }
        if (gte !== void 0) {
          value = value ? utils_1.conditionError(f) : gte;
          f = "gte";
          operator = ">=";
        }
        if (beginsWith !== void 0) {
          value = value ? utils_1.conditionError(f) : beginsWith;
          f = "beginsWith";
          operator = "BEGINS_WITH";
        }
        if (between !== void 0) {
          value = value ? utils_1.conditionError(f) : between;
          f = "between";
          operator = "BETWEEN";
        }
        if (operator) {
          const sk = index ? this.Table.indexes[index].sortKey ? this.Table.attributes[this.Table.indexes[index].sortKey] || { type: "string" } : utils_1.error(`Conditional expressions require the index to have a sortKey`) : this.Table.sortKey ? this.Table.attributes[this.Table.sortKey] : utils_1.error(`Conditional expressions require the table to have a sortKey`);
          const validateType = validateTypes_1.default(this.DocumentClient);
          ExpressionAttributeNames["#sk"] = index && this.Table.indexes[index].sortKey || this.Table.sortKey;
          if (operator === "BETWEEN") {
            if (!Array.isArray(value) || value.length !== 2)
              utils_1.error(`'between' conditions requires an array with two values.`);
            ExpressionAttributeValues[":sk0"] = validateType(sk, f + "[0]", value[0]);
            ExpressionAttributeValues[":sk1"] = validateType(sk, f + "[1]", value[1]);
            KeyConditionExpression += " and #sk between :sk0 and :sk1";
          } else {
            ExpressionAttributeValues[":sk"] = validateType(sk, f, value);
            if (operator === "BEGINS_WITH") {
              KeyConditionExpression += " and begins_with(#sk,:sk)";
            } else {
              KeyConditionExpression += ` and #sk ${operator} :sk`;
            }
          }
        }
        if (filters) {
          const { expression, names, values } = expressionBuilder_1.default(filters, this, entity);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
            ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values);
            FilterExpression = expression;
          }
        }
        if (attributes) {
          const { names, projections: projections2, entities, tableAttrs } = projectionBuilder_1.default(attributes, this, entity, true);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
            ProjectionExpression = projections2;
            EntityProjections = entities;
            TableProjections = tableAttrs;
          }
        }
        const payload = Object.assign({
          TableName: this.name,
          KeyConditionExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues
        }, FilterExpression ? { FilterExpression } : null, ProjectionExpression ? { ProjectionExpression } : null, index ? { IndexName: index } : null, limit ? { Limit: String(limit) } : null, reverse ? { ScanIndexForward: !reverse } : null, consistent ? { ConsistentRead: consistent } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, select ? { Select: select.toUpperCase() } : null, startKey ? { ExclusiveStartKey: startKey } : null, typeof params === "object" ? params : null);
        return projections ? { payload, EntityProjections, TableProjections } : payload;
      }
      scan(options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const { payload, EntityProjections, TableProjections } = this.scanParams(options, params, true);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.scan(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return Object.assign(
                result,
                {
                  Items: result.Items && result.Items.map((item) => {
                    if (this[item[String(this.Table.entityField)]]) {
                      return this[item[String(this.Table.entityField)]].parse(item, EntityProjections[item[String(this.Table.entityField)]] ? EntityProjections[item[String(this.Table.entityField)]] : TableProjections ? TableProjections : []);
                    } else {
                      return item;
                    }
                  })
                },
                result.LastEvaluatedKey ? {
                  next: () => {
                    return this.scan(Object.assign(options, { startKey: result.LastEvaluatedKey }), params);
                  }
                } : null
              );
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      scanParams(options = {}, params = {}, meta = false) {
        const {
          index,
          limit,
          consistent,
          capacity,
          select,
          filters,
          attributes,
          segments,
          segment,
          startKey,
          entity
        } = options, _args = __rest(
          options,
          ["index", "limit", "consistent", "capacity", "select", "filters", "attributes", "segments", "segment", "startKey", "entity"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid scan options: ${args.join(", ")}`);
        if (index !== void 0 && !this.Table.indexes[index])
          utils_1.error(`'${index}' is not a valid index name`);
        if (limit !== void 0 && (!Number.isInteger(limit) || limit < 0))
          utils_1.error(`'limit' must be a positive integer`);
        if (consistent !== void 0 && typeof consistent !== "boolean")
          utils_1.error(`'consistent' requires a boolean`);
        if (select !== void 0 && (typeof select !== "string" || !["ALL_ATTRIBUTES", "ALL_PROJECTED_ATTRIBUTES", "SPECIFIC_ATTRIBUTES", "COUNT"].includes(select.toUpperCase())))
          utils_1.error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`);
        if (entity !== void 0 && (typeof entity !== "string" || !(entity in this)))
          utils_1.error(`'entity' must be a string and a valid table Entity name`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        if (startKey && (typeof startKey !== "object" || Array.isArray(startKey)))
          utils_1.error(`'startKey' requires a valid object`);
        if (segments !== void 0 && (!Number.isInteger(segments) || segments < 1))
          utils_1.error(`'segments' must be an integer greater than 1`);
        if (segment !== void 0 && (!Number.isInteger(segment) || segment < 0 || segment >= segments))
          utils_1.error(`'segment' must be an integer greater than or equal to 0 and less than the total number of segments`);
        if (segments !== void 0 && segment === void 0 || segments === void 0 && segment !== void 0)
          utils_1.error(`Both 'segments' and 'segment' must be provided`);
        let ExpressionAttributeNames = {};
        let ExpressionAttributeValues = {};
        let FilterExpression;
        let ProjectionExpression;
        let EntityProjections = {};
        let TableProjections;
        if (filters) {
          const { expression, names, values } = expressionBuilder_1.default(filters, this, entity);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
            ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values);
            FilterExpression = expression;
          }
        }
        if (attributes) {
          const { names, projections, entities, tableAttrs } = projectionBuilder_1.default(attributes, this, entity, true);
          if (Object.keys(names).length > 0) {
            ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
            ProjectionExpression = projections;
            EntityProjections = entities;
            TableProjections = tableAttrs;
          }
        }
        const payload = Object.assign({
          TableName: this.name
        }, Object.keys(ExpressionAttributeNames).length ? { ExpressionAttributeNames } : null, Object.keys(ExpressionAttributeValues).length ? { ExpressionAttributeValues } : null, FilterExpression ? { FilterExpression } : null, ProjectionExpression ? { ProjectionExpression } : null, index ? { IndexName: index } : null, segments ? { TotalSegments: segments } : null, Number.isInteger(segment) ? { Segment: segment } : null, limit ? { Limit: String(limit) } : null, consistent ? { ConsistentRead: consistent } : null, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, select ? { Select: select.toUpperCase() } : null, startKey ? { ExclusiveStartKey: startKey } : null, typeof params === "object" ? params : null);
        return meta ? { payload, EntityProjections, TableProjections } : payload;
      }
      batchGet(items, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const {
            payload,
            Tables,
            EntityProjections,
            TableProjections
          } = this.batchGetParams(items, options, params, true);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.batchGet(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return this.parseBatchGetResponse(result, Tables, EntityProjections, TableProjections, options);
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      parseBatchGetResponse(result, Tables, EntityProjections, TableProjections, options = {}) {
        return Object.assign(
          result,
          result.Responses ? {
            Responses: Object.keys(result.Responses).reduce((acc, table) => {
              return Object.assign(acc, {
                [Tables[table] && Tables[table].alias || table]: result.Responses[table].map((item) => {
                  if (Tables[table] && Tables[table][item[String(Tables[table].Table.entityField)]]) {
                    return Tables[table][item[String(Tables[table].Table.entityField)]].parse(item, EntityProjections[table] && EntityProjections[table][item[String(Tables[table].Table.entityField)]] ? EntityProjections[table][item[String(Tables[table].Table.entityField)]] : TableProjections[table] ? TableProjections[table] : []);
                  } else {
                    return item;
                  }
                })
              });
            }, {})
          } : null,
          result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0 ? {
            next: () => __awaiter(this, void 0, void 0, function* () {
              const nextResult = yield this.DocumentClient.batchGet(Object.assign({ RequestItems: result.UnprocessedKeys }, options.capacity ? { ReturnConsumedCapacity: options.capacity.toUpperCase() } : null)).promise();
              return this.parseBatchGetResponse(nextResult, Tables, EntityProjections, TableProjections, options);
            })
          } : { next: () => false }
        );
      }
      batchGetParams(_items, options = {}, params = {}, meta = false) {
        let items = Array.isArray(_items) ? _items : [_items];
        if (items.length === 0)
          utils_1.error(`No items supplied`);
        const { capacity, consistent, attributes } = options, _args = __rest(
          options,
          ["capacity", "consistent", "attributes"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid batchGet options: ${args.join(", ")}`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        let RequestItems = {};
        let Tables = {};
        let TableAliases = {};
        let EntityProjections = {};
        let TableProjections = {};
        for (const i in items) {
          const item = items[i];
          if (item && item.Table && item.Table.Table && item.Key && typeof item.Key === "object" && !Array.isArray(item.Key)) {
            const table = item.Table.name;
            if (!RequestItems[table]) {
              RequestItems[table] = { Keys: [] };
              Tables[table] = item.Table;
              if (item.Table.alias)
                TableAliases[item.Table.alias] = table;
            }
            RequestItems[table].Keys.push(item.Key);
          } else {
            utils_1.error(`Item references must contain a valid Table object and Key`);
          }
        }
        if (consistent) {
          if (consistent === true) {
            for (const tbl in RequestItems)
              RequestItems[tbl].ConsistentRead = true;
          } else if (typeof consistent === "object" && !Array.isArray(consistent)) {
            for (const tbl in consistent) {
              const tbl_name = TableAliases[tbl] || tbl;
              if (RequestItems[tbl_name]) {
                if (typeof consistent[tbl] === "boolean") {
                  RequestItems[tbl_name].ConsistentRead = consistent[tbl];
                } else {
                  utils_1.error(`'consistent' values must be booleans (${tbl})`);
                }
              } else {
                utils_1.error(`There are no items for the table or table alias: ${tbl}`);
              }
            }
          } else {
            utils_1.error(`'consistent' must be a boolean or an map of table names`);
          }
        }
        if (attributes) {
          let attrs = attributes;
          if (Array.isArray(attributes)) {
            if (Object.keys(RequestItems).length === 1) {
              attrs = { [Object.keys(RequestItems)[0]]: attributes };
            } else {
              utils_1.error(`'attributes' must use a table map when requesting items from multiple tables`);
            }
          }
          for (const tbl in attrs) {
            const tbl_name = TableAliases[tbl] || tbl;
            if (Tables[tbl_name]) {
              const { names, projections, entities, tableAttrs } = projectionBuilder_1.default(attrs[tbl], Tables[tbl_name], null, true);
              RequestItems[tbl_name].ExpressionAttributeNames = names;
              RequestItems[tbl_name].ProjectionExpression = projections;
              EntityProjections[tbl_name] = entities;
              TableProjections[tbl_name] = tableAttrs;
            } else {
              utils_1.error(`There are no items for the table: ${tbl}`);
            }
          }
        }
        const payload = Object.assign({ RequestItems }, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, typeof params === "object" ? params : null);
        return meta ? {
          payload,
          Tables,
          EntityProjections,
          TableProjections
        } : payload;
      }
      batchWrite(items, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const payload = this.batchWriteParams(items, options, params);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.batchWrite(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return this.parseBatchWriteResponse(result, options);
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      parseBatchWriteResponse(result, options = {}) {
        return Object.assign(
          result,
          result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0 ? {
            next: () => __awaiter(this, void 0, void 0, function* () {
              const nextResult = yield this.DocumentClient.batchWrite(Object.assign({ RequestItems: result.UnprocessedItems }, options.capacity ? { ReturnConsumedCapacity: options.capacity.toUpperCase() } : null, options.metrics ? { ReturnItemCollectionMetrics: options.metrics.toUpperCase() } : null)).promise();
              return this.parseBatchWriteResponse(nextResult, options);
            })
          } : { next: () => false }
        );
      }
      batchWriteParams(_items, options = {}, params = {}, meta = false) {
        let items = (Array.isArray(_items) ? _items : [_items]).filter((x) => x);
        if (items.length === 0)
          utils_1.error(`No items supplied`);
        const { capacity, metrics } = options, _args = __rest(
          options,
          ["capacity", "metrics"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid batchWrite options: ${args.join(", ")}`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
          utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        const RequestItems = {};
        for (const i in items) {
          const item = items[i];
          const table = Object.keys(item)[0];
          if (!RequestItems[table])
            RequestItems[table] = [];
          RequestItems[table].push(item[table]);
        }
        const payload = Object.assign({ RequestItems }, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, typeof params === "object" ? params : null);
        const Tables = {};
        return meta ? { payload, Tables } : payload;
      }
      transactGet(items = [], options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const { payload, Entities } = this.transactGetParams(items, options, true);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.transactGet(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return Object.assign(result, result.Responses ? {
                Responses: result.Responses.map((res, i) => {
                  if (res.Item) {
                    return { Item: Entities[i].parse ? Entities[i].parse(res.Item) : res.Item };
                  } else {
                    return {};
                  }
                })
              } : null);
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      transactGetParams(_items, options = {}, meta = false) {
        let items = Array.isArray(_items) ? _items : _items ? [_items] : [];
        if (items.length === 0)
          utils_1.error(`No items supplied`);
        const { capacity } = options, _args = __rest(
          options,
          ["capacity"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid transactGet options: ${args.join(", ")}`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        let Entities = [];
        const payload = Object.assign({
          TransactItems: items.map((item) => {
            let { Entity: Entity2 } = item, _item = __rest(item, ["Entity"]);
            Entities.push(Entity2);
            if (!("Get" in _item) || Object.keys(_item).length > 1)
              utils_1.error(`Invalid transaction item. Use the 'getTransaction' method on an entity.`);
            return _item;
          })
        }, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null);
        return meta ? { Entities, payload } : payload;
      }
      transactWrite(items, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          const payload = this.transactWriteParams(items, options);
          if (options.execute || this.autoExecute && options.execute !== false) {
            const result = yield this.DocumentClient.transactWrite(payload).promise();
            if (options.parse || this.autoParse && options.parse !== false) {
              return result;
            } else {
              return result;
            }
          } else {
            return payload;
          }
        });
      }
      transactWriteParams(_items, options = {}) {
        let items = Array.isArray(_items) ? _items : _items ? [_items] : [];
        if (items.length === 0)
          utils_1.error(`No items supplied`);
        const {
          capacity,
          metrics,
          token
        } = options, _args = __rest(
          options,
          ["capacity", "metrics", "token"]
        );
        const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
        if (args.length > 0)
          utils_1.error(`Invalid transactWrite options: ${args.join(", ")}`);
        if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
          utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
        if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
          utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
        if (token !== void 0 && (typeof token !== "string" || token.trim().length === 0 || token.trim().length > 36))
          utils_1.error(`'token' must be a string up to 36 characters long `);
        const payload = Object.assign({
          TransactItems: items.map((item) => {
            if (!("ConditionCheck" in item) && !("Delete" in item) && !("Put" in item) && !("Update" in item) || Object.keys(item).length > 1)
              utils_1.error(`Invalid transaction item. Use the 'putTransaction', 'updateTransaction', 'deleteTransaction', or 'conditionCheck' methods on an entity.`);
            return item;
          })
        }, capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null, metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null, token ? { ClientRequestToken: token.trim() } : null);
        return payload;
      }
      parse(entity, input, include = []) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this[entity])
            utils_1.error(`'${entity}' is not a valid Entity`);
          return this[entity].parse(input, include);
        });
      }
      get(entity, item = {}, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this[entity])
            utils_1.error(`'${entity}' is not a valid Entity`);
          return this[entity].get(item, options, params);
        });
      }
      delete(entity, item = {}, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this[entity])
            utils_1.error(`'${entity}' is not a valid Entity`);
          return this[entity].delete(item, options, params);
        });
      }
      update(entity, item = {}, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this[entity])
            utils_1.error(`'${entity}' is not a valid Entity`);
          return this[entity].update(item, options, params);
        });
      }
      put(entity, item = {}, options = {}, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this[entity])
            utils_1.error(`'${entity}' is not a valid Entity`);
          return this[entity].put(item, options, params);
        });
      }
    };
    exports.default = Table2;
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/types.js
var require_types2 = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/index.js
var require_Table2 = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/classes/Table/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = void 0;
    var Table_1 = require_Table();
    Object.defineProperty(exports, "default", { enumerable: true, get: function() {
      return __importDefault(Table_1).default;
    } });
    __exportStar(require_Table(), exports);
    __exportStar(require_types2(), exports);
  }
});

// asset-input/node_modules/dynamodb-toolbox/dist/index.js
var require_dist = __commonJS({
  "asset-input/node_modules/dynamodb-toolbox/dist/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entity = exports.Table = void 0;
    var Table_1 = __importDefault(require_Table2());
    exports.Table = Table_1.default;
    var Entity_1 = __importDefault(require_Entity2());
    exports.Entity = Entity_1.default;
  }
});

// asset-input/test/functions/getItem.ts
var getItem_exports = {};
__export(getItem_exports, {
  main: () => main
});
module.exports = __toCommonJS(getItem_exports);

// asset-input/test/dynamodb-toolbox/entity.ts
var import_dynamodb_toolbox2 = __toESM(require_dist());

// asset-input/test/dynamodb-toolbox/table.ts
var import_dynamodb = require("aws-sdk/clients/dynamodb");
var import_dynamodb_toolbox = __toESM(require_dist());
var documentClient = new import_dynamodb.DocumentClient({ region: "eu-west-1" });
var TestTable = new import_dynamodb_toolbox.Table({
  name: "Test",
  partitionKey: "type",
  sortKey: "id",
  DocumentClient: documentClient
});

// asset-input/test/dynamodb-toolbox/entity.ts
var TestEntity = new import_dynamodb_toolbox2.Entity({
  name: "Test",
  attributes: {
    type: {
      partitionKey: true,
      type: "string"
    },
    id: { sortKey: true, type: "string" }
  },
  table: TestTable
});

// asset-input/test/functions/getItem.ts
var main = async ({
  type,
  id
}) => {
  const { Item } = await TestEntity.get({
    type,
    id
  });
  console.log("WOOOWOOOWOOWOOWOOWW");
  console.log("888888888888888888888888888888888888888888");
  console.log(Item);
  console.info("Item", Item);
  return (Item == null ? void 0 : Item.id) || "no item found";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 0.4.0
 * @license MIT
 */
