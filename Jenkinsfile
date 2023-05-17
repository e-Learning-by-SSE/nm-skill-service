@Library('web-service-helper-lib') _

pipeline {
    agent {
        label 'docker && maven'
    }

    environment {
        DOCKER_TARGET = 'e-learning-by-sse/nm-competence-repository:latest'
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

                stage('Lint') {
                    steps {
                        sh 'npm run lint:ci'
                    }
                }

                stage('Test') {
                    environment {
                        DB_URL = "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"
                    }
                    steps {
                        script {
                            withPostgres([ dbUser: env.POSTGRES_USER,  dbPassword: env.POSTGRES_PASSWORD,  dbName: env.POSTGRES_DB ]).insideSidecar('node:18-bullseye') {
                                sh 'mv .env env-settings.backup' // only use jenkins .env
                                sh 'npx prisma db push'
                                sh 'npm run versioning'
                                sh 'npm run test:jenkins'
                                sh 'mv env-settings.backup .env' // Restore .env
                                sh 'touch testfile.txt'
                            }
                        }
                    }
                    post {
                        success {
                            step([
                                $class: 'CloverPublisher',
                                cloverReportDir: 'output/test/coverage/',
                                cloverReportFileName: 'clover.xml',
                                healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],   // optional, default is: method=70, conditional=80, statement=80
                                unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50], // optional, default is none
                                failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]       // optional, default is none
                            ])
                        }
                        always {
                            junit 'output/**/junit*.xml'
                        }
                    }
                }

                stage('Build') {
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
                        timeout(time: 120, unit: 'SECONDS')
                    }
                    environment {
                        APP_URL = "http://localhost:3000/api-json"
                        clientEnvs = '''[
                            {"extension": "SELFLEARN", "pkg": "competence_repository_selflearn_api"},
                            {"extension": "SEARCH", "pkg": "competence_repository_search_api"}
                        ]'''
                    }
                    steps {
                        script {
                            sh 'rm -f competence_repository*.zip'
							def envs = readJSON text: env.clientEnvs
                            for (envspecific in envs) {
                                def extension = envspecific.extension
                                def pkg = envspecific.pkg

                                docker.image(env.DOCKER_TARGET).withRun("-e EXTENSION=\"${extension}\" -p 3000:3000") {
                                    generateSwaggerClient("${env.APP_URL}", "${API_VERSION}", 'net.ssehub.e_learning', "${pkg}", ['python', 'python-nextgen'])

                                    generateSwaggerClient("${env.APP_URL}", "${API_VERSION}", 'net.ssehub.e_learning', "${pkg}", ['typescript-axios python ']) {
                                        docker.image('node').inside('-v $HOME/.npm:/.npm') {
                                            dir('target/generated-sources/openapi') {
                                                sh 'npm install'
                                                publishNpm("${NPMRC}")
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
}
