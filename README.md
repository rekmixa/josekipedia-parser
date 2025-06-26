# josekipedia-parser

> Node v20.11.0  
> Typescript v5.6.2

Install dependencies:

```bash
yarn
```

Run script:

```bash
yarn download
yarn download --mtypes=0,1,3
```

With Docker:

```bash
make up logs
make stop
make down
make restart
make env
```

Create sgf:

```bash
yarn create-sgf
yarn create-sgf --with-comments
yarn create-sgf --with-comments --mtypes=0,1,3
```

sgf will be stored in data/all-josekis.sgf or data/all-josekis-with-comments.sgf
