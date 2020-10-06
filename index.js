const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const url = require('url');
const https = require('https');
const cprocess = require('child_process')

const available_versions = [
  '295.0.0',
  '296.0.0',
  '296.0.1',
  '297,0.0',
  '297.0.1',
  '298.0.0',
  '299.0.0',
  '300.0.0',
  '301.0.0',
  '302.0.0',
  '303.0.0',
  '304.0.0',
  '305.0.0',
  '306.0.0',
  '307.0.0',
  '308.0.0',
  '309.0.0',
  '310.0.0',
  '311.0.0',
  '312.0.0'
]
const download_dir = `${__dirname}/.gcloudsdk`
const download_file = `${download_dir}/gcloud-sdk.tar.gz`
const gcloud_credentials_file = `${download_dir}/creds`
const gcloud_config_dir = `${download_dir}/config`


function create_dir(directory) {
  if (fs.existsSync(directory)) {
    return;
  } else {
    fs.mkdir(
      directory,
      (err) => {
        if (err) {
          throw err;
        }
      }
    )
  }
}

function download_gcloud_sdk(version) {
  if (available_versions.includes(version)) {
    console.log(`Downloading GCloud SDK version ${version}`);
    create_dir(
      download_dir
    )
    download_url = `https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${version}-linux-x86_64.tar.gz`
    const options = {
      host: url.parse(download_url).host,
      port: 443,
      path: url.parse(download_url).pathname
    }
    var file = fs.createWriteStream(download_file);
    https.get(
      options,
      function(res) {
        res.on(
          'data',
          function(data) {
            file.write(data);
          }
        ).on(
          'end',
          function() {
            file.end();
            console.log(`File ${download_url} downloaded successfully`);
            unarchive_gcloud_sdk();
          }
        )
      }
    )
  } else {
    console.error(`cannot find version ${version}`)
    process.exit(1)
  }
}

function unarchive_gcloud_sdk() {
  console.log(`Unarchiving file ${download_file}`)
  cprocess.exec(`tar -C ${download_dir} -xzf ${download_file}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    init_gcloud_sdk();
  }
  );
}

function init_gcloud_sdk() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = gcloud_credentials_file
  process.env.CLOUDSDK_CORE_DISABLE_PROMPTS = '1'
  process.env.CLOUDSDK_CONFIG = gcloud_config_dir
  const credentials_base64 = core.getInput('credentials')
  const buff = Buffer.from(
    credentials_base64,
    'base64'
  )
  fs.writeFile(
    gcloud_credentials_file,
    buff,
    (err) => {
      if (err) throw err;
      else {
        cprocess.exec(`gcloud auth activate-service-account --key-file="${gcloud_credentials_file}"`)

      }
    }
  )
  export_variables()
}

function export_variables() {
  core.addPath(download_dir + '/google-cloud-sdk/bin')
  core.exportVariable('CLOUDSDK_CONFIG', process.env.CLOUDSDK_CONFIG)
  core.exportVariable('CLOUDSDK_CORE_DISABLE_PROMPTS', process.env.CLOUDSDK_CORE_DISABLE_PROMPTS)
  core.exportVariable('GOOGLE_APPLICATION_CREDENTIALS', process.env.GOOGLE_APPLICATION_CREDENTIALS)
}

try {
  const version = core.getInput('version')
  download_gcloud_sdk(version);
} catch (error) {
  core.setFailed(error.message);
}