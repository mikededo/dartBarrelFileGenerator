import { writeFile } from 'fs';

/**
 * Creates the barrel file and writes the exports in it. If the file
 * already exists, it overrides its content
 *
 * @param directory Destination directory
 * @param folderName It will create the barrel file from the folder name
 * @param files The files of the barrel file
 */
export const generateBarrelFile = async (
  directory: string,
  folderName: string,
  files: string[]
): Promise<void> => {
  const targetPath = `${directory}/${folderName}.dart`;

  // In case the file already exists we want to override its content
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

/**
 * Generates the export string to write to the file
 *
 * @param files File names to export
 */
function _generateExports(files: string[]): string {
  files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  let exportText: string = '';
  files.forEach((fileName: string) => {
    exportText = exportText.concat(`export '${fileName}';\n`);
  });
  return exportText;
}
