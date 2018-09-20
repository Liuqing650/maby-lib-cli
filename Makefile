SPEC_FLAGS=-R spec
COVERAGE_FLAGS=-R mocha-text-cov
GULP=./node_modules/.bin/gulp
WEBPACK=./node_modules/.bin/webpack
WEBPACK_DEV_SERVER=./node_modules/.bin/webpack-dev-server
SOURCE=./src
LIB=./lib

dev:
	@mkdir -p $(LIB)
	# @cp -Rfv $(SOURCE)/* $(LIB)
	@$(WEBPACK_DEV_SERVER) --config webpack.dev.js --open

build:
	@$(WEBPACK) --progress --config webpack.prod.js
	@$(GULP)

watch:
	@$(WEBPACK) -p --progress --config webpack.dev.js --watch

clean:
	@if [ -d dist ]; then rm -r dist; fi
	@if [ -d lib ]; then rm -r lib; fi

.PHONY: dev build watch clean