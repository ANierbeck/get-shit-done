#!/bin/bash
# Setup script for Vibe test environment
# Creates an isolated test environment for GSD Skills

set -e

TEST_DIR="$HOME/.vibe-test"
SKILLS_DIR="$(cd "$(dirname "$0")/.." && pwd)/skills"

# Colors
green='\033[0;32m'
blue='\033[0;34m'
red='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${blue}╔══════════════════════════════════════════════════════{'${NC}'"
echo -e "${blue}║  GSD Vibe Test Environment Setup                    {'${NC}'}"
echo -e "${blue}╚══════════════════════════════════════════════════════{'${NC}'}"
echo ""

# Check if we are in the correct directory
if [ ! -d "$SKILLS_DIR" ]; then
    echo -e "${red}❌ Error: Skills directory not found${NC}"
    echo "   Expected: $SKILLS_DIR"
    exit 1
fi

echo -e "${blue}📁 Skills directory: ${NC}$SKILLS_DIR"
echo ""

# Offer backup of ~/.vibe
if [ -d "$HOME/.vibe" ]; then
    echo -e "${blue}ℹ️  Found existing ~/.vibe directory${NC}"
    read -p "   Create backup of ~/.vibe before testing? [y/N] " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        BACKUP_DIR="$HOME/.vibe-backup-$(date +%Y%m%d-%H%M%S)"
        echo -e "   ${blue}Backing up ~/.vibe to ${BACKUP_DIR}...${NC}"
        cp -r "$HOME/.vibe" "$BACKUP_DIR"
        echo -e "   ${green}✓ Backup created${NC}"
    fi
fi

# Create test environment
echo -e "${blue}🏗️  Creating test environment...${NC}"
if [ -d "$TEST_DIR" ]; then
    echo "   Test directory already exists, cleaning..."
    rm -rf "$TEST_DIR"
fi

mkdir -p "$TEST_DIR/skills"
echo -e "   ${green}✓ Created ${TEST_DIR}/skills${NC}"

# Copy skills
echo -e "${blue}📦 Copying GSD skills...${NC}"
cp -r "$SKILLS_DIR"/* "$TEST_DIR/skills/"
echo -e "   ${green}✓ Copied $(ls -1 "$TEST_DIR/skills/" | wc -l) skills${NC}"

# Create Vibe test configuration
echo -e "${blue}⚙️  Creating test configuration...${NC}"
cat > "$TEST_DIR/config.json" <<EOF
{
  "skill_paths": ["$TEST_DIR/skills"],
  "test_mode": true
}
EOF
echo -e "   ${green}✓ Created ${TEST_DIR}/config.json${NC}"

# Summary
echo ""
echo -e "${green}═══════════════════════════════════════════════════════${NC}"
echo -e "${green}✨ Setup complete!${NC}'{'${NC}'}"
echo ""
echo "   Test directory: $TEST_DIR"
echo "   Skills copied:  $(ls -1 "$TEST_DIR/skills/" | wc -l)"
echo ""
echo -e "${blue}🧪 To test a skill, use:${NC}"
echo ""
echo "   # First, add test directory to VIBE config"
echo "   export VIBE_CONFIG_DIR=$TEST_DIR"
echo ""
echo "   # Or manually test with full path"
echo "   vibe -p \"$TEST_DIR/skills/gsd-help\""
echo ""
echo -e "${blue}🔍 To validate the test setup:${NC}"
echo "   node scripts/vibe/validate-skills.js"
echo "   (Note: Edit SKILLS_DIR in the script if testing custom location)"
echo ""
echo -e "${blue}🧹 To clean up the test environment:${NC}"
echo "   rm -rf $TEST_DIR"
echo ""
