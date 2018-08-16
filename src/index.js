import { processElement } from './processElement.js';
import * as cheerio from 'cheerio';

const parseMedium = html => new Promise((resolve, reject) => {
  const $ = cheerio.load(html);
  const title = $('h1').first().text();
  const content = $('.section-inner').html();
  // const markdown = processElement(content);
  const elements = $('.section-inner').contents().toArray().map(processElement);
  Promise.all(elements).then(results => {
    const markdown = results.join('\n').replace(/\n\n\n/g, '\n\n');
    resolve({
      title,
      markdown,
    });
  })
});

export default parseMedium;