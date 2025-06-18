pipeline {
    agent any
    environment {
        GITHUB_CREDS = credentials('github-credentials')
    }
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    if (!commitMsg.contains("@push")) {
                        error("Commit message must contain '@push' to trigger pipeline.")
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd backend
                    npm install --legacy-peer-deps
                '''
                sh '''
                    cd frontend
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Push to GitHub') {
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