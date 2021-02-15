init:
	pnpm install --shamefully-hoist

dev:
	pnpm dev

package:
	pnpm package

release: package
	pnpm release