const fs = require('fs');
// read the original from before any of my modifications if possible.
// Wait, I have wadah-soal.svg which still has the question mark in it!
let svg = fs.readFileSync('Asset/images/wadah-soal.svg', 'utf8');
let paths = svg.match(/<[^>]+>/g);

let newSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 85">
<defs><style>.cls-1{fill:#858585;}.cls-2{fill:#f9f9f9;}.cls-3{fill:#833b1c;}.cls-4{fill:#fdd236;}.cls-5{fill:#e4a305;}.cls-6{fill:#b27b00;}.cls-7{fill:#ffe292;}.cls-8{fill:#fefefe;}.cls-9{fill:#004200;}.cls-10{fill:#00c002;}.cls-11{fill:#090;}.cls-12{fill:#51fc51;}.cls-13{fill:#007200;}</style></defs>
`;

for (let tag of paths) {
    if (tag.includes('cls-8') || tag.includes('cls-9') || tag.includes('cls-10') || 
        tag.includes('cls-11') || tag.includes('cls-12') || tag.includes('cls-13') || 
        (tag.includes('cls-1') && tag.includes('rect'))) {
        newSvg += tag + '\n';
    }
    if (tag.includes('cls-2') && tag.includes('M38.64')) {
        newSvg += tag + '\n';
    }
}
newSvg += `</svg>`;

fs.writeFileSync('Asset/images/icon-soal.svg', newSvg);
console.log('Icon rebuilt!');
