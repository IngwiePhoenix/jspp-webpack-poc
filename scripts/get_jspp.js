/**
 * @file
 * Download JS++ binary and make it available as a binary.
 *
 * @author Kevin Ingwersen
 * @license See package.json
 */

const {arch, platform} = require("os");
const path = require("path");
const fs = require("then-fs");
const childProcess = require("child_process");
const dirExists = require("directory-exists");
const fileExists = require("utils-fs-exists");
const mkdir = require("mkdir-promise");
const download = require("download");
const decompress = require("decompress");

let binDir = path.resolve(path.join(__dirname, "../bin"));
const binExt = platform() == "win32" ? ".exe" : "";

/**
 * The entrypoint of this file.
 * THIS IS NOT A GOOD WAY TO DO THIS! I am abusing IIFEs here, which is quite
 * frankly speaking "out of convention". In this case, I want to use `await`,
 * so I have to use an async function. Therefore I use this. Do not do this.
 */
(async function main(_arch, _platform) {

  var urlBase = "https://www.onux.com/jspp/download/latest/";

  if(_platform == "darwin") {
    // MacOS does not use any specific architecture identifier. Therefore, we
    // short-circuit this rather fast.
    _platform = "macosx";
    _arch = "";
  } else {
    // Platform check
    // JS++ only supports macOS, Linux or Windows.
    if(!["win32", "darwin", "linux"].includes(_platform)) {
      throw new Error([
        "JS++ does not support your OS.",
        "Either 'win32', 'darwin' or 'linux' was expected - but '" + _platform + "' was found instead."
      ].join(" "));
    }

    // "win3264" would not be valid for the URL. Reformat that.
    if(_platform == "win32") {
      _platform = "win"
    }

    // Architecture check
    // os.arch() returns either one of these:
    //   'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390',
    //   's390x', 'x32', and 'x64'
    // JS++ only runs on either 32-bit or 64-bit. So we only look for those.
    // @see https://nodejs.org/api/os.html#os_os_arch
    if(_arch == "x64") {
      _arch = "64"
    } else if(_arch == "ia32") {
      _arch = "32"
    } else {
      throw new Error([
        "This platform is not supported by JS++!",
        "Either 'x64' or 'ia32' was expected - but '"+ _arch + "' was found instead."
      ].join(" "));
    }
  }

  // Create folder, if it does not exist.
  let binDirExists = await dirExists(binDir);
  if(!binDirExists) {
    await mkdir(binDir);
  }

  urlBase += _platform + _arch;

  console.log("Downloading from: "+urlBase);

  let data = await download(urlBase);
  let decompressed = await decompress(data, binDir);

  // JS++'s archive contains a "JS++" folder.
  // We need to append that to the "search path".
  binDir = path.join(binDir, "JS++");

  [
    "js++-x64", "js++",
    "js++-x64.exe", "js++.exe"
  ].forEach((binName) => {
    let jsppExists = fileExists.sync(path.join(binDir, binName));
    if(jsppExists) {
      let version = childProcess.execSync([
        // Cheap escape...
        '"' + path.join(binDir, binName) + '"',
        "--version"
      ].join(" "));
      version = version.toString("utf8").trim();
      console.log("Installed: "+version);
      process.exit(0);
    }
  })
})(arch(), platform()).catch(e => {
  console.log(e);
  process.exit(1);
})
