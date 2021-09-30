export function sum(num1, num2) {
  const parseNumber1 = parseInt(num1, 10);
  const parseNumber2 = parseInt(num2, 10);

  if (Number.isNaN(parseNumber1) || Number.isNaN(parseNumber2)) {
    throw new Error('Please check your input');
  }

  return parseNumber1 + parseNumber2;
}
