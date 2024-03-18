#!/bin/bash

npm run build

scp -r build root@159.65.226.25:/home/alexb/cbidb-staff-web
