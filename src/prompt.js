'use strict';

const readline = require('node:readline/promises');

async function confirm(question, { defaultYes = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const suffix = defaultYes ? '(Y/n)' : '(y/N)';
    const answer = (await rl.question(`${question} ${suffix} `)).trim().toLowerCase();
    if (!answer) return defaultYes;
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

module.exports = { confirm };
