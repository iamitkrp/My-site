import os
import re

def check_html(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    opens = len(re.findall(r'<script', content, re.IGNORECASE))
    closes = len(re.findall(r'</script>', content, re.IGNORECASE))
    
    if opens != closes:
        print(f"File {filepath} has unbalanced script tags: {opens} opens, {closes} closes")

for root, dirs, files in os.walk('.'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    for file in files:
        if file.endswith('.html'):
            check_html(os.path.join(root, file))
