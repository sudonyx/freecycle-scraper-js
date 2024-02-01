import { createRequire } from "module";
const require = createRequire(import.meta.url);
const https = require('https');
import { parse } from 'node-html-parser';

const options = {
  hostname: 'www.freecycle.org',
  port: 443,
  path: `/town/SuttonUK`,
  method: 'GET',
}

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const root = parse(data)
    const fcData = JSON.parse(root.querySelector('fc-data').attributes[':data']);

    let posts = {};

    fcData['posts'].forEach(post => {
      if (post['type']['name'] === 'OFFER') {
        posts[post['id']] = {
          'Item' : post['subject'],
          'Description' : post['description']
        }
      }
    });

    console.log(posts);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end()
