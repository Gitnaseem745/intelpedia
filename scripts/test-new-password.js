const bcrypt = require('bcryptjs');

async function testNewPassword() {
    const password = 'naseem@!1234';
    const hash = '$2a$12$6bwEKyPoYeR3/jxtsBqtfu30IGNwWaOLGac3.o/GZL8dBWDuu7DyW';

    console.log('Testing password:', password);
    console.log('Against hash:', hash);

    const isValid = await bcrypt.compare(password, hash);
    console.log('Is valid:', isValid);

    // Generate a new hash for this password
    const newHash = await bcrypt.hash(password, 12);
    console.log('New hash for this password:', newHash);

    const newHashValid = await bcrypt.compare(password, newHash);
    console.log('New hash works:', newHashValid);
}

testNewPassword().catch(console.error);
