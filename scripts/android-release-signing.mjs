/**
 * After `expo prebuild`, makes release builds use the Play upload key and sets
 * the version code. Used by .github/workflows/android-apk.yml.
 *
 *   node scripts/android-release-signing.mjs <versionCode> [keystorePath]
 *
 * The key password comes from the UPLOAD_KEY_PASSWORD environment variable and
 * never enters a file. Without a keystore path, signing is left as generated
 * (debug key), which is fine for side-loading but not for the Play Store.
 */
import fs from 'node:fs';
import path from 'node:path';

const [versionCode, keystore] = process.argv.slice(2);
if (!/^\d+$/.test(versionCode ?? '')) throw new Error('Usage: android-release-signing.mjs <versionCode> [keystorePath]');

const file = 'android/app/build.gradle';
let gradle = fs.readFileSync(file, 'utf8');

const replaceOnce = (from, to) => {
  const count = gradle.split(from).length - 1;
  if (count !== 1) throw new Error(`Expected exactly one "${from.trim().slice(0, 40)}…" in ${file}, found ${count}`);
  gradle = gradle.replace(from, to);
};

gradle = gradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);

if (keystore) {
  const store = path.resolve(keystore).split(path.sep).join('/');
  replaceOnce(
    '    signingConfigs {\n',
    `    signingConfigs {
        release {
            storeFile file('${store}')
            storePassword System.getenv('UPLOAD_KEY_PASSWORD')
            keyAlias 'upload'
            keyPassword System.getenv('UPLOAD_KEY_PASSWORD')
        }
`,
  );
  replaceOnce(
    '            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.debug\n',
    '            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.release\n',
  );
}

fs.writeFileSync(file, gradle);
console.log(`versionCode ${versionCode}; release signing: ${keystore ? 'upload key' : 'debug key'}`);
