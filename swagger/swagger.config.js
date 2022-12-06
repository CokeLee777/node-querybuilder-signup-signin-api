const swaggerAutogen = require("swagger-autogen");
const path = require("path");

const docs = {
    info: {
        title: "User authentication & authorization",
        description: "사용자 인증, 인가 관련 API 문서입니다",
        version: "1.0.0",
        license: "MIT"
    },
    host: "localhost:3001",
    schemas: ["http"]
};

const outputFile = "./auto-swagger-output.json";
const endPointFiles = [path.join(__dirname, "../app.ts")];

swaggerAutogen(outputFile, endPointFiles, docs);