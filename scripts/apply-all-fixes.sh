#!/bin/bash
# Applies all fixes to source files and copies them to ~/.vibe/skills/

set -e

echo "🔧 Applying all fixes to GSD Skills..."
echo ""

# 1. Fix broken slash commands in source
echo "🔧 Fixing broken slash commands in source..."
cd "$(dirname "$0")/.."
node scripts/vibe/fix-skills.js

# 2. Fix compatibility
echo ""
echo "🔧 Fixing compatibility..."
node scripts/vibe/fix-compatibility.js

# 3. Fix slash commands (legacy - handles other patterns)
echo ""
echo "🔧 Fixing slash commands..."
node scripts/vibe/fix-slash-commands.js

# 4. Validation
echo ""
echo "✅ Running validation..."
node scripts/vibe/validate-skills.js

# 5. Copy to ~/.vibe/skills/
echo ""
echo "📦 Copying to ~/.vibe/skills/..."
mkdir -p ~/.vibe/skills
cp -r skills/* ~/.vibe/skills/
echo "✅ Copied $(ls ~/.vibe/skills/ | wc -l) skills"

echo ""
echo "🎉 All fixes applied!"
echo ""
echo "Test with: vibe -p \"gsd-help\""
