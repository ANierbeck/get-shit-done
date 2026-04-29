#!/bin/bash
# Wendet alle Fixes auf die Source-Dateien an und kopiert sie nach ~/.vibe/skills/

set -e

echo "🔧 Applying all fixes to GSD Skills..."
echo ""

# 1. Process-Blöcke mit richtigen Anweisungen
node scripts/fix-process-blocks-proper.js

# 2. Compatibility fixen
echo ""
node scripts/fix-compatibility.js

# 3. Slash Commands fixen
echo ""
node scripts/fix-slash-commands.js

# 4. Gebrochene Slash Commands in Source fixen
echo ""
cd "$(dirname "$0")/.."
node scripts/fix-broken-slash-commands-source.js

# 5. Validierung
echo ""
echo "✅ Running validation..."
node scripts/validate-vibe-skills.js

# 6. Nach ~/.vibe/skills/ kopieren
echo ""
echo "📦 Copying to ~/.vibe/skills/..."
mkdir -p ~/.vibe/skills
cp -r skills/* ~/.vibe/skills/
echo "✅ Copied $(ls ~/.vibe/skills/ | wc -l) skills"

echo ""
echo "🎉 All fixes applied!"
echo ""
echo "Test with: vibe -p \"gsd-help\""
