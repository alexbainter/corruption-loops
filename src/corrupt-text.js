const MIN_CHAR_CODE = 32;
const MAX_CHAR_CODE = 10144;

const corruptText = text =>
  text
    .split('')
    .map(char =>
      Math.random() < 0.0003
        ? String.fromCharCode(
            Math.floor(MIN_CHAR_CODE + Math.random() * MAX_CHAR_CODE)
          )
        : char
    )
    .join('');

export default corruptText;
