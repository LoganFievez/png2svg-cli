var shell = require('shelljs');

/**
 *
 * @param {string} cmd
 * @param {string} comment
 * @param {boolean} silent
 * @param {boolean} checkError
 * @param {boolean} getReturnValue
 */
function executeCommand(cmd, comment, silent = true, checkError = true, getReturnValue = false) {
  if (comment) shell.exec(`echo "\\e[32m [${new Date()}] ${comment}..."`);

  const returnValue = shell.exec(`${cmd}`, { silent: silent });
  if (checkError && returnValue.code !== 0) {
    printError(returnValue.stderr);
    return undefined;
  }
  if (getReturnValue) return returnValue;
}

/**
 *
 * @param {string} message
 */
function printError(message, exit = true) {
  shell.exec(`echo "\\e[31m [${new Date()}] Error: ${message}"`);
  if (exit) shell.exit(1);
}

function printMessage(message) {
  shell.exec(`echo "\\e[32m [${new Date()}] ${message}"`);
}

/**
 *
 * @param {string} inputFolder
 */
function getEntries(inputFolder) {
  const response = executeCommand(`ls -1 ${inputFolder}`, null, true, true, true);
  if (response !== undefined) {
    const folders = response.stdout !== undefined && response.stdout !== '' ? response.stdout.split('\n') : [];
    folders.pop();
    return folders;
  }
  return [];
}

/**
 *
 * @param {any[]} object
 */
function getMaxKeys(array) {
  const maxObject = Object.assign({}, array[0]);
  for (let i = 1; i < array.length; i++) {
    if (Object.keys(maxObject).length < Object.keys(array[i]).length) maxObject = Object.assign({}, array[i]);
  }
  return Object.keys(maxObject);
}

/**
 *
 * @param {string} entry
 * @returns {boolean}
 */
function isFolder(entry) {
  return (
    executeCommand(
      `[ -d ${entry} ] && echo true || echo false`,
      `Checking if ${entry} is a folder...`,
      true,
      true,
      true
    ).stdout.trim() === 'true'
  );
}

/**
 *
 * @param {string} entry
 * @returns {boolean}
 */
function isFile(entry) {
  return (
    executeCommand(
      `[ -f ${entry} ] && echo true || echo false`,
      `Checking if ${entry} is a file...`,
      true,
      true,
      true
    ).stdout.trim() === 'true'
  );
}

module.exports.executeCommand = (cmd, comment, silent = true, checkError = true, getReturnValue = false) =>
  executeCommand(cmd, comment, silent, checkError, getReturnValue);
module.exports.printError = (message, exit = true) => printError(message, exit);
module.exports.printMessage = message => printMessage(message);
module.exports.getEntries = inputFolder => getEntries(inputFolder);
module.exports.getMaxKeys = array => getMaxKeys(array);
module.exports.isFile = entry => isFile(entry);
module.exports.isFolder = entry => isFolder(entry);
