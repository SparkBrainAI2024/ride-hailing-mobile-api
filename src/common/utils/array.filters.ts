export const checkDuplicateInArray = (array: any[any], field: string) => {
  var valueArr = array.map(function (item) {
    return item[field];
  });
  return valueArr.some(function (item, idx) {
    return valueArr.indexOf(item) != idx;
  });
};
