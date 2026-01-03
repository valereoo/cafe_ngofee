const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'ValereoJibrilAlBuchori';

const createPartnerToken = () => {
    const partnerData = {
        id: 9999,
        username: 'CinemaTix_Partner',
        role: 'VIP_PARTNER'
    };

    const token = jwt.sign(partnerData, SECRET_KEY, { expiresIn: '100y' });
    console.log(token);
};

createPartnerToken();