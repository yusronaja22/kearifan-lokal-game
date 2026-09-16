const fs = require('fs');
let svg = fs.readFileSync('Asset/images/wadah-soal.svg', 'utf8');

// The green icon is basically cls-8 to cls-13 and the rect cls-1 shadow.
// Actually it's easier to just take the SVG and remove cls-2 to cls-7 paths.
let iconSvg = svg.replace(/<path class="cls-[234567]"[^>]*>/g, '');
// Also need to remove the shadow of the yellow box? Wait, cls-1 has two paths/rects.
// In the current wadah-soal.svg, the first element is <rect class="cls-1"...> which is the icon shadow.
// The second element is <path class="cls-1"...> which is the yellow box shadow.
iconSvg = iconSvg.replace(/<path class="cls-1"[^>]*>/, '');

// Save as icon-soal.svg
fs.writeFileSync('Asset/images/icon-soal.svg', iconSvg);
console.log('Icon extracted!');
