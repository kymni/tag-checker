const testInput = [
  'The following text<C><B>is centred and in boldface</B></C>',
  '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence',
  '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>',
  '<B>This should be in boldface, but there is an extra closing tag</B></C>',
  '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>',
];
for (const input of testInput) {
  console.log(tagChecker(input));
}
function tagChecker(input) {
  let currTag = '';
  let tags = [];
  let tagOpened = false;
  let i = 0;
  while (i < input.length) {
    if (input.charAt(i) === '<') {
      if (!tagOpened) {
        tagOpened = true;
      }
      // get current tag
      currTag = '<';
      const restOfStr = input.substring(i + 1, input.length);
      let isOpeningTag = false;
      for (let j = 0; j < restOfStr.length; j++) {
        i += 1;
        const tagChar = restOfStr.charAt(j);
        if (tagOpened && tagChar !== '/' && tagChar !== '>' && !(/^[A-Za-z]+$/.test(tagChar))) {
          // not a valid tag so move along
          break;
        }
        if (j === 0 && restOfStr.charAt(j) !== '/') {
          isOpeningTag = true;
        }
        currTag += restOfStr.charAt(j);
        if (tagOpened && restOfStr.charAt(j) === '>') {
          // confirm we're closing the last opened tag
          if (!isOpeningTag) {
            if (tags.length && tags[tags.length - 1] === currTag.replace('/', '')) {
              tags = tags.slice(0, tags.length - 1);
            } else {
              // if no opening tag left, return error
              if (!tags.length) {
                return `expected # found ${currTag}`;
              }
              const openingTagArray = tags[tags.length - 1].split('');
              openingTagArray.splice(1, 0, '/');
              return `expected ${openingTagArray.join('')} found ${currTag}`;
            }
          } else {
            tags.push(currTag);
          }
          break;
        }
      }
    }
    i += 1;
  }
  // if at end of string and there's an unclosed tag left, return error
  if (tags.length) {
    const openingTagArray = tags[tags.length - 1].split('');
    openingTagArray.splice(1, 0, '/');
    return `expected ${openingTagArray.join('')} found #`;
  }
  return 'Correctly tagged paragraph';
}