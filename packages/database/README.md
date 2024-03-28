# first time setup

## Local development

- create a local volume to persist data

```
docker volume create sqld-data
```

- run container using local volume

```
docker run -p 4010:8080 -d -v sqld-data:/var/lib/sqld ghcr.io/libsql/sqld:latest
```
