export function update({ acceptedFields, input }) {
  const setArray = [];
  const valuesToUpdate = [];
  let i = 1;

  for (const key in input) {
    if (acceptedFields.includes(key)) {
      setArray.push(`${key} = $${i}`);
      valuesToUpdate.push(input[key]);
      i++;
    }
  }

  const setString = setArray.join(', ');

  return {
    setString,
    valuesToUpdate,
    lastIndex: i
  };
}
