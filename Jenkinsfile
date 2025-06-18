pipeline {
    agent {
        docker {
            image 'node:16'
            args '-v /var/lib/jenkins/.npm:/root/.npm'
        }
    }
    
    environment {
        CI = 'true'
        NODE_ENV = 'test'
        GITHUB_CREDS = credentials('github-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                dir('backend') {
                    sh 'npm ci --legacy-peer-deps'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'backend/test-results/**/*.xml'
                    archiveArtifacts 'backend/coverage/**/*'
                }
            }
        }
        
        stage('Push') {
            when {
                expression { 
                    def msg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    msg.contains('@push') && currentBuild.result == 'SUCCESS' 
                }
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