// GENERATED FROM CHAT.OPENAI.COM

import { readFileSync } from 'fs';

// Read in the input from input.txt
const input = readFileSync('input.txt', 'utf-8');

// Split the input into an array of binary numbers
const numbers = input.split('\n').filter((n) => n !== '');

// Compute the gamma rate and epsilon rate
const gammaRate = numbers.reduce((gamma, number) => {
  let gammaString = '';
  for (let i = 0; i < number.length; i++) {
    const bit = number[i];
    const ones = numbers.filter((n) => n[i] === '1').length;
    const zeros = numbers.filter((n) => n[i] === '0').length;
    if (ones > zeros) {
      gammaString += '1';
    } else {
      gammaString += '0';
    }
  }
  return gammaString;
}, '');

const epsilonRate = numbers.reduce((epsilon, number) => {
  let epsilonString = '';
  for (let i = 0; i < number.length; i++) {
    const bit = number[i];
    const ones = numbers.filter((n) => n[i] === '1').length;
    const zeros = numbers.filter((n) => n[i] === '0').length;
    if (ones < zeros) {
      epsilonString += '1';
    } else {
      epsilonString += '0';
    }
  }
  return epsilonString;
}, '');

// Convert the gamma rate and epsilon rate to decimal
const gammaRateDecimal = parseInt(gammaRate, 2);
const epsilonRateDecimal = parseInt(epsilonRate, 2);

// Compute the power consumption by multiplying the gamma rate and epsilon rate
const powerConsumption = gammaRateDecimal * epsilonRateDecimal;

console.log(powerConsumption);

// Compute the oxygen generator rating and CO2 scrubber rating
let oxygenGeneratorRating = numbers;
let co2ScrubberRating = numbers;

for (let i = 0; i < gammaRate.length; i++) {
  const ones = oxygenGeneratorRating.filter((n) => n[i] === '1').length;
  const zeros = oxygenGeneratorRating.filter((n) => n[i] === '0').length;
  if (ones > zeros) {
    oxygenGeneratorRating = oxygenGeneratorRating.filter((n) => n[i] === '1');
  } else if (ones < zeros) {
    oxygenGeneratorRating = oxygenGeneratorRating.filter((n) => n[i] === '0');
  } else {
    oxygenGeneratorRating = oxygenGeneratorRating.filter((n) => n[i] === '1');
  }
  if (oxygenGeneratorRating.length === 1) {
    oxygenGeneratorRating = parseInt(oxygenGeneratorRating[0], 2);
    break;
  }
}

for (let i = 0; i < gammaRate.length; i++) {
  const ones = co2ScrubberRating.filter((n) => n[i] === '1').length;
  const zeros = co2ScrubberRating.filter((n) => n[i] === '0').length;
  if (ones > zeros) {
    co2ScrubberRating = co2ScrubberRating.filter((n) => n[i] === '0');
  } else if (ones < zeros) {
    co2ScrubberRating = co2ScrubberRating.filter((n) => n[i] === '1');
  } else {
    co2ScrubberRating = co2ScrubberRating.filter((n) => n[i] === '0');
  }
  if (co2ScrubberRating.length === 1) {
    co2ScrubberRating = parseInt(co2ScrubberRating[0], 2);
    break;
  }
}

// Compute the life support rating by multiplying the oxygen generator rating and the CO2 scrubber rating
const lifeSupportRating = oxygenGeneratorRating * co2ScrubberRating;
console.log(lifeSupportRating);
