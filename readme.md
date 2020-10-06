# GCloud SDK

This is a custom approach of using GCloud SDKs in GitHub actions. This one is more direct approach as compared to official one.

## Prerequisites

In order to use this Gcloud SDK in GitHub actions you need to create GCP Service Account and attach private key in secrets. The steps for creating GCP service account

## Setup

### Creating GCP service account

1. In the Cloud Console, go to the Service Accounts page.

2. Click Select a project, choose your project, and click Open.

3. Look for the service account you want to rename, click the More more_vert button in that row, and then click Edit.

4. Enter the new name and click Save.

5. Find the row of the service account that you want to create a key for. In that row, click the **More** button, and then click Create key.

6. Select a Key type and click Create. Download the key in the JSON format.

7. In the command line go to the directory where the json file is downloaded and convert this JSON file to base64 content, an example:
    ```
    $ cat project-service-account-key.json | base64
    ```

8. In GitHub create a secret variable with the content from previous point and name it `GCLOUD_SERVICE_ACCOUNT_PRIVATE_KEY`

### Using GitHub Action

In your GitHub workflows add a step with parameters:
```
- name: install GCloud SDK
  uses: 360codelab/gcloud-sdk@v1
  with:
    credentials: ${{ secrets.GCLOUD_SERVICE_ACCOUNT_PRIVATE_KEY }}
```

The full list of options:

* `credentials` - this is the base64 content of the service account JSON file.
* `version` - the version of the gcloud SDK to use, the default is `312.0.0`

## Usage

Right here you can fully use `gcloud` command with the applinace of beta nad alpha features. Here are some examples of usage:
```
$ gcloud run deploy "my-cloud-run-service" \
  --image "eu.gcr.io/my-project/some-nodejs-frontend:latest" \
  --region europe-west1 \
  --project my-project \
  --platform "managed" \
  --memory=512Mi \
  --port=3000

$ gcloud compute url-maps invalidate-cdn-cache my-projects-urlmap

$ gsutil cp -r build/public/* gs://my-projects-bucket/
```