git add -f backend\package.json frontend\package.json docker-compose.yml gemini.md BACKEND.md FRONTEND.md DATABASE.md
git commit -m "chore: init monorepo structure"

git add backend\app.js backend\.sequelizerc backend\src\config
git commit -m "chore: setup backend express + sequelize"

git add frontend\index.html frontend\vite.config.js frontend\src\main.js frontend\src\style.css frontend\tailwind.config.js frontend\postcss.config.js
git commit -m "chore: setup frontend vue3 + vite + tailwind"

git add backend\database
git commit -m "feat: database migrations and seeders"

git add backend\src\middleware\verifySignature.js frontend\src\utils\crypto.js frontend\src\utils\axios.js backend\.env frontend\.env
git commit -m "feat: crypto service and app signature middleware"

git add backend\src\middleware\verifyJWT.js
git commit -m "feat: jwt middleware"

git add backend\src\auth backend\src\user\user.model.js
git commit -m "feat: auth login endpoint"

git add backend\src\transaction\transaction.model.js backend\src\product\product.model.js
git commit -m "feat: transaction model"

git add frontend\src\pages\LoginPage.vue frontend\src\router frontend\src\stores frontend\src\App.vue frontend\src\components\AppSidebar.vue
git commit -m "feat: login page"

git add -f .
git commit -m "chore: remaining changes"
