const fs = require('fs');
const path = require('path');

const toolsPath = path.join("data/ai-tools-data.json");
const writePath = path.join("data/ai-tools-meta.txt");

const tools = JSON.parse(fs.readFileSync(toolsPath));

let txtFile = "";

async function generateTxt() {
    txtFile += `AI Tools Title & Website Url List\n\n`;
    for (const tool of tools) {
        txtFile += `Title: ${tool.main.title}\n`;
        txtFile += `Website: ${tool.meta.visitUrl}\n`;
        txtFile += `\n` // extra space between detials
    }
    fs.writeFileSync(writePath, txtFile, 'utf-8');
}

generateTxt();
