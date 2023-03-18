#!/bin/bash
rm typescript.zip
wget https://api-docs.community-boating.org/typescript.zip
rm src/models/api-generated -r
mkdir -p src/models/api-generated
cd src/models/api-generated && unzip ../../../typescript.zip