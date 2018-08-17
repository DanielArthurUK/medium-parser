/* eslint-disable import/no-extraneous-dependencies */
import test from 'tape-promise/tape';
import fs from 'fs';
import path from 'path';
import parse from '../index';
import processElement from '../processElement';


test('processing of html tags', (t) => {

  const buildProcessElementTest = (html, expected, message) => processElement(html)
    .then((actual) => {
      t.equal(actual, expected, message);
    });

  let html;
  let expected;
  let message;

  const tests = [];

  html = '<strong>Para<em>graph</em></strong>';
  expected = '**Para*graph***';
  message = 'should accept recursive tags';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<blockquote>* Awesome</blockquote>';
  expected = '\n> \\* Awesome';
  message = 'should escape *';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<blockquote>- Awesome</blockquote>';
  expected = '\n> \\- Awesome';
  message = 'should escape -';
  tests.push(buildProcessElementTest(html, expected, message));

  // Tags

  html = '<p>Paragraph</p>';
  expected = '\n\nParagraph';
  message = 'should accept <p>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<em>graph</em>';
  expected = '*graph*';
  message = 'should accept <em>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<strong>graph</strong>';
  expected = '**graph**';
  message = 'should accept <strong>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<a href="http://medium.com">Medium</a>';
  expected = '[Medium](http://medium.com)';
  message = 'should accept <a>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<blockquote>This is fun</blockquote>';
  expected = '\n> This is fun';
  message = 'should accept <blockquote>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<h4>Subtitle</h4>';
  expected = '\n### Subtitle';
  message = 'should accept <h4>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
  expected = '\n\n- Item 1\n- Item 2';
  message = 'should accept <ul> and <li>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<img src="http://google.com/doodle.jpg" alt="Doodle" />';
  expected = '![Doodle](http://google.com/doodle.jpg)';
  message = 'should accept <img>';
  tests.push(buildProcessElementTest(html, expected, message));

  html = '<figure><div><img data-src="http://google.com/doodle.jpg" /><img data-src="http://google.com/secondDoodle.jpg" /></div><figcaption>Cool</figcaption></figure>';
  expected = '\n![Cool](http://google.com/secondDoodle.jpg)';
  message = 'should accept <figure> and get second img b/c first is low-res';
  tests.push(buildProcessElementTest(html, expected, message));

  html = `<pre>function add (a, b) {
      return a + b;
  }</pre>`;
  expected = `\n~~~\nfunction add (a, b) {
      return a + b;
  }\n~~~\n`;
  message = 'should accept <pre>';
  tests.push(buildProcessElementTest(html, expected, message));

  return Promise.all(tests);
});

test('processing the html of an medium post', (t) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../mocks/dan.html'), 'utf-8');
  return parse(html).then((post) => {
    const expected = fs.readFileSync(path.resolve(__dirname, '../../mocks/dan.md'), 'utf-8');
    t.equal(post.markdown, expected, 'should parse local article successfully');
    t.equal(post.title, 'Presentational and Container Components', 'should parse for title');
  });
});

test('processing the html of a medium post with Gists', (t) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../mocks/lavrton.html'), 'utf-8');
  return parse(html).then((post) => {
    const expected = fs.readFileSync(path.resolve(__dirname, '../../mocks/lavrton.md'), 'utf-8');
    t.equal(post.markdown, expected, 'should parse local article with gists successfully');
    t.equal(post.title, 'Tips to optimise rendering of a set of elements in React', 'should parse for title');
  });
});
