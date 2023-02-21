const OBJFile = require('obj-file-parser');
const fs = require("fs");
const path = require("path");

const fileContents = fs.readFileSync(path.join(__dirname,"./teapot.obj")).toString();

const objFile = new OBJFile(fileContents);

const output = objFile.parse();

const {vertices, faces} = output.models[0];

const resultFile = fs.createWriteStream(path.join(__dirname, "./result.csv"));

for (const face of faces)
{
    const positions = face.vertices
                        .map(v=>vertices[v.vertexIndex-1])
                        .map(pos=>[pos.x,pos.y,pos.z].join(",")).join(",");
    resultFile.write(positions);
    resultFile.write("\r\n");
}

resultFile.end();