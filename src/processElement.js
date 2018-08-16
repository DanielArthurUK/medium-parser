import * as  cheerio from 'cheerio';

export const processElement = element => new Promise((resolve, reject) => {
  const $ = cheerio.load(element);
  const el = $(element).get(0);

  if (el.type === 'text') {
    const text = $(el).text();
    const firstChar = text.substr(0, 1);
    if (['*', '-'].indexOf(firstChar) > -1) {
      resolve(`\\${text}`);
    } else {
      resolve(text);
    }
  } else if (el.type === 'tag') {

    if (el.name === 'figure') {
      const caption = $(el).find('figcaption').text();
      // last() because the first img is low res
      const img = $('div > img').last();
      const src = img.attr('data-src') || img.attr('src');
      resolve(`\n![${caption}](${src})`);
    } else {
      // Can't use .map() because it mutates the element
      const p = [];
      $(el).contents().each((i, e) => {
        p.push(processElement(e));
      });

      Promise.all(p).then(results => {
        const processed = results.join('');

        if (el.name === 'em' || el.name === 'i') {
          resolve(`*${processed}*`);
        } else if (el.name === 'strong' || el.name === 'b') {
          resolve(`**${processed}**`);
        } else if (el.name === 'a') {
          const href = $(el).attr('href');
          resolve(`[${processed}](${href})`);
        } else if (el.name === 'blockquote') {
          resolve(`\n> ${processed}`);
        } else if (el.name === 'h4') {
          resolve(`\n### ${processed}`);
        } else if (el.name === 'h3') {
          resolve(`\n## ${processed}`);
        } else if (el.name === 'h1') {
          resolve(`\n# ${processed}`);
        } else if (el.name === 'ul') {
          resolve(`\n${processed}`);
        } else if (el.name === 'li') {
          resolve(`\n- ${processed}`);
        } else if (el.name === 'p') {
          resolve(`\n\n${processed}`);
        } else if (el.name === 'img') {
          const alt = $(el).attr('alt') || '';
          const src = $(el).attr('src');
          resolve(`![${alt}](${src})`);
        } else if (el.name === 'div') {
          resolve(`\n${processed}`);
        } else if (['figure', 'div', 'figcaption'].indexOf(el.name) > -1) {
          resolve(`\n${processed}`);
        } else if (el.name === 'pre') {
          resolve(`\n~~~\n${processed}\n~~~\n`);
        } else {
          console.log(`parse-medium: unprocessed tag <${el.name}>`);
          resolve(`\n${processed}`);
        }
      }).catch(err => {
        reject(err);
      })
    }
  } else {
    resolve(el);
  }
});
