const sharp = require('sharp');
const path = require('path');

const srcFile = path.resolve('C:\\Users\\Anil Seth\\.gemini\\antigravity\\brain\\acb45512-798a-49f8-909b-841afdee0097\\media__1774869253105.jpg');
const outDir = path.resolve('C:\\Users\\Anil Seth\\.gemini\\antigravity\\scratch\\coppr\\public');

async function crop() {
  const meta = await sharp(srcFile).metadata();
  const w = meta.width;
  const h = meta.height;

  // Top-left: horizontal logo (icon + Coppr text in dark navy)
  await sharp(srcFile)
    .extract({ left: 0, top: 0, width: Math.floor(w*0.5), height: Math.floor(h*0.45) })
    .png({ quality: 95 })
    .toFile(`${outDir}\\coppr_logo_horizontal.png`);

  // Bottom-right: dark navy app icon square 
  await sharp(srcFile)
    .extract({ left: Math.floor(w*0.55), top: Math.floor(h*0.54), width: Math.floor(w*0.42), height: Math.floor(h*0.28) })
    .png({ quality: 95 })
    .toFile(`${outDir}\\coppr_logo_dark.png`);

  // Top-right: icon + stacked text
  await sharp(srcFile)
    .extract({ left: Math.floor(w*0.5), top: 0, width: Math.floor(w*0.5), height: Math.floor(h*0.45) })
    .png({ quality: 95 })
    .toFile(`${outDir}\\coppr_logo_stacked.png`);

  console.log('Success! Logos saved.');
}
crop().catch(console.error);
