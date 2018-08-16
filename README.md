# medium-parser

A simple parser for Medium (html) into Markdown.

## Example usage

`npm install medium-parser`

then

```js
import parse from 'medium-parser';

parse(htmlAsString).then(post => {
  /*
    post == {
      title: 'Post title',
      markdown: '# Markdown\nAs string...',
    }
  */
})

```

medium-parser can also be used with `fetch` to get a Medium article from its URL and then be parsed:

```js

fetch('https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0')
  .then(res => parse(res))
  .then(post => {
    /*
      post == {
        title: 'Post title',
        markdown: '# Markdown\nAs string...',
      }
    */
  })

```

## License

MIT [http://gunar.mit-license.org]()
