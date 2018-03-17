const { readFileSync, readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const puzzleDir = join(__dirname, '../puzzles');
const outPath = join(__dirname, '../src/state/grid/puzzles.js');

const parsePuzzleDir = () => {
  const paths = readdirSync(puzzleDir).map(name => join(puzzleDir, name));
  const parsedFiles = paths.map(parseFile);
  const result = `export default ${JSON.stringify(parsedFiles)};`;

  writeFileSync(outPath, result);
};

const parseFile = path => {
  const lines = readFileSync(path)
    .toString()
    .split(/\r\n|\n\r|\n|\r/)
    .filter(a => !!a.length);

  const data = {};
  let i = 0;
  let line;

  const parseString = line => line.match(/\"(.*)\"$/)[1];
  const parseNumber = line => Number(line.match(/(\d+)/)[1]);

  const parseHints = count => {
    const data = [];

    for (let j = 0; j < count; j++) {
      data.push(lines[i + j + 1].split(',').map(Number));
    }

    i += count;

    return data;
  };

  for (; i < lines.length; i++) {
    line = lines[i];
    const command = line.split(' ')[0];

    switch (command) {
      case 'catalogue':
      case 'title':
      case 'by': {
        data[command] = parseString(line);
        break;
      }

      case 'height':
      case 'width': {
        data[command] = parseNumber(line);
        break;
      }

      case 'rows': {
        data.rows = parseHints(data.height);
        break;
      }

      case 'columns': {
        data.columns = parseHints(data.width);
        break;
      }
    }
  }

  const result = {
    author: data.by,
    title: data.title,
    height: data.height,
    width: data.width,
    blocksH: data.rows,
    blocksV: data.columns,
  };

  result.colors = { 1: 'black' };
  result.colorsH = result.blocksH.map(r => r.map(() => 1));
  result.colorsV = result.blocksV.map(r => r.map(() => 1));

  return result;
};

parsePuzzleDir();
