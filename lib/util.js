'use strict';

const FormData = require('form-data');

const parseJSON = (string) => {
  try {
    return [null, JSON.parse(string)];
  } catch (err) {
    return [err, null];
  }
};

const objectToFormData = (data = {}) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) formData.append(key, value);
  return formData;
};

module.exports = { parseJSON, objectToFormData };
