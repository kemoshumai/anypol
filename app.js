const commandLineArgs = require('command-line-args');
const OBJFile = require('obj-file-parser');
const fs = require("fs");
const path = require("path");

console.time("time");

const optionDefinitions = [
    {
        name: 'file',
        multiple: false,
        defaultOption: true
    },
    {
      name: 'mul',
      alias: 'm',
      type: Number,
      defaultValue: 1.0
    }
  ];
const options = commandLineArgs(optionDefinitions);
  
const {mul, file} = options;
  
if (!fs.existsSync(path.join(__dirname,file)))
{
    console.error("Error: file "+file+" is not found.");
    process.exit(-1);
}

const fileContents = fs.readFileSync(path.join(__dirname,file)).toString();

const objFile = new OBJFile(fileContents);

const output = objFile.parse();

const {vertices, faces} = output.models[0];

const basename = path.basename(file, ".obj");
const resultFile = fs.createWriteStream(path.join(__dirname, `./${basename}.csv`));

for (const face of faces)
{
    const positions = face.vertices
                        .map(v=>vertices[v.vertexIndex-1])
                        .map(pos=>[pos.x*mul,pos.y*mul,pos.z*mul].join(",")).join(",");
    resultFile.write(positions);
    resultFile.write("\r\n");
}

resultFile.end();
console.log("Done successfully.");
console.timeLog("time");