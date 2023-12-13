const bcrypt = require("bcrypt")

const saltRounds = parseInt(process.env.SALT);

//generates the hash code for a certain plain text
async function hashPassword(plaintextPassword) {
    try{
        const hash = await bcrypt.hash(plaintextPassword, saltRounds);
        //console.log("Hash=", hash);
        return hash;
    }catch(error){
        console.log("error while hashing", error);  
    }
}

//compares is the given plain text corresponds to the given hash code
 async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

//It ignores the errors of all the null fields and returns the first index where the error was provoked by other validations
const errorCheckInvalidFields = (errors) => {
    const errorList = errors.array();
    for(let i = 0; i < errorList.length; i++){
      if(errorList[i].value != null) return i;
    }
    return -1;
  }

 module.exports = {
    hashPassword,
    comparePassword,
    errorCheckInvalidFields
  };