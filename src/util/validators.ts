import { CustomValidator } from 'express-validator';
import Error from '../types/error';

export const isABN: CustomValidator = (value: string) => {
  const weightingFactors = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const abn = value.replace(/ /g, '');
  const digits = [...abn];
  let sum = 0;
  let position = 0;
  digits.forEach((digit) => {
    let weightDigit = 0;
    if (position === 0) {
      weightDigit = (parseInt(digit, 10) - 1) * weightingFactors[position];
    } else {
      weightDigit = parseInt(digit, 10) * weightingFactors[position];
    }
    sum += weightDigit;
    position += 1;
  });
  const remainder = sum / 89;
  if (remainder % 1 !== 0) {
    return false;
  }
  return true;
};

export const isAddress = (address: string, suburb: string, state: string,
  postCode: string): Array<Error> => {
  const errors: Array<Error> = [];
  if (!address && !suburb && !state && !postCode) {
    return errors;
  }
  if (!address) {
    errors.push({
      value: address, msg: 'Address is required in address.', param: 'address', location: 'body',
    });
  }
  if (!suburb) {
    errors.push({
      value: suburb, msg: 'Suburb is required in address.', param: 'suburb', location: 'body',
    });
  }
  if (!state) {
    errors.push({
      value: state, msg: 'State is required in address.', param: 'state', location: 'body',
    });
  }
  if (!postCode) {
    errors.push({
      value: postCode, msg: 'Postcode is required in address.', param: 'postCode', location: 'body',
    });
  }
  return errors;
};

export const isPrice: CustomValidator = (value: string) => {
  const price = value.replace(/[^0-9.]+/g, '');
  if (!Number.isNaN(parseFloat(price))) {
    return true;
  }
  return false;
};

export const isStatus: CustomValidator = (value: string) => {
  const status = ['cart', 'closed', 'delivered', 'open', 'paid', 'ready', 'received'];
  if (status.some((state) => value === state)) {
    return true;
  }
  return false;
};
