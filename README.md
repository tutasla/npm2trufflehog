# npm2trufflehog

This small Docker container lets you to download all versions of a npm package from the npm Registry using an `trufflehog-` alias. After downloading, it automatically runs TruffleHog to detect secrets within the package files.

Additionally, if you use bind mounts to store the downloaded files, they can be retained for further inspection or analysis outside of the container.

### Dependencies

* Docker or podman

### Installing

* Put the package name you want to download in Dockerfile:
```
ENV NPM_PACKAGE_NAME hello-world-npm
```

* Then build the image using docker or podman:
```
docker build . -t npm2trufflehog

podman build . -t npm2trufflehog
```

* Run the container:
```
docker run --rm npm2trufflehog

podman run --rm npm2trufflehog
```

* Bind mount to store the package files:

```
mkdir pkg
docker run -v $PWD/pkg:/tmp npm2trufflehog

podman run -v $PWD/pkg:/tmp npm2trufflehog
```

* Get shell to inspect inside the container:
```
docker run -it -v $PWD/pkg:/tmp --entrypoint /bin/sh npm2trufflehog

podman run -it -v $PWD/pkg:/tmp --entrypoint /bin/sh npm2trufflehog
```

### Example output:

Path `trufflehog-15` means it was the 15th package from the list of package versions.

```
Running trufflehog...
Found unverified result 🐷🔑❓
Detector Type: Postman
Decoder Type: PLAIN
Raw result: PMAK-qnwfsLyRSyfCwfpHaQP1UzDhrgpWvHjbYzjpRCMshjt417zWcrzyHUArs7r
File: node_modules/trufflehog-15/file.txt
Line: 1


stderr: 🐷🔑🐷  TruffleHog. Unearth your secrets. 🐷🔑🐷

2025-01-26T12:06:12Z	info-0	trufflehog	running source	{"source_manager_worker_id": "dN6QI", "with_units": true}
2025-01-26T12:06:12Z	info-0	trufflehog	finished scanning	{"chunks": 65, "bytes": 16191, "verified_secrets": 0, "unverified_secrets": 1, "scan_duration": "4.837952ms", "trufflehog_version": "3.88.2", "verification_caching": {"Hits":0,"Misses":0,"HitsWasted":0,"AttemptsSaved":0,"VerificationTimeSpentMS":0}}
```

### Other ideas:
Search for sensitive or interesting content/documentation in files such as .env, config.json, README.md, and others. Older versions of packages might contain data that has been removed or sanitized in more recent releases.


## Links

* [trufflehog](https://github.com/trufflesecurity/trufflehog)

## License

[MIT](https://choosealicense.com/licenses/mit/)
