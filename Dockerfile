FROM node:23-alpine3.20@sha256:dd3250c7d36069dfcdc4864887085a057d781dfedb8ba2467ef97f34ceee260a

ENV NPM_PACKAGE_NAME hello-world-npm

ENV NPM_REGISTRY_API https://registry.npmjs.org/${NPM_PACKAGE_NAME}

ENV TRUFFLEHOG_VERSION 3.88.2
ENV TRUFFLEHOG_TAR_FILE trufflehog_${TRUFFLEHOG_VERSION}_linux_amd64.tar.gz
ENV TRUFFLEHOG_CHECKSUM_FILE trufflehog_${TRUFFLEHOG_VERSION}_checksums.txt
ENV TRUFFLEHOG_TAR_RELEASE https://github.com/trufflesecurity/trufflehog/releases/download/v${TRUFFLEHOG_VERSION}/${TRUFFLEHOG_TAR_FILE}
ENV TRUFFLEHOG_TAR_CHECKSUM https://github.com/trufflesecurity/trufflehog/releases/download/v${TRUFFLEHOG_VERSION}/${TRUFFLEHOG_CHECKSUM_FILE}

# extract package names
RUN apk add jq \
  && apk cache clean \
  && wget "$NPM_REGISTRY_API" -O api_json \
  && jq -r '.versions[]._id' api_json > packages.txt \
  && rm api_json 

# install trufflehog
RUN mkdir /trufflehog \
  && wget "$TRUFFLEHOG_TAR_RELEASE" \
  && wget "$TRUFFLEHOG_TAR_CHECKSUM" \
  && sha256sum -c "$TRUFFLEHOG_CHECKSUM_FILE" | grep "OK" \
  && tar -C /trufflehog -xzf "$TRUFFLEHOG_TAR_FILE" \
  && ln -sf /trufflehog/trufflehog /usr/local/bin \
  && rm "$TRUFFLEHOG_TAR_FILE"

ADD npm2trufflehog.js npm2trufflehog.js

WORKDIR /tmp

ENTRYPOINT ["node", "/npm2trufflehog.js"]