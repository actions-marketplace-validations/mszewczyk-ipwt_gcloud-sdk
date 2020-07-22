FROM debian:buster-slim as prepare

ARG GCLOUD_VERSION=301.0.0

WORKDIR /data

RUN apt-get update && apt-get install -y curl ca-certificates tar ;\
    curl -o gcloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-$GCLOUD_VERSION-linux-x86_64.tar.gz ;\
    tar -xvf gcloud-sdk.tar.gz

FROM debian:buster-slim

COPY --from=prepare /data/google-cloud-sdk /opt/google-cloud-sdk
COPY entrypoint.sh /usr/bin/entrypoint

RUN apt-get update && apt-get install -y --no-install-recommends python3 ;\
    rm -rf /var/lib/apt/* ;\
    chmod +x /usr/bin/entrypoint

ENV PATH=$PATH:/opt/google-cloud-sdk/bin

ENTRYPOINT ["/usr/bin/entrypoint"]