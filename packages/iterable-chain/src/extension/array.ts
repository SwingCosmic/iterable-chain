
export function remove<T>(array: T[], item: T) {
  let index = array.indexOf(item);
  if (index < 0) {
    return;
  }
  array.splice(index, 1);
}