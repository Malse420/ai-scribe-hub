.PHONY: build clean dev install

build: install clean
	npm run build
	node scripts/build-extension.js

dev: install
	npm run dev

clean:
	rm -rf dist
	rm -f dist.zip

install:
	npm install