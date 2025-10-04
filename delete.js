const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const api = process.env.api;
const key = process.env.key;
const data = require(process.argv[2]);

(async () => {
    const { id } = data;
    await axios.delete(
        `${api}/content/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            }
        }
    );
})();