@Library('web-service-helper-lib') _

pipeline {
    
    agent any
   
    tools {
        nodejs 'NodeJS 18.12'
        maven 'Maven 3.8.6'
    }

    options {
        ansiColor('xterm')
    }

    environment {
        API_URL_SELFLEARN = "https://staging.sse.uni-hildesheim.de:9010/api-json"
        API_URL_SEARCH = "https://staging.sse.uni-hildesheim.de:9011/api-json"
        DOCKER_TARGET = 'e-learning-by-sse/nm-competence-repository'
        REMOTE_UPDATE_SCRIPT = '/staging/update-compose-project.sh nm-competence-repository'
    }

    stages {
        stage("NodeJS Builds") {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                    args '--tmpfs /.cache -v $HOME/.npm:/.npm'
                }
            }
            stages {
                stage('Install Dependencies') {
                    steps {
                        sh 'npm install'
                    }
                }

                stage('Lint') {
                    steps {
                        sh 'npm run lint:ci'
                    }
                }            
            }
        }
        
        stage('Test') {
            environment {
                POSTGRES_DB = 'competence-repository-db'
                POSTGRES_USER = 'postgres'
                POSTGRES_PASSWORD = 'admin'
                
                JWT_SECRET = 'SEARCH_SECRET'
                EXTENSION = 'SEARCH'
                DB_URL = "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public"
            }
            steps {
                script {
                    docker.image('postgres:14.3-alpine').withRun("-e POSTGRES_USER=${env.POSTGRES_USER} -e POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD} -e POSTGRES_DB=${env.POSTGRES_DB}") { c ->
                        docker.image('postgres:14.3-alpine').inside("--link ${c.id}:db") {
                            sh "sleep 20"
                        }
                        docker.image('node:18-bullseye').inside("--link ${c.id}:db") {
                            //sh 'mv .env env-settings_backup' // only use jenkins env
                            sh 'npx prisma db push'
                            sh 'npm run test:jenkins'
                        }
                    }
                }
                step([
                    $class: 'CloverPublisher',
                    cloverReportDir: 'output/test/coverage/',
                    cloverReportFileName: 'clover.xml',
                    healthyTarget: [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],   // optional, default is: method=70, conditional=80, statement=80
                    unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50], // optional, default is none
                    failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]       // optional, default is none
                ])
            }
            post {
                always {
                    junit 'output/**/junit*.xml'
               }
            }
        }

        stage('Build') {
            steps {
                sh 'mv docker/Dockerfile Dockerfile'
                script {
                    API_VERSION = sh(returnStdout: true, script: 'grep -Po "(?<=\"version\": \")(.*)(?=\",$)" package.json').trim()
                    //API_VERSION = sh(returnStdout: true, script: 'grep -Po "(?<=export const VERSION = \')[^\';]+" src/version.ts').trim()
                    dockerImage = docker.build "${DOCKER_TARGET}"
                    publishDockerImages("${env.DOCKER_TARGET}", ["${API_VERSION}", "latest"])
                }
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'dev'
                    branch 'main'
                }
            }
            steps {
                stagingDeploy("${REMOTE_UPDATE_SCRIPT}")
            }
        }
        
        stage('Publish Swagger Client') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Wait for services to be up and running
                    sleep(time: 45, unit: "SECONDS")
                    API_VERSION = sh(returnStdout: true, script: 'grep -Po "(?<=export const VERSION = \')[^\';]+" src/version.ts').trim()
					generateSwaggerClient("${API_URL_SELFLEARN}", "${API_VERSION}", 'net.ssehub.e_learning', 'competence_repository_selflearn_api', ['typescript-axios']) {
						publishNpmIfNotExist("@e-learning-by-sse", "competence_repository_selflearn_api", "${API_VERSION}", 'target/generated-sources/openapi', "Github_Packages_Read", "GitHub-NPM")
					}
					generateSwaggerClient("${API_URL_SEARCH}", "${API_VERSION}", 'net.ssehub.e_learning', 'competence_repository_search_api', ['typescript-axios']) {
						publishNpmIfNotExist("@e-learning-by-sse", "competence_repository_search_api", "${API_VERSION}", 'target/generated-sources/openapi', "Github_Packages_Read", "GitHub-NPM")
					}
                }
            }
        }
    }
}

