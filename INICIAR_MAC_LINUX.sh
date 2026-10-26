#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo 'Instala Node.js 20 o superior desde https://nodejs.org'
  exit 1
fi
echo 'Visita http://127.0.0.1:3030 en tu navegador'
node server.js
