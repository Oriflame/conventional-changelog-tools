# conventional-changelog-lint-config-oriflame

Config for [oriflame preset](../conventional-changelog).

## Getting started

```sh
# Install commitlint cli and conventional config
npm install --save-dev @commitlint/cli conventional-changelog-lint-config-oriflame
# Or use yarn
yarn add --dev @commitlint/cli conventional-changelog-lint-config-oriflame

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['conventional-changelog-lint-config-oriflame']}" > commitlint.config.js
```

To lint commits before they are created you can use Husky's 'commit-msg' hook:

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Further instructions

[commitlint](https://github.com/conventional-changelog/commitlint)
