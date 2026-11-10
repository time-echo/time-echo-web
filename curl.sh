#!/usr/bin/env bash
# List stamps with category filtering, query search, pagination, and auth token
curl --location 'http://localhost:3000/api/v1/stamps?category=small-things&q=coffee&page=1&per_page=20' \
    --header 'Accept: application/json' \
    --header 'Accept-Language: en' \
    --header 'Authorization: Bearer b9187a1102f00429ed165330d90997cc716c4c2bda1f240e'

