import { processElement } from './processElement.js';
import * as cheerio from 'cheerio';

const parseMedium = html => {
  const $ = cheerio.load(html);
  const title = $('h3').first().text();
  const content = $('.section-inner').html();
  // const markdown = processElement(content);
  const markdown = $('.section-inner').contents().toArray().map(processElement).join('\n').replace(/\n\n\n/g, '\n\n');
  return {
    title,
    markdown,
  };
};

export default parseMedium;