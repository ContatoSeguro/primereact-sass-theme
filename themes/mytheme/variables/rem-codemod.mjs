import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATHS = [
    join(__dirname, '_button.scss'),
    join(__dirname, '_chip.scss'),
    join(__dirname, '_data.scss'),
    join(__dirname, '_form.scss'),
    join(__dirname, '_general.scss'),
    join(__dirname, '_media.scss'),
    join(__dirname, '_menu.scss'),
    join(__dirname, '_message.scss'),
    join(__dirname, '_misc.scss'),
    join(__dirname, '_overlay.scss'),
    join(__dirname, '_panel.scss'),
];

const PREVIOUS_REM_TO_PX = 14;
const NEW_REM_TO_PX = 10;

const convertPreviousToNewRem = (remValue) => {
    const oldPxValue = remValue * PREVIOUS_REM_TO_PX;

    const newRemValue = oldPxValue / NEW_REM_TO_PX; 

    return parseFloat(newRemValue.toFixed(4));
};

const REGEX = /(?:\d*\.\d+|\d+)rem/g;

const ERRORS = [];
const SUCCESSES = [];

async function updateFileRemValues(path) {
    try {
        const data = await readFile(path, 'utf-8');

        const logs = [];

        const updatedData = data.replace(REGEX, (remValue) => {
            const value = parseFloat(remValue.replace(/rem$/, ''));

            const newValue = convertPreviousToNewRem(value);

            const newRemValue = `${newValue}rem`;

            logs.push({ remValue, value, newValue, newRemValue })

            return newRemValue;
        });

        await writeFile(path, updatedData, 'utf8')
    
        return SUCCESSES.push([path, logs]);
    } catch (err) {
        return ERRORS.push([path, err]);
    }
}

async function main() {
    await Promise.all(PATHS.map(updateFileRemValues));

    console.dir(SUCCESSES, { depth: null });
    console.dir(ERRORS, { depth: null });
};

main();
