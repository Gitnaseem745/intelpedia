// Test script for pricing logic
const testCases = [
    { isFree: true, pricing: 0, expected: 'Free' },
    { isFree: true, pricing: undefined, expected: 'Free' },
    { isFree: true, pricing: 9.99, expected: 'Free + $9.99/mo' },
    { isFree: false, pricing: 29.99, expected: '$29.99/mo' },
    { isFree: undefined, pricing: 19.99, expected: '$19.99/mo' },
    { isFree: undefined, pricing: undefined, expected: null },
    { isFree: true, pricing: undefined, expected: 'Free' }
];

function getPricingText(isFree, pricing) {
    // Don't render anything if neither field is provided
    if (isFree === undefined && pricing === undefined) {
        return null;
    }

    // If isFree === true and pricing === 0: show "Free"
    if (isFree === true && (pricing === undefined || pricing === 0)) {
        return 'Free';
    }

    // If isFree === true and pricing > 0: show "Free + $<pricing>/mo"
    if (isFree === true && pricing !== undefined && pricing > 0) {
        return `Free + $${pricing.toFixed(2)}/mo`;
    }

    // If isFree === false and pricing > 0: show "$<pricing>/mo"
    if (isFree === false && pricing !== undefined && pricing > 0) {
        return `$${pricing.toFixed(2)}/mo`;
    }

    // If only pricing is provided without isFree
    if (isFree === undefined && pricing !== undefined && pricing > 0) {
        return `$${pricing.toFixed(2)}/mo`;
    }

    // If only isFree is provided without pricing
    if (pricing === undefined && isFree === true) {
        return 'Free';
    }

    // Fallback
    return 'N/A';
}

console.log('Testing pricing logic:');
testCases.forEach((test, index) => {
    const result = getPricingText(test.isFree, test.pricing);
    const passed = result === test.expected;
    console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'} - isFree: ${test.isFree}, pricing: ${test.pricing}, expected: "${test.expected}", got: "${result}"`);
});
