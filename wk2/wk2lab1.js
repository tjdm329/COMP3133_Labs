const fs = require('fs')

const filePath = 'input_countries.csv'

console.log(`Trying to process data from ${filePath}`);

//delete canada.txt/usa.txt if they exist
['canada.txt', 'usa.txt'].forEach(file => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
});
//CSV file - Comma Separated Values - 'utf-8' encoding
fs.readFile(filePath, "utf-8", (err, data) => {
    if (err){
        console.log(`Unable to read from ${filePath} : ${JSON.stringify(err)}`);
    }else if (data){
        const rows = data.split("\n")
        let fields = []
        let country = ""
        let year = ""
        let population = ""
        let dataToWrite = ""

        rows.forEach(record => {
            fields = record.split(',');

            country = fields[0].toLowerCase();
            year = fields[1];
            population = fields[2];


            if (!country || !year || !population) {
                console.log('Invalid field.');
                return;
            }

            if (country === 'canada') {
                dataToWrite = `${fields[0]},${year},${population}\n`;
                fs.appendFile('canada.txt', dataToWrite, 'utf-8', (writeErr) => {
                    if (writeErr) {
                        console.log(`Unable to write to ${'canada.txt'}`);
                    }
                });
            }

            if (country === 'united states') {
                dataToWrite = `${fields[0]},${year},${population}\n`;
                fs.appendFile('usa.txt', dataToWrite, 'utf-8', (writeErr) => {
                    if (writeErr) {
                        console.log(`Unable to write to ${'usa.txt'}`);
                    }
                });
            }
        });

        console.log('CSV file processed successfully.');
    }else {
        console.log(`No data available from file.`);     
    }
})
