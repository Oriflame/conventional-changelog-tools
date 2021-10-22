# @oriflame/pull-request-check

Small internal library that checks pull request title.

## Usage in azure pipelines

```yml
  - powershell: |
      npx @oriflame/pull-request-check
    displayName: Check pull request name
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
```
