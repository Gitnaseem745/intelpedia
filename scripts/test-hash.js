const bcrypt = require('bcryptjs');

// Your hash from .env
const hash = '$2a$12$dYz6/3f/hMqctIgQd27COuD3S38ef3ao9kpN3maNlYVbysG6lPARu';
const password = 'SahilNaseemAdminPassword1234';

async function testHash() {
    try {
        console.log('Testing password:', password);
        console.log('Against hash:', hash);

        const isValid = await bcrypt.compare(password, hash);
        console.log('Is valid:', isValid);

        // Also generate a new hash to compare
        const newHash = await bcrypt.hash(password, 12);
        console.log('New hash generated:', newHash);

        const isNewValid = await bcrypt.compare(password, newHash);
        console.log('New hash is valid:', isNewValid);

    } catch (error) {
        console.error('Error:', error);
    }
}

testHash();
