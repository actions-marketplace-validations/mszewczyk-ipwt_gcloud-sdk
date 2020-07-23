FROM debian:buster-slim

ARG NODEJS_VERSION=v12.18.3

RUN set -ex ;\
    apt-get update && apt-get install --no-install-recommends -y \
      curl tar ca-certificates gnupg2 git python3

RUN set -ex ;\
    useradd -m -s /bin/bash -u 1000 developer ;\
    curl https://nodejs.org/dist/$NODEJS_VERSION/node-$NODEJS_VERSION-linux-x64.tar.gz -o /opt/node-$NODEJS_VERSION-linux-x64.tar.gz ;\
    mkdir -p /usr/local/lib/nodejs ;\
    tar -xvf /opt/node-$NODEJS_VERSION-linux-x64.tar.gz -C /usr/local/lib/nodejs ;\
    rm -rf /var/lib/apt/ \
        /var/cache/apt/ \
        /opt/node-$NODEJS_VERSION-linux-x64.tar.gz

ENV PATH "/usr/local/lib/nodejs/node-$NODEJS_VERSION-linux-x64/bin:$PATH"
USER developer