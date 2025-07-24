const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateBadges() {
    try {
        // Ensure the images directory exists
        const imagesDir = path.join(process.cwd(), 'public', 'images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        // Generate dark theme badge
        await sharp({
            create: {
                width: 224,
                height: 56,
                channels: 4,
                background: { r: 31, g: 41, b: 55, alpha: 1 } // dark background
            }
        })
            .composite([
                {
                    input: await sharp(path.join(process.cwd(), 'public', 'favicons', 'android-chrome-512x512.png'))
                        .resize(32, 32)
                        .png()
                        .toBuffer(),
                    top: 12,
                    left: 16
                },
                {
                    input: await sharp({
                        text: {
                            text: 'Featured on Intelpedia',
                            font: 'Arial',
                            fontSize: 14,
                            rgba: true
                        }
                    })
                        .png()
                        .toBuffer(),
                    top: 20,
                    left: 60
                }
            ])
            .png()
            .toFile(path.join(imagesDir, 'featured-dark.png'));

        // Generate light theme badge
        await sharp({
            create: {
                width: 224,
                height: 56,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 } // light background
            }
        })
            .composite([
                {
                    input: await sharp(path.join(process.cwd(), 'public', 'favicons', 'android-chrome-512x512.png'))
                        .resize(32, 32)
                        .png()
                        .toBuffer(),
                    top: 12,
                    left: 16
                },
                {
                    input: await sharp({
                        text: {
                            text: 'Featured on Intelpedia',
                            font: 'Arial',
                            fontSize: 14,
                            rgba: true
                        }
                    })
                        .png()
                        .toBuffer(),
                    top: 20,
                    left: 60
                }
            ])
            .png()
            .toFile(path.join(imagesDir, 'featured-light.png'));

        console.log('Badge images generated successfully!');
    } catch (error) {
        console.error('Error generating badges:', error);
    }
}

generateBadges();
