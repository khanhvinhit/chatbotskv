var fs = require('fs');
var data;

var fs = require('fs');
fs.readFile('rep.json', 'utf8',(err, fileContent) => {
    if( err ) {
    } else {
      data = JSON.parse(fileContent.toString());
      console.log(typeof fileContent);
      console.log(fileContent);
      console.log(typeof data);
      console.log(data)
    }
    // for(let item in data.split(',')){
    //     console.log(item);
    // }
})
