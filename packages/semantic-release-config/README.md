# semantic-release-config-ori

Main usage of this package is around my project. This package is used with azure devops.

[**semantic-release**](https://github.com/semantic-release/semantic-release) shareable config to publish npm packages with [GitHub](https://github.com).

## Plugins

This [shareable configuration](https://github.com/jedmao/semantic-release-npm-github-config/blob/master/.releaserc.json) uses the following plugins:

- [`@semantic-release/commit-analyzer`](https://github.com/semantic-release/commit-analyzer)
- [`@semantic-release/release-notes-generator`](https://github.com/semantic-release/release-notes-generator)
- [`@semantic-release/changelog`](https://github.com/semantic-release/changelog)
- [`@semantic-release/npm`](https://github.com/semantic-release/npm)
- [`@semantic-release/git`](https://github.com/semantic-release/git)

## Install

```bash
npm install --save-dev semantic-release semantic-release-config-ori
```

## Usage

The shareable config can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "extends": "semantic-release-config-ori",
  "branch": "master"
}
```
