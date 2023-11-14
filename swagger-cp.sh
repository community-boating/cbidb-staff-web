mkdir -p ./src/models/swaggergen
rm ./src/models/swaggergen/* -r
cp ../cbidb-schema/out/api/typescript/staff/* ./src/models/swaggergen/ -r
