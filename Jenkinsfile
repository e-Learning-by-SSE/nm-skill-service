@Library('web-service-helper-lib') _

pipeline {
    agent any

    tools {
        nodejs 'NodeJS 16.13'
        maven 'Maven 3.8.6'
    }

    environment {
        API_URL_SELFLEARN = "https://staging.sse.uni-hildesheim.de:9010/api-json"
        API_URL_SEARCH = "https://staging.sse.uni-hildesheim.de:9011/api-json"
        DOCKER_TARGET = 'e-learning-by-sse/nm-competence-repository:latest'
        REMOTE_UPDATE_SCRIPT = '/staging/update-compose-project.sh nm-competence-repository'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            environment {
                POSTGRES_DB = 'competence-repository-db'
                POSTGRES_USER = 'postgres'
                POSTGRES_PASSWORD = 'admin'
                PORT = '5435'
            }
            steps {
                script {
                    // Sidecar Pattern: https://www.jenkins.io/doc/book/pipeline/docker/#running-sidecar-containers
                    docker.image('postgres:14.1-alpine').withRun("-e POSTGRES_USER=${env.POSTGRES_USER} -e POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD} -e POSTGRES_DB=${env.POSTGRES_DB} -p ${env.PORT}:5432") { c ->
                        sh "sleep 20"
                        sh 'npx prisma db push'
                        sh 'npm run test:jenkins'
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

        stage('Lint') {
            steps {
                sh 'npm run lint:ci'
            }
        }

        stage('Build') {
            steps {
                sh 'mv docker/Dockerfile Dockerfile'
                script {
                    API_VERSION = sh(returnStdout: true, script: 'grep -Po "(?<=export const VERSION = \')[^\';]+" src/version.ts').trim()
                    publishDockerImages("${env.DOCKER_TARGET}", ["${API_VERSION}", "latest"])
                }
            }
        }
        
	stage('Deploy') {
            steps {
                stagingDeploy("${REMOTE_UPDATE_SCRIPT}")
            }
        }
        
        stage('Publish Swagger Client') {
	    when {
		    expression { env.BRANCH_NAME ==~ /^(master|main)/  }
	    }
            steps {
                script {
                    API_VERSION = sh(returnStdout: true, script: 'grep -Po "(?<=export const VERSION = \')[^\';]+" src/version.ts').trim()
                    generateSwaggerClient("${API_URL_SELFLEARN}", "${API_VERSION}", 'net.ssehub.e_learning', 'competence_repository_selflearn_api', ['javascript', 'typescript-angular', 'typescript-axios'])
		    withCredentials([string(credentialsId: 'GitHub-NPM', variable: 'Auth')]) {
		        publishNpmPackage('target/generated-sources/openapi', "$Auth")
		    }
                    generateSwaggerClient("${API_URL_SEARCH}", "${API_VERSION}", 'net.ssehub.e_learning', 'competence_repository_search_api', ['javascript', 'typescript-angular', 'typescript-axios'])
		    withCredentials([string(credentialsId: 'GitHub-NPM', variable: 'Auth')]) {
		        publishNpmPackage('target/generated-sources/openapi', "$Auth")
		    }
                }
            }
        }
    }
}

