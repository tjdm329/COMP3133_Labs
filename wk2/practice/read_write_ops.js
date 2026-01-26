const fs = require('fs')

const filePath = "data.txt"

//open file for read and write
/*
r - read only
w - write only
a - append
r+ - read and write(append)
wx - write and execute
*/

//fd - file descriptor - 
// reference to the opened file using which you can complete read/write operation
fs.open(filePath, 'r+', (err, fd) => {
    if (err){
        console.log(`Unable to open file ${filePath} : ${JSON.stringify(err)}`);
    }else{
        console.log(`File ${filePath} opened successfully.`);
        
        //perform read/write operations
        const fileData = fs.readFileSync(fd)
        console.log(`\nFile Data : \n${fileData}`);
        
        const dataBuffer = Buffer.from("\nFolks could you remind me pls the class? T310")
        fs.write(fd, dataBuffer, (error) => {
            if (error){
                console.log(`\nUnable to write to file ${filePath} : ${JSON.stringify(error)}`);
            }else{
                console.log(`\nData successfully written to ${filePath}`);
            }
        })

        //close the file once the oeprations are complete
        fs.close(fd)
    }
})