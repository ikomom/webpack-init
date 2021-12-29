import a from './assets/css/index.css'
console.log(a);

// import './index.css'
import b, {page} from "./Page";

import lazy from './assets/css/index.lazy.css'
console.log(lazy)

import './assets/css/index.link.css'
import gifa from './assets/images/a.gif?width=300&height=300'
import imgb from './assets/images/b.jpg'
import Sketchpad from './assets/images/Sketchpad.png'
import kani from './assets/images/kani.svg'

console.log([gifa, imgb, Sketchpad, kani])

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
// console.log(html);
// console.log(page, b);
