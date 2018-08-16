import * as cheerio from 'cheerio';
import processElement from './processElement';

const parseMedium = html => new Promise((resolve, reject) => {
  const $ = cheerio.load(html);
  const title = $('h1').first().text();
  const elements = $('.section-inner').contents().toArray().map(processElement);
  Promise.all(elements).then((results) => {
    const markdown = results.join('\n').replace(/\n\n\n/g, '\n\n');
    resolve({
      title,
      markdown,
    });
  }).catch((err) => {
    reject(err);
  });
});

export default parseMedium;
