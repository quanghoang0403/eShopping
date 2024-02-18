export const capitalize = str => {
  const strLowerCase = str.toLowerCase();
  return strLowerCase.charAt(0).toUpperCase() + strLowerCase.slice(1);
};

export const sentenceToCamelCase = (str) => {
  if (!str || str.trim().length <= 0) {
    return '';
  }
  const words = str.trim().split(/\W+/);
  const camelCaseWords = words.map((word, index) => {
    if (!word || word.trim().length <= 0) return '';
    if (index === 0) return word.toLowerCase();
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
  return camelCaseWords.join('');
}
