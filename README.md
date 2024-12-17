# Truck2Hand Frontend Service

## Requirements

- Node v12.18.3
- Next.js v9.4.0
- StoryBook v5.3.18
- act v0.2.9

## How to develop

```sh
npm install
npm run dev
```

## How to run storybook

```sh
npm run storybook
```

## How to build

```sh
npm run build
```

## How to deploy into ECS

```
act -s AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> -s AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> -P ubuntu-latest=nektos/act-environments-ubuntu:18.04 -j deploy
```

## Coding Rules

### When to use useCallback

How to use second argument of useCallback/useEffect.

- All dependencies should put in an array of second arguments
- If some dependencies does not work correctly (e.g. the data is changed outside of react state management cycle), please remove the dependencies from the second arguments
