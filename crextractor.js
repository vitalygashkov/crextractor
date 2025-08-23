const { join } = require('node:path');
const { readdir, readFile, writeFile, rm } = require('node:fs/promises');
const { download } = require('molnia');

const downloadLatestApk = async () => {
  const source = 'https://apkcombo.com/crunchyroll/com.crunchyroll.crunchyroid/download/apk';
  const page = await fetch(source);
  const html = await page.text();
  const route = '/r2' + html.split('/r2')[1]?.split('"')[0];
  const url = `https://apkcombo.com${route}`;
  const filepath = join(process.cwd(), 'crunchyroll.xapk');
  await download(url, {
    output: filepath,
    onProgress: (progress) => console.log(progress),
    onError: (error) => console.error(error),
  });
  return filepath;
};

const decompileApk = (apkPath) => {
  try {
    execSync(`jadx ${apkPath}`, { stdio: 'inherit' });
  } catch (error) {}
  return apkPath.replace('.xapk', '');
};

const findConfigurationImpl = async (sourcesDir) => {
  const entries = await readdir(sourcesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const moduleDir = join(sourcesDir, entry.name);
    const moduleEntries = await readdir(moduleDir, { withFileTypes: true });
    for (const moduleFile of moduleEntries) {
      if (moduleFile.isDirectory()) continue;
      const moduleFilePath = join(moduleDir, moduleFile.name);
      const moduleContents = await readFile(moduleFilePath, 'utf8');
      if (moduleContents.includes(' ConfigurationImpl.kt')) {
        return moduleContents;
      }
    }
  }
};

const parseSecrets = (contents) => {
  const lines = contents.split('\n');
  const startIndex = lines.findIndex((line) => line.includes('https://sso.crunchyroll.com'));
  const endIndex = lines.findIndex((line) => line.includes('CR-AndroidMobile-SSAI-Prod'));
  const results = lines
    .slice(startIndex, endIndex)
    .map((line) => line.replaceAll(';', ''))
    .map((line) => line.replaceAll('"', ''))
    .map((line) => line.split('= ')[1])
    .map((line) => line.trim());
  const [, , id, secret] = results;
  const encoded = Buffer.from(`${id}:${secret}`).toString('base64');
  const authorization = `Basic ${encoded}`;
  return { id, secret, encoded, authorization };
};

const extractSecrets = async ({ output, cleanup = true } = {}) => {
  console.log('Downloading latest APK...');
  const apkPath = await downloadLatestApk();

  console.log('Decompiling APK...');
  const decompiledDir = decompileApk(apkPath);

  console.log('Searching for secrets...');
  const sourcesDir = join(decompiledDir, 'sources');
  const manifest = require(join(sourcesDir, 'resources', 'manifest.json'));
  const version = manifest.version_name;
  const configurationImpl = await findConfigurationImpl(sourcesDir);
  if (!configurationImpl) throw new Error('Could not find ConfigurationImpl.kt');

  console.log('Parsing secrets...');
  const { id, secret, encoded, authorization } = parseSecrets(configurationImpl);

  console.log(`Cleaning up files...`);
  if (cleanup) await rm(apkPath, { recursive: true, force: true });
  if (cleanup) await rm(decompiledDir, { recursive: true, force: true });

  console.log(`Version: ${version}`);
  console.log(`ID: ${id}`);
  console.log(`Secret: ${secret}`);
  console.log(`Encoded ID with secret: ${encoded}`);
  console.log(`Authorization: ${authorization}`);

  if (output) {
    await writeFile(output, JSON.stringify({ version, id, secret, encoded, authorization }, null, 2));
  }

  return { version, id, secret, encoded, authorization };
};

module.exports = { extractSecrets };
