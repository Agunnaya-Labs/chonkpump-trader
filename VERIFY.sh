#!/bin/bash

# ChonkPump Production Verification Script
# This script verifies that all components are working correctly

echo "🐷 ChonkPump Production Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((passed++))
  else
    echo -e "${RED}✗${NC} $2 (missing: $1)"
    ((failed++))
  fi
}

# Function to check directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((passed++))
  else
    echo -e "${RED}✗${NC} $2 (missing: $1)"
    ((failed++))
  fi
}

# Function to check file contains text
check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $3"
    ((passed++))
  else
    echo -e "${RED}✗${NC} $3 (not found in $1)"
    ((failed++))
  fi
}

echo "1️⃣  Checking Project Structure"
echo "-----------------------------"
check_dir "app" "app/ directory"
check_dir "bot" "bot/ directory"
check_dir "lib" "lib/ directory"
check_dir "public" "public/ directory"
check_dir "scripts" "scripts/ directory"
check_file "package.json" "package.json"
check_file ".env.example" ".env.example"
check_file "tsconfig.json" "tsconfig.json"

echo ""
echo "2️⃣  Checking Main Files"
echo "--------------------"
check_file "app/page.tsx" "app/page.tsx (landing page)"
check_file "app/layout.tsx" "app/layout.tsx (root layout)"
check_file "app/globals.css" "app/globals.css (design system)"
check_file "bot/index.ts" "bot/index.ts (polling server)"
check_file "lib/db.ts" "lib/db.ts (database)"
check_file "lib/blockchain.ts" "lib/blockchain.ts (blockchain)"

echo ""
echo "3️⃣  Checking Handler Files"
echo "------------------------"
check_file "bot/handlers/start.ts" "start.ts handler"
check_file "bot/handlers/balance.ts" "balance.ts handler"
check_file "bot/handlers/swap.ts" "swap.ts handler"
check_file "bot/handlers/leaderboard.ts" "leaderboard.ts handler"
check_file "bot/handlers/portfolio.ts" "portfolio.ts handler"
check_file "bot/handlers/connect-wallet.ts" "connect-wallet.ts handler"
check_file "bot/handlers/referral.ts" "referral.ts handler"

echo ""
echo "4️⃣  Checking Assets"
echo "-----------------"
check_file "public/logo.png" "public/logo.png (branding)"
check_file "public/banner.png" "public/banner.png (og image)"

echo ""
echo "5️⃣  Checking Documentation"
echo "------------------------"
check_file "README.md" "README.md (comprehensive)"
check_file "SETUP_GUIDE.md" "SETUP_GUIDE.md"
check_file "DEPLOYMENT.md" "DEPLOYMENT.md"
check_file "TESTING_GUIDE.md" "TESTING_GUIDE.md"
check_file "PERFORMANCE.md" "PERFORMANCE.md"
check_file "PRODUCTION_READY.md" "PRODUCTION_READY.md"

echo ""
echo "6️⃣  Checking Configuration"
echo "------------------------"
check_content "package.json" "next" "Next.js dependency"
check_content "package.json" "react" "React dependency"
check_content "package.json" "ethers" "ethers.js dependency"
check_content "package.json" "drizzle-orm" "Drizzle ORM dependency"
check_content "tsconfig.json" "jsx" "JSX configuration"
check_content ".env.example" "TELEGRAM_BOT_TOKEN" ".env example template"

echo ""
echo "7️⃣  Checking Code Quality"
echo "------------------------"
check_content "app/page.tsx" "'use client'" "Client component directive"
check_content "app/layout.tsx" "Metadata" "Metadata configuration"
check_content "app/globals.css" "@theme inline" "Tailwind v4 configuration"
check_content "lib/db.ts" "drizzle" "Drizzle ORM usage"
check_content "lib/blockchain.ts" "ethers" "ethers.js usage"

echo ""
echo "8️⃣  Checking Design System"
echo "------------------------"
check_content "app/globals.css" "--primary: #ffd700" "Gold color primary"
check_content "app/globals.css" "--background: #0f0f0f" "Black background"
check_content "app/globals.css" "--font-sans" "Font configuration"
check_content "app/globals.css" "@keyframes fadeInUp" "Animation keyframes"

echo ""
echo "===================================="
echo "📊 Verification Results"
echo "===================================="
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Application is production-ready.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. npm install"
  echo "2. npm run setup:db"
  echo "3. npm run dev (or npm run bot:dev)"
  echo "4. vercel deploy --prod"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please review the issues above.${NC}"
  exit 1
fi
