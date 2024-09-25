import fs from 'fs/promises';

// Check if filename is provided
if (process.argv.length < 3) {
    console.error('Please provide a filename as an argument');
    process.exit(1);
}

const filename = process.argv[2];

try {
    // Read and parse the JSON file
    const data = await fs.readFile(filename, 'utf8');
    const parsedData = JSON.parse(data);
    const contextObject = parsedData[0];

    // Extract the required fields
    const fields = [
        'signature', 'slot', 'blocktime', 'err', 'fee', 'enhancedDescription',
        'enhancedType', 'enhancedSource', 'enhancedFeePayer', 'owner',
        'preBalance_sol', 'postBalance_sol', 'changeBalance_sol',
        'accountIndex_inc', 'account_inc', 'mint_inc', 'preBalance_inc',
        'postBalance_inc', 'changeBalance_inc', 'accountIndex_dec',
        'account_dec', 'mint_dec', 'preBalance_dec', 'postBalance_dec',
        'changeBalance_dec', 'ownerTokenBalanceChanges_overflow', 'trade'
    ];

    // Create CSV header
    console.log(fields.join(','));

    // Create CSV row
    const row = fields.map(field => {
        const value = contextObject[field];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value;
    });

    console.log(row.join(','));

} catch (err) {
    console.error('Error:', err);
}