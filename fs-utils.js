let fs = require("fs")

exports.readJsonFromFile = async (filePath)=>{
  return new Promise((resolve,reject)=>{
    fs.readFile(filePath,function(err,buf){
      if(err){
        reject(err)
      } else{
        resolve(JSON.parse(buf.toString()))
      }  
    })
  })
}

exports.writeJsonToFile = async (filePath,data)=>{
 return new Promise((resolve,reject)=>{
    fs.writeFile(filePath,JSON.stringify(data),(err)=>{
      if(err) {
        reject(err)
      } else {
        resolve()
      }   
    })
  })
}