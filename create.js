const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs').promises;
dotenv.config();

const api = process.env.api;
const key = process.env.key;
const data = require(process.argv[2]);

async function loadFileContent(filePath) {
    try {
        // Read the file asynchronously
        const data = await fs.readFile(filePath, 'utf8');
        // 'data' now contains the file content as a string
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

(async () => {
    const { id, name, description } = data;
    const fileContent = await loadFileContent(description);
    await axios.post(
        `${api}/content`,
        {
            id,
            name,
            description: fileContent
        },
        {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            }
        }
    );
    const content_id = id;
    const r2 = await axios.post(
        `${api}/accesskey`,
        {
            content_id,
        },
        {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            }
        }
    )
    const accesskey = r2.data.key;
    console.log('Access key: ', accesskey);
    for (let i = 0; i < data.sections.length; i++) {
        const { id, name, markdown, vidurl } = data.sections[i];
        const fileContent = await loadFileContent(markdown);
        await axios.post(
            `${api}/section`,
            {
                content_id,
                id,
                name,
                markdown: fileContent,
                vidurl
            },
            {
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                }
            }
        );
    }
})();