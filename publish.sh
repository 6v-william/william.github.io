
tag="$([[ $1 = "latest" ]] && echo "latest" || echo "beta")"
branch="$([[ $tag = "latest" ]] && echo "prod" || echo "daily")"

pnpm i
pnpm version patch

PACKAGE_NAME=$(node -p -e "require('./package.json').name")
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

pnpm build

pnpm publish --tag $tag --publish-branch $branch

git push --tags

git push

echo 版本发布成功: $PACKAGE_NAME v$PACKAGE_VERSION