import re

with open('src/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize whitespace in tags: replace multiple spaces/newlines inside <...> with a single space
def clean_tag(match):
    tag = match.group(0)
    # Don't touch script/style content, only the tags themselves
    if tag.startswith('</'): return tag
    # Collapse multiple spaces and newlines into one space
    cleaned = re.sub(r'\s+', ' ', tag)
    # Remove space before > or />
    cleaned = re.sub(r' ?/?>', lambda m: m.group(0).strip(), cleaned)
    # Ensure space before attributes
    # This is complex, let's keep it simple: just fix common issues
    return cleaned

# Find all tags
content = re.sub(r'<[^>]+>', clean_tag, content)

with open('src/index_clean.html', 'w', encoding='utf-8') as f:
    f.write(content)
