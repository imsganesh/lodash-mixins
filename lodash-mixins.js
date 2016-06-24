//import * from 'lodash';

/**
 * Flatten the object by remove the parent objects and return only the leaf objects
 * e.g., obj = {key1: {key2: [{'name': 'Hello'}, {'prop': 'World'}]}}
 * invoke -> flattenObjectDeep(obj, {});
 * returns => [{'name': 'Hello'}, {'prop': 'World'}]
 */
function flattenObjectDeep(x, result, prefix) {
  if (!isObject(x)) {
    result[prefix] = x
  } else {
    forEach(x, (v, k) => {
      this.flattenObjectDeep(v, result, k)
    })
  }
  return result;
};


/**
 * Flattens/Compacts the individual key/values pairs from the array of objects to a single object
 * @param Array
 * @private
 * e.g., arr = [{Key: 'RandomKey1', Value: 'Random Value 1'}, {Key: 'RandomKey2', Value: true}, {Key: 'RandomKey3', Value: 100}]
 * returns => { RandomKey1: 'Random Value 1', RandomKey2: true, RandomKey3: 100 }
 * */
function flattenKeyValuePairs(arr, keyProp = 'Key', valueProp = 'Value') {
  let comp = {};
  if (isArray(arr)) {
    forEach(arr, (item) => {
      comp[item[keyProp]] = item[valueProp];
    });
  }
  else if (isObject(arr)) {
    comp[arr[keyProp]] = arr[valueProp];
  }
  return comp;
}


/**
 * Renames the keys in a deeply nested object with the given keyMap lookup
 * @param obj
 * @param keyMap
 * @returns {object} a transformed object with the keys replaced
 * e.g., obj = {key1: {key2: [ {'id': 1, 'text': 'hello'}, {'id': 2, 'text': 'world'} ] }} &
 * keyMap = {'id': 'uid', 'text':'name'}
 * returns => {key1: {key2: [ {'uid': 1, 'name': 'hello'}, {'uid': 2, 'name': 'world'} ] }}
 */
function renameKeysDeep(obj, keyMap) {
  return forEach(obj, (value, key) => {
    if (keyMap[key]) {
      obj[keyMap[key]] = obj[key];
      delete obj[key];
    }
    if (isArray(value) || isObject(value)) {
      return this.renameKeysDeep(value, keyMap);
    }
  });
};


/**
 * Compares 2 objects and returns the difference as a new object
 * @param obj
 * @param origObj
 * @returns {*}
 */
function objectDiff(obj, origObj) {
  return _.omit(obj, function (v, k) {
    return origObj[k] === v || _.isObject(v);
  }, this);
}


/**
 * Compact object by removing all empty objects
 * var o = { 'Borrower': 'Test', 'Apps': [{}, {'id':1, 'name': 'test' }, {}, {'id': 3, 'name': 'test3'}], 'Prop': {}, 'Rate': 10, 'Pblank': [{ Cblank:[{},{}] }] }
 * Returns -> // { 'Borrower': 'Test', 'Apps': [{'id':1, 'name': 'test' }, {'id': 3, 'name': 'test3'}], 'Rate': 10, 'Pblank':[{}] }
 */
function compactObject(o) {
  forEach(o, (v, k) => {
    if (isArray(v)) {
      if (v.length < 1) {
        delete o[k];
      }
      else {
        o[k] = filter(v, (item) => {
          return !isEmpty(item);
        });
        o[k].length < 1 ? delete o[k] : this.compactObject(o[k]);
      }
    }
    else if (_.isObject(v)) {
      isEmpty(v) ? delete o[k] : this.compactObject(v);
    }
  });
  return o;
}

/**
 * Compact object by removing all empty objects (same as above), but reiterate until all empty objects and arrays are removed
 * var o = { 'Borrower': 'Test', 'Apps': [{}, {'id':1, 'name': 'test' }, {}, {'id': 3, 'name': 'test3'}], 'Prop': {}, 'Rate': 10, 'Pblank': [{ Cblank:[{},{}] }] }
 * Returns -> // { 'Borrower': 'Test', 'Apps': [{'id':1, 'name': 'test' }, {'id': 3, 'name': 'test3'}], 'Rate': 10 }
 * invoke -> compactObjectDeep(o, o); 
 */
var re = false;
function compactObjectDeep(o, orig) {
  _.forEach(o, function(v, k) {
    if(_.isArray(v)){
      if(v.length < 1) {
        delete o[k];
      }
      else {
        o[k] = _.filter(v, function(item){
          return !_.isEmpty(item);
        });        
        o[k].length < 1 ? (re = true && delete o[k]) : compact(o[k], orig);
      }
    }
    else if (_.isObject(v)) {
      _.isEmpty(v) ? (re = true && delete o[k]) : compact(v, orig);
    }
  });
  if(re){
    re = false;
    compact(orig, orig);
  }  
  return o;
}
