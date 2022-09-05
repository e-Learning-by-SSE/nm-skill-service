pipeline {
    agent any

    tools {nodejs "NodeJS 16.13"}
    
    stages {

        stage('Git') {
            steps {
                cleanWs()
                git 'https://github.com/e-Learning-by-SSE/Competence-Repository.git'
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
                    docker.image('postgres:14.1-alpine').withRun("-e POSTGRES_USER=${env.POSTGRES_USER} -e POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD} -e POSTGRES_DB=${env.POSTGRES_DB} -p ${env.PORT}:${env.PORT}") { c ->
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

        // Based on: https://medium.com/@mosheezderman/c51581cc783c
        stage('Deploy') {
            steps {
                sshagent(credentials: ['Stu-Mgmt_Demo-System']) {
                    sh """
                        # [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                        # ssh-keyscan -t rsa,dsa example.com >> ~/.ssh/known_hosts
                        ssh -i ~/.ssh/id_rsa_student_mgmt_backend elscha@${env.DEMO_SERVER} <<EOF
                            cd ~/StudentMgmt-Backend
                            git reset --hard
                            git pull
                            npm install
                            rm ~/.pm2/logs/npm-error.log
                            pm2 restart 0 --wait-ready # requires project intialized with: pm2 start npm -- run start:demo
                            cd ..
                            sleep 30
                            ./chk_logs_for_err.sh
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
             step([$class: 'Mailer', recipients: "${env.elsharkawy}, notifyEveryUnstableBuild: true, sendToIndividuals: false])
             
             // Report static analyses
             recordIssues enabledForFailure: false, tool: checkStyle(pattern: 'output/eslint/eslint.xml')
        }
    }
}