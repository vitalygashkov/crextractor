const { join, basename } = require('node:path');
const { createWriteStream } = require('node:fs');
const { readdir, readFile, rm } = require('node:fs/promises');
const { execSync } = require('node:child_process');
const { Readable } = require('node:stream');

const downloadLatestApk = async () => {
  const source = 'https://www.apk20.com/apk/com.crunchyroll.crunchyroid/download/';
  const page = await fetch(source);
  const html = await page.text();
  const url = html.split('<link rel="canonical" href="')[1]?.split('"')[0];
  const id = url.split('/').reverse().at(0);
  const downloadUrl = `https://srv01.apk20.com/com.crunchyroll.crunchyroid.${id}.xapk`;
  const fileName = basename(downloadUrl);
  const response = await fetch(downloadUrl);
  if (response.ok && response.body) {
    const filePath = join(process.cwd(), fileName);
    const writer = createWriteStream(filePath);
    Readable.fromWeb(response.body).pipe(writer);
    await new Promise((resolve) => writer.on('finish', resolve));
  }
  return join(process.cwd(), fileName);
};

const decompileApk = (apkPath) => {
  try {
    execSync(`jadx ${apkPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(error);
  }
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
  const header = `Basic ${encoded}`;
  return { id, secret, encoded, header };
};

export const extractSecrets = async ({ cleanup = true } = {}) => {
  console.log('Downloading latest APK...');
  const apkPath = await downloadLatestApk();

  console.log('Decompiling APK...');
  const decompiledDir = decompileApk(apkPath);

  console.log('Searching for secrets...');
  const sourcesDir = join(decompiledDir, 'sources');
  const configurationImpl = await findConfigurationImpl(sourcesDir);

  console.log('Parsing secrets...');
  const { id, secret, encoded, header } = parseSecrets(configurationImpl);

  console.log(`Cleaning up files...`);
  if (cleanup) await rm(apkPath, { recursive: true, force: true });
  if (cleanup) await rm(decompiledDir, { recursive: true, force: true });

  console.log(`ID: ${id}`);
  console.log(`Secret: ${secret}`);
  console.log(`Encoded ID with secret: ${encoded}`);

  return { id, secret, encoded, header };
};
