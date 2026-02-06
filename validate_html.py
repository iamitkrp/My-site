import html.parser

class MyHTMLParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
    def handle_starttag(self, tag, attrs):
        if tag not in ['img', 'br', 'hr', 'link', 'meta', 'input', 'canvas']:
            self.tags.append((tag, self.getpos()))
    def handle_endtag(self, tag):
        if tag not in ['img', 'br', 'hr', 'link', 'meta', 'input', 'canvas']:
            if not self.tags or self.tags[-1][0] != tag:
                 print(f"Error: Unexpected closing tag {tag} at {self.getpos()}. Expected {self.tags[-1][0] if self.tags else 'None'}")
            else:
                 self.tags.pop()

parser = MyHTMLParser()
with open('src/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    try:
        parser.feed(f.read())
    except Exception as e:
        print(f"Parser crashed: {e}")

if parser.tags:
    print("Unclosed tags:")
    for t, pos in parser.tags:
        print(f"  Tag <{t}> at {pos}")
