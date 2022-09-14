pipeline {
    agent any

    tools {nodejs "NodeJS 16.13"}
    
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
                sh 'npm run build'
                // sh 'rm -f Backend.tar.gz'
                // sh 'tar czf Backend.tar.gz dist src test config package.json package-lock.json ormconfig.ts tsconfig.json'
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