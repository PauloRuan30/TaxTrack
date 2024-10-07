@echo off

mkdir TaxTrack\backend\cmd\server
type nul > TaxTrack\backend\cmd\server\main.go

mkdir TaxTrack\backend\internal\api\handlers
type nul > TaxTrack\backend\internal\api\handlers\upload.go
type nul > TaxTrack\backend\internal\api\router.go

mkdir TaxTrack\backend\internal\services
type nul > TaxTrack\backend\internal\services\processor.go

mkdir TaxTrack\backend\internal\models
type nul > TaxTrack\backend\internal\models\file.go

mkdir TaxTrack\backend\internal\database
type nul > TaxTrack\backend\internal\database\postgres.go

mkdir TaxTrack\backend\internal\utils
type nul > TaxTrack\backend\internal\utils\logger.go

mkdir TaxTrack\backend\configs
type nul > TaxTrack\backend\configs\config.yaml

mkdir TaxTrack\backend\migrations
type nul > TaxTrack\backend\migrations\20240427_create_tables.up.sql

mkdir TaxTrack\backend\scripts
type nul > TaxTrack\backend\scripts\setup.sh

type nul > TaxTrack\backend\Dockerfile
type nul > TaxTrack\backend\go.mod
type nul > TaxTrack\backend\go.sum

mkdir TaxTrack\frontend\public
type nul > TaxTrack\frontend\public\index.html

mkdir TaxTrack\frontend\src\assets
mkdir TaxTrack\frontend\src\components
type nul > TaxTrack\frontend\src\components\FileUpload.jsx

mkdir TaxTrack\frontend\src\pages
type nul > TaxTrack\frontend\src\pages\Home.jsx

mkdir TaxTrack\frontend\src\services
type nul > TaxTrack\frontend\src\services\api.js

type nul > TaxTrack\frontend\src\App.jsx
type nul > TaxTrack\frontend\src\index.css
type nul > TaxTrack\frontend\src\index.js

type nul > TaxTrack\frontend\tailwind.config.js
type nul > TaxTrack\frontend\postcss.config.js
type nul > TaxTrack\frontend\Dockerfile
type nul > TaxTrack\frontend\package.json
type nul > TaxTrack\frontend\package-lock.json

mkdir TaxTrack\database\data
mkdir TaxTrack\database\migrations
type nul > TaxTrack\database\Dockerfile
type nul > TaxTrack\database\init.sql

type nul > TaxTrack\docker-compose.yml
type nul > TaxTrack\.gitignore
type nul > TaxTrack\README.md

mkdir TaxTrack\docs
type nul > TaxTrack\docs\architecture.md
type nul > TaxTrack\docs\api_documentation.md
type nul > TaxTrack\docs\setup_guide.md