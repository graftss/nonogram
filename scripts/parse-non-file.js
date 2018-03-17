const { readFileSync, writeFileSync } = require('fs');

const path = process.argv[2];
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
  height: data.height,
  width: data.width,
  blocksH: data.rows,
  blocksV: data.columns,
};

result.colors = { 1: 'black' };
result.colorsH = result.blocksH.map(r => r.map(() => 1));
result.colorsV = result.blocksV.map(r => r.map(() => 1));

writeFileSync('./puzzle.js', JSON.stringify(result));
