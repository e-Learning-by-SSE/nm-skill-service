@Library('web-service-helper-lib') _

pipeline {
    agent {
        label 'docker && maven'
    }

    environment {
        DOCKER_TARGET = 'e-learning-by-sse/nm-skill-service:latest'
        REMOTE_UPDATE_SCRIPT = '/staging/update-compose-project.sh nm-competence-repository'
        NPMRC = 'e-learning-by-sse'

        POSTGRES_DB = 'competence-repository-db'
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = 'admin'

        JWT_SECRET = 'SEARCH_SECRET'
        EXTENSION = 'SEARCH'

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
                        sh 'npm run build'
                        sh 'npx prisma generate'
                        warnError('Linting failed') {
                            sh 'npm run lint:ci'
                        }
                    }
                }

                stage('Test') {
                    environment {
                        DB_URL = "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"
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
                                if (env.BRANCH_NAME == 'master') {
                                    error('Stopping build on master branch due to test failures.')
                                } else {
                                    unstable('Tests failed, but continuing build on development branches.')
                                }            
                            }
                        }
                    }
                    post {
                        success {
                            step([
                                $class: 'CloverPublisher',
                                cloverReportDir: 'src/output/test/coverage/',
                                cloverReportFileName: 'clover.xml',
                                healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],   // optional, default is: method=70, conditional=80, statement=80
                                unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50], // optional, default is none
                                failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]       // optional, default is none
                            ])
                            junit 'output/test/junit*.xml'
                        }
                    }
                }

                stage('Docker Build') {
                    steps {
                        ssedocker {
                            create {
                                target "${env.DOCKER_TARGET}"
                            }
                            publish {
                                tag "${env.API_VERSION}"
                            }
                        }
                    }
                }
            }
        }

        stage('Starting Post Build Actions') {
            parallel {

                stage('Deploy') {
                    when {
                        anyOf {
                            branch 'dev'
                            branch 'main'
                        }
                    }
                    steps {
                        stagingDeploy env.REMOTE_UPDATE_SCRIPT
                    }
                }

                stage('Publish Swagger Clients') {
                    when {
                        allOf {
                            branch 'main'
                            expression { packageJson.isNewVersion() }
                        }
                    }
                    options {
                        timeout(time: 200, unit: 'SECONDS')
                    }
                    environment {
                        APP_URL = "http://localhost:3000/api-json"
                    }
                    steps {
                        script {
                            sh 'rm -f competence_repository*.zip'
                            docker.image(env.DOCKER_TARGET).withRun("-e EXTENSION=\"SEARCH\" -p 3000:3000") {
                                // Wait for the application to be ready (after container was started)  
                                sleep(time:30, unit:"SECONDS")
                
                                generateSwaggerClient("${env.APP_URL}", "${API_VERSION}", 'net.ssehub.e_learning', "competence_repository_search_api", ['python'])

                                generateSwaggerClient("${env.APP_URL}", "${API_VERSION}", 'net.ssehub.e_learning', "competence_repository_search_api", ['typescript-axios']) {
                                    docker.image('node').inside('-v $HOME/.npm:/.npm') {
                                        dir('target/generated-sources/openapi') {
                                            sh 'npm install'
                                            npmPublish("${NPMRC}")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
