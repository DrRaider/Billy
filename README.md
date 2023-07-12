# Billy technical test

[Link](https://gitlab.com/billy-smooth/retrieve-raw-events-data)

## Installation

```bash
$ yarn install

$ mv .env.example .env
```

### Database setup
```bash
$ docker-compose up -d

$ yarn db:seed
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## API Test

```bash
# Fetch all events
HTTP GET "http://localhost:3000/events"

# Fetch all events with date filters on sale start time
# "from" and "to" are optional query parameters
# They must follow the "DD/MM/YYYY" pattern
HTTP GET "http://localhost:3000/events?from=DD/MM/YYYY&to=DD/MM/YYYY"

# Fetch one event by id
HTTP GET "http://localhost:3000/events/:id"

# Update one event by id
# Body can have the following properties:
  # title?: string;
  # lineup?: string[];
  # assetUrl?: string;
  # collectionNames?: [
  #   {
  #     from: string;
  #     to: string;
  #   },
  # ];
# "from" and "to" are used to find which collectionNames should be updated.
HTTP PUT "http://localhost:3000/events/:id"
```

