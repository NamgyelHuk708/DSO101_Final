pipeline {
    agent any
    environment {
        GITHUB_CREDS = credentials('github-credentials')
    }
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                sh 'git log -1 --pretty=%B > commit.txt'
            }
        }
        stage('Check Commit Message') {
            steps {
                script {
                    def commitMsg = readFile('commit.txt').trim()
                    if (!commitMsg.contains("@push")) {
                        error("Commit message must contain '@push' to trigger pipeline.")
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                sh '''
                    cd backend
                    npm install
                    npm test
                '''
            }
        }
        stage('Push Changes') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh '''
                        git config --global user.email "jenkins@example.com"
                        git config --global user.name "Jenkins"
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/NamgyelHuk708/DSO101_Final.git
                        git push origin HEAD:main
                    '''
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}