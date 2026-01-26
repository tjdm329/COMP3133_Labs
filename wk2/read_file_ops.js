const fs = require('fs')

// console.log(`Trying to read data from input_data.txt file.....`);

//path to file
const filePath = "input_data.txt"

//reading the file asynchronously using fs.readFile()
fs.readFile(filePath, (error, data) => {
    if (error){
        console.log(`Error while reading the file ${filePath} : ${JSON.stringify(error)}`);
    }else{
        //readFile is successful; process the data
        if (data){ //check if data is not undefined
            console.log(`Option 1 - Data from ${filePath} : \n ${data}`);
        }else{
            console.log(`No data received from ${filePath}`);
        }
    }
})

//read the file synchronously using fs.readFileSync()
console.log("\n\n");
console.log(`Trying to reading the file synchronously....`);

const fileData = fs.readFileSync(filePath)
console.log(`Option 2 - fileData : \n${fileData}`);


//reading the file within async function
const accessFileData = async() => {
    try {
        const data = await fs.promises.readFile(filePath)
        console.log(`\nOption 3 - Data from async function : \n${data}`);
        
    } catch (error) {
        console.log(`Error while reading file using async function : ${JSON.stringify(error)}`);
    }
}

accessFileData()
