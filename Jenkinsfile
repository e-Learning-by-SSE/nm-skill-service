@Library('web-service-helper-lib') _

pipeline {
    agent {
        label 'docker && maven'
    }

    environment {
        TARGET_PREFIX = 'e-learning-by-sse/nm-skill-service'
        DOCKER_TARGET = "${TARGET_PREFIX}:unstable"
        REMOTE_UPDATE_SCRIPT = '/staging/update-compose-project.sh nm-competence-repository'
        NPMRC = 'e-learning-by-sse'

        POSTGRES_DB = 'competence-repository-db'
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = 'admin'

        API_VERSION = packageJson.getVersion()
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
                    args '--tmpfs /.cache -u root -v /var/run/docker.sock:/var/run/docker.sock '
                }
            }
            stages {
                stage("Prepare Build env") {
                    steps {
                        sh 'rm -rf output/'
                        sh 'rm -rf src/output/'
                        sh 'npm install'
                        sh 'apt update'
                        sh 'apt install -y docker.io'
                    }
                }

                stage('Build and Lint') {
                    steps {
                        sh 'npx prisma generate'
                        sh 'npm run build'
                        warnError('Linting failed') {
                            sh 'npm run lint:ci'
                        }
                    }
                }

                stage('Test') {
                    environment {
                        DB_URL = "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"
                        SAVE_LOG_TO_FILE = true
                        LOG_LEVEL = "info"
                        PASSING_THRESHOLD = 0.5
                        BERUFENET_BASEURL="https://rest.arbeitsagentur.de/infosysbub/bnet/pc/v1"
                        BERUFENET_CLIENT_SECRET="infosysbub-berufenet"
                        BERUFENET_TIMEOUT=120000
                    }
                    steps {
                        script {
                            try {
                                withPostgres([ dbUser: env.POSTGRES_USER,  dbPassword: env.POSTGRES_PASSWORD,  dbName: env.POSTGRES_DB ]).insideSidecar('node:18-bullseye') {
                                  sh 'mv .env env-settings.backup' // only use jenkins .env
                                  sh 'npx prisma db push'
                                  sh 'npm run test:jenkins'
                                  sh 'mv env-settings.backup .env' // Restore .env
                                  sh 'touch testfile.txt'
                                }
                            } catch(err) {
                                if (env.BRANCH_NAME == 'main') {
                                    error('Stopping build on master branch due to test failures.')
                                } else {
                                    unstable('Tests failed, but continuing build on development branches.')
                                }            
                            }
                        }
                    }
                    post {
                        success {
                            // Test Results
                            junit 'output/test/junit*.xml'

                            // New Coverage Tool: Cobertura + Coverage Plugin
                            recordCoverage qualityGates: [[metric: 'LINE', threshold: 75.0], [metric: 'BRANCH', threshold: 60.0]], tools: [[parser: 'COBERTURA', pattern: 'src/output/test/coverage/cobertura-coverage.xml'], [parser: 'JUNIT', pattern: 'output/test/junit*.xml']]
                        }
                    }
                }

                stage('Docker Build') {
                    when {
                        branch 'main'
                    }
					steps {
                        ssedocker {
                            create {
                                target "${env.DOCKER_TARGET}"
                            }
                            publish {}
                        }
                    }
                }
            }
        }

        stage('Starting Post Build Actions') {
            parallel {
                stage('Deploy Staging') {
                    when {
                        branch 'main'
                    }
                    steps {
                        staging01ssh env.REMOTE_UPDATE_SCRIPT
                    }
                }

                stage('Create Release (Swagger and Docker)') {
                    when {
                        buildingTag()
                    }
                    options {
                        timeout(time: 200, unit: 'SECONDS')
                    }
                    environment {
                        APP_URL = "http://localhost:3000/api-json"
                    }
                    steps {
                        ssedocker {
                            create {
                                target "${env.TARGET_PREFIX}:latest"
                            }
                            publish {
                                tag "${env.API_VERSION}"
                            }
                        }
                    }
                }
            }
        }
    }
}
