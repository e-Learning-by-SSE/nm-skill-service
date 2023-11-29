@Library('web-service-helper-lib') _

pipeline {
    agent {
        label 'docker && maven'
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage("Starting NodeJS Build") {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                    label 'docker'
                    args '--tmpfs /.cache -u root -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            stages {
                stage("Checkout from GIT") {
                    steps {
                    checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/e-Learning-by-SSE/nm-liascript-exporter-lib.git']])
                    }
                }
                
                stage("Prepare Build env") {
                    steps {
                        sh 'rm -rf output/'
                        sh 'rm -rf src/output/'
                        sh 'npm install'
                        sh 'apt update'
                        sh 'apt install -y docker.io'
                    }
                }


                stage('Build') {
                    steps {
                        sh 'npm install'
                        npmPublish('e-learning-by-sse')
                    }
                }
            }
        }
    }
}
