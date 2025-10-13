#!/bin/bash
# KAIROS Mass Modernization Script
# Applies modern web standards to HTML files with safety checks

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_info() { echo "→ $1"; }

# Function: Fix theme.js placement (move to end of <head>)
fix_theme_script() {
    local file="$1"
    
    # Check if file contains theme.js script tag (anywhere in head)
    if grep -q '<script src="/theme.js"></script>' "$file" && grep -q '</head>' "$file"; then
        # Check if it's already at the end of head (right before </head>)
        if grep -B1 '</head>' "$file" | grep -q '<script src="/theme.js"></script>'; then
            return 1  # Already in correct position
        fi
        
        log_info "Moving theme.js to end of <head> in $(basename $file)"
        
        # Remove the theme.js line wherever it is
        sed -i '/<script src="\/theme.js"><\/script>/d' "$file"
        
        # Add it before </head>
        sed -i 's|</head>|  <script src="/theme.js"></script>\n</head>|' "$file"
        
        return 0
    fi
    
    return 1
}

# Function: Add skip link if missing
add_skip_link() {
    local file="$1"
    
    # Check if skip link already exists
    if grep -q "skip-link" "$file"; then
        return 1
    fi
    
    log_info "Adding skip link to $(basename $file)"
    
    # Add skip link after <body> tag
    sed -i 's|<body|<body|; /<body/a\  <a href="#main" class="skip-link">Skip to content</a>' "$file"
    
    return 0
}

# Function: Add role="main" to main element if missing
fix_main_role() {
    local file="$1"
    
    # Check if <main> exists without role or tabindex
    if grep -q '<main id="main">' "$file"; then
        log_info "Adding role and tabindex to main in $(basename $file)"
        sed -i 's|<main id="main">|<main id="main" role="main" tabindex="-1">|g' "$file"
        return 0
    fi
    
    return 1
}

# Function: Add role="banner" to header if missing
fix_header_role() {
    local file="$1"
    
    # Check for header without role
    if grep -q '<header>' "$file" && ! grep -q 'role="banner"' "$file"; then
        log_info "Adding role=\"banner\" to header in $(basename $file)"
        sed -i 's|<header>|<header role="banner">|g' "$file"
        return 0
    fi
    
    return 1
}

# Function: Add role="contentinfo" to footer if missing
fix_footer_role() {
    local file="$1"
    
    # Check for footer without role
    if grep -q '<footer>' "$file" && ! grep -q 'role="contentinfo"' "$file"; then
        log_info "Adding role=\"contentinfo\" to footer in $(basename $file)"
        sed -i 's|<footer>|<footer role="contentinfo">|g' "$file"
        return 0
    fi
    
    return 1
}

# Main function: Process a single file
process_file() {
    local file="$1"
    local changed=0
    
    echo ""
    log_info "Processing: $file"
    
    # Apply fixes
    if fix_theme_script "$file"; then changed=1; fi
    if add_skip_link "$file"; then changed=1; fi
    if fix_main_role "$file"; then changed=1; fi
    if fix_header_role "$file"; then changed=1; fi
    if fix_footer_role "$file"; then changed=1; fi
    
    if [ $changed -eq 1 ]; then
        log_success "Modified: $(basename $file)"
        return 0
    else
        log_warning "No changes needed: $(basename $file)"
        return 1
    fi
}

# Main execution
main() {
    local files=("$@")
    local total=${#files[@]}
    local modified=0
    
    echo "==================================="
    echo "KAIROS Mass Modernization Script"
    echo "==================================="
    echo "Files to process: $total"
    echo ""
    
    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "File not found: $file"
            continue
        fi
        
        if process_file "$file"; then
            ((modified++))
        fi
    done
    
    echo ""
    echo "==================================="
    log_success "Complete: $modified/$total files modified"
    echo "==================================="
    
    # Always exit 0 so we can process all files
    exit 0
}

# Run with all provided files
main "$@"
