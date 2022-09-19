pipeline {
    agent any

    tools {nodejs "NodeJS 16.13"}

    environment {
        DEMO_SERVER = '147.172.178.30'
        DEMO_SERVER_PORT = '3100'
        API_FILE = 'api-json'
        API_URL = "http://${env.DEMO_SERVER}:${env.DEMO_SERVER_PORT}/${env.API_FILE}"

        dockerImage = ''
    }

    stages {

        stage('Git') {
            steps {
                cleanWs()
                git branch: 'main', url: 'https://github.com/e-Learning-by-SSE/nm-competence-repository-service.git'
            }
        }

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

        stage('Build') {
            steps {
                sh 'mv docker/Dockerfile Dockerfile'
                script {
                    // Based on:
                    // - https://stackoverflow.com/a/16817748
                    // - https://stackoverflow.com/a/51991389
                    env.API_VERSION = sh returnStdout: true, script: 'grep -Po \'(?<=export const VERSION = ")[^";]+\' src/version.ts'
                    echo "API: ${env.API_VERSION}"
                    dockerImage = docker.build 'e-learning-by-sse/nm-competence-repository'
                    docker.withRegistry('https://ghcr.io', 'github-ssejenkins') {
                        dockerImage.push(${env.API_VERSION})
                        dockerImage.push('latest')
                    }
                }
            }
        }

        // Based on: https://medium.com/@mosheezderman/c51581cc783c
        stage('Deploy') {
            steps {
                sshagent(credentials: ['Stu-Mgmt_Demo-System']) {
                    sh """
                        # [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                        # ssh-keyscan -t rsa,dsa example.com >> ~/.ssh/known_hosts
                        ssh -i ~/.ssh/id_rsa_student_mgmt_backend elscha@${env.DEMO_SERVER} <<EOF
                            cd ~/Competence-Repository
                            ./recreate.sh
                            exit
                        EOF"""
                }
                findText(textFinders: [textFinder(regexp: '(- error TS\\*)|(Cannot find module.*or its corresponding type declarations\\.)', alsoCheckConsoleOutput: true, buildResult: 'FAILURE')])
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint:ci'
            }
        }
    }

    post {
        always {
             // Send e-mails if build becomes unstable/fails or returns stable
             // Based on: https://stackoverflow.com/a/39178479
             load "$JENKINS_HOME/.envvars/emails.groovy"
             step([$class: 'Mailer', recipients: "${env.elsharkawy}", notifyEveryUnstableBuild: true, sendToIndividuals: false])

             // Report static analyses
             recordIssues enabledForFailure: false, tool: checkStyle(pattern: 'output/eslint/eslint.xml')
        }
    }
}
