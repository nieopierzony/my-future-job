'use strict';

const cheerio = require('cheerio');
const { fetch } = require('./network');
const { objectToFormData } = require('./util');

const BASE_URL = `https://registry.edbo.gov.ua`;
const REQUEST_URL = `${BASE_URL}/search/`;

const parseUniversities = async (specialityId) => {
  if (!specialityId) throw new TypeError('SpecialityID is not provided');
  const formData = objectToFormData({ 'specialities[]': specialityId, 'speciality-kind': 1 });
  const body = formData.getBuffer().toString();
  const requestOptions = { body, headers: formData.getHeaders(), method: 'POST' };
  const res = await fetch(REQUEST_URL, requestOptions);
  const $ = cheerio.load(res);
  const children = $('#universities').children();
  const universities = [];
  let lastLocality = '';
  children.each((i, element) => {
    const parsedElement = $(element);
    const classList = parsedElement.attr('class');
    if (classList?.includes('locality')) return (lastLocality = parsedElement.text().trim());
    else if (!classList?.includes('university')) return null;
    const nameElement = parsedElement.find('.university-name');
    const name = nameElement.text().trim();
    const href = nameElement.attr('href');
    const urlPath = `${BASE_URL}${href}`;
    universities.push({ name, urlPath, locality: lastLocality });
    return true;
  });
  return universities;
};

module.exports = { parseUniversities };
