const fs = require('fs')

const filePath = 'students.csv'

console.log(`Trying to process data from ${filePath} and create individual files for each program`);

//CSV file - Comma Separated Values - 'utf-8' encoding
fs.readFile(filePath, "utf-8", (err, data) => {
    if (err){
        console.log(`Unable to read from ${fileName} : ${JSON.stringify(err)}`);
    }else if (data){
        // console.log(`Data from file : \n${data}`);
        
        const rows = data.split("\n")
        let fields = []
        let program = ""
        let filePathToWrite = ""
        let dataToWrite = ""

        rows.forEach(record => {
            //obtain the fields from each record
            fields = record.split(",")
            program = fields[2]

            if (program !== undefined){
                filePathToWrite = `${program}.csv`
                dataToWrite = `${record}\n`

                fs.appendFile(filePathToWrite, dataToWrite, 'utf-8', (writeErr) => {
                    if (writeErr){
                        console.log(`Unable to append to ${filePathToWrite} : ${JSON.stringify(writeErr)}`);
                    }else{
                        console.log(`Record written succesfully.`);
                    }
                })
            }
        })

    }else {
        console.log(`No data available from file.`);     
    }
})
