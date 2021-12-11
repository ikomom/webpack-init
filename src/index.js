import a from './index.css'

console.log(a);

// import './index.css'
import b, {page} from "./Page";

import lazy from './index.lazy.css'

console.log(lazy)
const html = `
  <component>
    <title>Super Title</title>
    <text>Awesome Text</text>
  </component>
`;
let click = false
window.changeTheme = (e) => {
  if(!click) {
    lazy.use()
    click = true
  } else {
    lazy.unuse()
    click = false
  }
}
console.log(html);
console.log(page, b);
