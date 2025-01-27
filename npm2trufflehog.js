const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

// Path to the file containing package names
const packageFilePath = '/packages.txt';

async function readPackagesFromFile(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');

        return data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Ignore empty lines and comments
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        throw error;
    }
}

async function installPackages(packages) {
    let counter  = 0;
    let newPackageName = "";

    try {
        for (const packageName of packages) {
            counter++;
            console.log(`[${counter}/${packages.length}] Installing ${packageName}...`);

            newPackageName = `trufflehog-${counter}@npm:${packageName}`;

            const { stdout, stderr } = await execPromise(`npm --no-update-notifier --no-audit --no-fund install ${newPackageName}`);
            
            if (stderr) {
                console.error(`stderr for ${packageName}:`, stderr);
            } else {
                console.log(`Successfully installed ${newPackageName}:`);
                console.log(stdout);
            }
        }
    } catch (error) {
        console.error(`Error:`, error.message);
    }
}

async function runTrufflehog() {
    try {
        console.log("Running trufflehog...");
        const { stdout: trufflehogStdout, stderr: trufflehogStderr } = await execPromise(`trufflehog --no-verification filesystem ./node_modules/trufflehog*`);
        
        console.error(`stderr:`, trufflehogStderr);
        console.log(trufflehogStdout);
    } catch (error) {
        console.error(`Error:`, error.message);
    } 
}

(async function main() {
    try {
        const packages = await readPackagesFromFile(packageFilePath);

        if (packages.length === 0) {
            console.log('No packages to install. Make sure the file is not empty.');
            return;
        }

        console.log(`Packages to install: ${packages.join(', ')}`);
        await installPackages(packages);
        await runTrufflehog();
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
})();
