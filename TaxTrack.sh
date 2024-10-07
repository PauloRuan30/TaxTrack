#!/bin/bash

mkdir -p sped-intelligence/backend/app/api/v1/endpoints
touch sped-intelligence/backend/app/api/v1/endpoints/upload.py
touch sped-intelligence/backend/app/api/v1/endpoints/other_endpoints.py
touch sped-intelligence/backend/app/api/v1/__init__.py
touch sped-intelligence/backend/app/api/__init__.py

mkdir -p sped-intelligence/backend/app/core
touch sped-intelligence/backend/app/core/config.py
touch sped-intelligence/backend/app/core/security.py
touch sped-intelligence/backend/app/core/__init__.py

mkdir -p sped-intelligence/backend/app/db
touch sped-intelligence/backend/app/db/base.py
touch sped-intelligence/backend/app/db/session.py
touch sped-intelligence/backend/app/db/__init__.py

mkdir -p sped-intelligence/backend/app/models
touch sped-intelligence/backend/app/models/file.py
touch sped-intelligence/backend/app/models/__init__.py

mkdir -p sped-intelligence/backend/app/schemas
touch sped-intelligence/backend/app/schemas/file.py
touch sped-intelligence/backend/app/schemas/__init__.py

mkdir -p sped-intelligence/backend/app/services
touch sped-intelligence/backend/app/services/file_processing.py
touch sped-intelligence/backend/app/services/__init__.py

mkdir -p sped-intelligence/backend/app/utils
touch sped-intelligence/backend/app/utils/helpers.py
touch sped-intelligence/backend/app/utils/__init__.py

touch sped-intelligence/backend/app/main.py
touch sped-intelligence/backend/app/__init__.py

mkdir -p sped-intelligence/backend/tests/api/v1
touch sped-intelligence/backend/tests/api/v1/test_upload.py
touch sped-intelligence/backend/tests/api/__init__.py

mkdir -p sped-intelligence/backend/tests/unit
touch sped-intelligence/backend/tests/unit/test_helpers.py
touch sped-intelligence/backend/tests/__init__.py

mkdir -p sped-intelligence/backend/alembic/versions
touch sped-intelligence/backend/alembic/env.py
touch sped-intelligence/backend/alembic/script.py.mako
touch sped-intelligence/backend/alembic/alembic.ini

touch sped-intelligence/backend/.env
touch sped-intelligence/backend/.gitignore
touch sped-intelligence/backend/Dockerfile
touch sped-intelligence/backend/requirements.txt
touch sped-intelligence/backend/README.md

mkdir -p sped-intelligence/frontend/public
touch sped-intelligence/frontend/public/index.html
touch sped-intelligence/frontend/public/favicon.ico

mkdir -p sped-intelligence/frontend/src/assets
touch sped-intelligence/frontend/src/assets/logo.png

mkdir -p sped-intelligence/frontend/src/components
touch sped-intelligence/frontend/src/components/FileUpload.jsx
touch sped-intelligence/frontend/src/components/DataTable.jsx
touch sped-intelligence/frontend/src/components/Header.jsx

mkdir -p sped-intelligence/frontend/src/pages
touch sped-intelligence/frontend/src/pages/Home.jsx
touch sped-intelligence/frontend/src/pages/Upload.jsx

mkdir -p sped-intelligence/frontend/src/services
touch sped-intelligence/frontend/src/services/api.js

mkdir -p sped-intelligence/frontend/src/styles
touch sped-intelligence/frontend/src/styles/globals.css
touch sped-intelligence/frontend/src/styles/tailwind.css

touch sped-intelligence/frontend/src/App.jsx
touch sped-intelligence/frontend/src/index.jsx
touch sped-intelligence/frontend/src/setupTests.js

touch sped-intelligence/frontend/.gitignore
touch sped-intelligence/frontend/Dockerfile
touch sped-intelligence/frontend/package.json
touch sped-intelligence/frontend/postcss.config.js
touch sped-intelligence/frontend/tailwind.config.js
touch sped-intelligence/frontend/README.md

touch sped-intelligence/docker-compose.yml
touch sped-intelligence/README.md
