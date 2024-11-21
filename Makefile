.PHONY: build clean dev

build: clean
	npm run build
	node scripts/build-extension.js

dev:
	npm run dev

clean:
	rm -rf dist
	rm -f dist.zip