// Test file to verify emoji filtering functionality

// Copy the functions from utils.ts for testing
function removeEmojis(text) {
    const emojiRegex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}\u{200d}\u{20e3}\u{fe0f}]+/gu;
    return text.replace(emojiRegex, '').trim();
}

function filterEmojisFromTags(tags) {
    return tags.map(tag => removeEmojis(tag)).filter(tag => tag.length > 0);
}

// Test data with various emoji types
const testTags = [
    '🤖 AI Tools',
    '⚡ productivity',
    '📝 content',
    '🎨 design',
    '💻 development',
    '🚀 startups',
    '🔧 automation',
    '📊 analytics',
    'tools', // no emoji
    '🌟✨ special', // multiple emojis
    '👨‍💻 developers', // complex emoji with ZWJ
    '🏳️‍🌈 diversity', // emoji with variation selectors
    '🇺🇸 USA', // flag emoji
    '1️⃣ first', // keycap emoji
    '©️ copyright', // symbol with variation selector
    '', // empty string
    '   ', // whitespace only
    '🎯🎪🎨', // only emojis
];

console.log('Testing emoji filtering...\n');

console.log('Original tags:');
testTags.forEach((tag, index) => {
    console.log(`${index + 1}. "${tag}"`);
});

console.log('\nAfter emoji filtering:');
const filteredTags = filterEmojisFromTags(testTags);
filteredTags.forEach((tag, index) => {
    console.log(`${index + 1}. "${tag}"`);
});

console.log(`\nOriginal count: ${testTags.length}`);
console.log(`Filtered count: ${filteredTags.length}`);

// Test individual removeEmojis function
console.log('\nTesting individual removeEmojis function:');
testTags.forEach(tag => {
    const cleaned = removeEmojis(tag);
    if (tag !== cleaned) {
        console.log(`"${tag}" → "${cleaned}"`);
    }
});
