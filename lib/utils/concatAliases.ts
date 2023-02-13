export const concatAliases = (aliases: string[]): string => {
  const string = aliases.reduce((currentString, _) => {
    return currentString.concat("{} ");
  }, "States.Format(' ");

  const format = aliases.reduce((currentString, _, index) => {
    return currentString.concat(`, $.allValues[${index}]`);
  }, string.concat(" {} {} {}', '{', $.notNullValues[0]  "));

  return format.concat(" , '}')");
};
