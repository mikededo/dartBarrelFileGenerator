import { existsSync, writeFile } from 'fs';

export const generateBarrelFile = async (
  directory: string,
  folderName: string,
  files: string[]
) => {
  const targetPath = `${directory}/${folderName}.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${folderName}.dart already exists`);
  }

  return new Promise(async (resolve, reject) => {
    writeFile(targetPath, _generateExports(files), 'utf8', (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

function _generateExports(files: string[]): string {
  files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  let exportText: string = '';
  files.forEach((fileName: string, i) => {
    console.log(i);
    exportText = exportText.concat(`export '${fileName}';\n`);
    console.log(exportText.replace('\\n', '.'));
  });
  return exportText;
}
