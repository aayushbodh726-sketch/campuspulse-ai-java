$ErrorActionPreference = 'Stop'

Write-Host 'CampusPulse AI - local Java + MySQL launch' -ForegroundColor Cyan
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
  throw 'Java was not found. Install JDK 21 and restart VS Code.'
}
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
  throw 'Maven was not found. Install Apache Maven 3.6.3 or newer, add its bin folder to PATH, and restart VS Code.'
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Warning 'Docker is not installed. Start a local MySQL 8.4 server and configure DB_URL, DB_USERNAME, and DB_PASSWORD first.'
} else {
  docker compose up -d mysql
}
Write-Host 'Starting CampusPulse at http://localhost:8080 ...' -ForegroundColor Green
mvn spring-boot:run
