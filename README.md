# PROOF OF CONCEPT
## Using [JS++](https://onux.com/jspp/) with [WebPack](http://webpack.js.org)

This tiny proof of concept does:
- Provide `scripts/get_jspp.js`, which will download the latest JS++ binary into a locally created `bin/` folder.
- Execute the above script upon this package being installed.
- Provide a small NPM script that will run JS++ on `index.jspp`, then forward the output to WebPack and produce `index.out.js`.

How to reproduce this concept:
1. Clone this repository.
2. `cd` into it and execute `npm install .`.
3. Run `npm test`.
4. Inspect the output of `index.out.js`.

Essentially, JS++ is tricked into treating `require()` as an external variable - which effectively leaves calls to it within the source code. The output of that compilation is then given to WebPack as an entry. WebPack picks up the `require()` calls, and translates them, inlining `someModule.js` into the build.

You can run this too: `node ./index.out.js`
This should produce something similar to this:

```
$ node ./index.out.js
4
```

It should be noted, that this configuration to WebPack will leave the modules' original reqiure strings intact - during a production build however, those would be replaced by numers instead.
