const {spawn} = require("child_process");
const {join, resolve} = require("path");
const {existsSync} = require("fs");

// Finding JS++
const jsppDir = resolve(join(__dirname, "bin/JS++"))
let jsppBin = null;
[
  "js++-x64", "js++",
  "js++-x64.exe", "js++.exe"
].forEach(bin => {
  let tmp_bin = join(jsppDir, bin);
  if(jsppBin == null && existsSync(tmp_bin)) {
    jsppBin = tmp_bin;
  }
});

// Cut loose the arguments that should go to JS++
// Slice for two, to skip "node" and the file.
const argv = process.argv.slice(2);

let jspp = spawn(jsppBin, argv, {
  argv0: jsppBin,
  windowsHide: true,
  stdio: "inherit"
});

// Lifecycle
jspp.on("close", code => process.exit(code));
jspp.on("error", err => process.stderr.write(err));
