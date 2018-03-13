import {
  assoc,
  compose,
  curry,
  intersection,
  keys,
  map,
  mapObjIndexed,
  path,
  reduce,
  useWith,
} from 'ramda';
import { connect } from 'react-redux';

const pickDefined = curry((props, obj) => reduce(
  (result, prop) => {
    if (!obj[prop]) {
      throw new Error(`prop "${prop}" not found`);
    } else {
      return assoc(prop, obj[prop], result);
    }
  },
  {},
  props,
));

const injectSubstates = (selectorMap, propPath = []) => (
  mapObjIndexed(
    (selector, prop) => (
      typeof selector === 'object' ?
        injectSubstates(selector, [...propPath, prop]) :
        useWith(selector, [path(propPath)])
    ),
    selectorMap,
  )
);

const flattenSelectorMap = selectorMap => (
  reduce(
    (result, prop) => {
      const selector = selectorMap[prop];
      const addition = typeof selector === 'object' ?
        flattenSelectorMap(selector) :
        { [prop]: selector };

      const duplicateProps = intersection(keys(result), keys(addition));
      if (duplicateProps.length > 0) {
        throw new Error(`Duplicate selector names: ${duplicateProps.join(' ')}`);
      }

      return { ...result, ...addition };
    },
    {},
    keys(selectorMap),
  )
);

const include = list => list && list.length > 0;

export default ({ actions: allActions, selectors: allSelectors } = {}) => {
  const mappedSelectors = compose(
    flattenSelectorMap,
    injectSubstates,
  )(allSelectors);

  const pickSelectors = curry((selectors, state) => (
    map(selector => selector(state), pickDefined(selectors, mappedSelectors))
  ));

  const pickActions = actions => pickDefined(actions, allActions);

  return ({ actions, selectors } = {}) => (
    connect(
      include(selectors) ? pickSelectors(selectors) : undefined,
      include(actions) ? pickActions(actions) : undefined
    )
  );
};
