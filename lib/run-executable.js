const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const config = require('./config');

/**
 * Spawns a child process to run the Theme Kit executable with given parameters
 * @param {string[]}  args      array to pass to the executable
 * @param {string}    cwd       directory to run command on
 * @param {string}    logLevel  level of logging required
 */
function runExecutable(args, cwd, logLevel) {
  const logger = require('./logger')(logLevel);
  return new Promise((resolve, reject) => {
    logger.silly('Theme Kit command starting');
    let errors = '';

    const pathToExecutable = path.join(config.destination, config.binName);
    fs.statSync(pathToExecutable);

    const childProcess = spawn(pathToExecutable, args, {
      cwd,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    if(childProcess.pid){
      resolve({childProcess});
    }

    childProcess.on('error', (err) => {
      errors += err;
    });

    childProcess.stderr.on('data', (err) => {
      errors += err;
    });

    childProcess.on('close', () => {
      logger.silly('Theme Kit command finished');
      if (errors) {
        reject(errors);
      }
      resolve({childProcess});
    });
  });
}

module.exports = runExecutable;
