# @flesch/http-logger

`http-logger` is a marriage between [morgan](https://github.com/expressjs/morgan) and [bunyan](https://github.com/trentm/node-bunyan).

:warning: Use with caution. This is a work in progress, hence why it's namespaced. I'll make it work good and think of a clever name.

## Installation

```bash
$ npm install --save @flesch/http-logger
```

## Basic Usage

```javascript
// server.js

'use strict';

import express from 'express';
import reqid from 'express-request-id';
import httplogger from '@flesch/http-logger';

httplogger.token(':id', (req, res) => {
  return req.id;
});

const app = express();

app.use(reqid());
app.use(httplogger({ meta:{ 'request-id':':id' } }));

app.get('/', (req, res, next) => {
  res.send('Hi, mom!');
});

app.listen(3000);
```

```bash
$ babel-node server.js | bunyan -o short
```

## Options

You can pass `http-logger` an object of optional options:

* **meta**: An object added to bunyan. Each key's value is passed through morgan's token formatter.
* **format**: A morgan log format string.
* **logger**: An existing bunyan instance. The module will create one if null, but that will let you adjust where logs are streamed.

## License

[The MIT License (MIT)](http://flesch.mit-license.org/)

Copyright © 2015 John Flesch, [http://fles.ch](http://fles.ch/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.