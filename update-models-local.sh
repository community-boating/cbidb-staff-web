#!/bin/bash
rm src/models/api-generated -r
mkdir -p src/models/api-generated
cd src/models/api-generated && cp ../../../../cbidb-schema/out/api/typescript/* ./ -r