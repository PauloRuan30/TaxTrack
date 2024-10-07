#!/bin/bash

mkdir -p TaxTrack/backend/cmd/server
touch TaxTrack/backend/cmd/server/main.go

mkdir -p TaxTrack/backend/internal/api/handlers
touch TaxTrack/backend/internal/api/handlers/upload.go
touch TaxTrack/backend/internal/api/router.go

mkdir -p TaxTrack/backend/internal/services
touch TaxTrack/backend/internal/services/processor.go

mkdir -p TaxTrack/backend/internal/models
touch TaxTrack/backend/internal/models/file.go

mkdir -p TaxTrack/backend/internal/database
touch TaxTrack/backend/internal/database/postgres.go

mkdir -p TaxTrack/backend/internal/utils
touch TaxTrack/backend/internal/utils/logger.go

mkdir -p TaxTrack/backend/configs
touch TaxTrack/backend/configs/config.yaml

mkdir -p TaxTrack/backend/migrations
touch TaxTrack/backend/migrations/20240427_create_tables.up.sql

mkdir -p TaxTrack/backend/scripts
touch TaxTrack/backend/scripts/setup.sh

touch TaxTrack/backend/Dockerfile
touch TaxTrack/backend/go.mod
touch TaxTrack/backend/go.sum

mkdir -p TaxTrack/frontend/public
touch TaxTrack/frontend/public/index.html

mkdir -p TaxTrack/frontend/src/assets
mkdir -p TaxTrack/frontend/src/components
touch TaxTrack/frontend/src/components/FileUpload.jsx

mkdir -p TaxTrack/frontend/src/pages
touch TaxTrack/frontend/src/pages/Home.jsx

mkdir -p TaxTrack/frontend/src/services
touch TaxTrack/frontend/src/services/api.js

touch TaxTrack/frontend/src/App.jsx
touch TaxTrack/frontend/src/index.css
touch TaxTrack/frontend/src/index.js

touch TaxTrack/frontend/tailwind.config.js
touch TaxTrack/frontend/postcss.config.js
touch TaxTrack/frontend/Dockerfile
touch TaxTrack/frontend/package.json
touch TaxTrack/frontend/package-lock.json

mkdir -p TaxTrack/database/data
mkdir -p TaxTrack/database/migrations
touch TaxTrack/database/Dockerfile
touch TaxTrack/database/init.sql

touch TaxTrack/docker-compose.yml
touch TaxTrack/.gitignore
touch TaxTrack/README.md

mkdir -p TaxTrack/docs
touch TaxTrack/docs/architecture.md
touch TaxTrack/docs/api_documentation.md
touch TaxTrack/docs/setup_guide.md
