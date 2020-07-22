#!/bin/bash
CLOUDSDK_CORE_DISABLE_PROMPTS=1
gcloud auth activate-service-account --key-file=<(echo "$GCLOUD_JSON_FILE" | base64 -d)
gcloud $@