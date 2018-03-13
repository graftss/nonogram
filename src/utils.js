import {
  zipObj,
} from 'ramda';

export const keyMirror = keys => zipObj(keys, keys);

export const argCreator = (type, props) => (...args) => ({
  type,
  payload: zipObj(props, args),
});

export const constantCreator = type => () => ({ type });
