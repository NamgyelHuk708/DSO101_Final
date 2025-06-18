pipeline {
    agent {
        docker {
            image 'node:16-bullseye'
            args '-v /home/jenkins/.npm:/root/.npm --privileged'
        }
    }
    environment {
        NPM_CONFIG_LEGACY_PEER_DEPS = 'true'
    }
    stages {
        stage('Setup Environment') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    cd backend
                    rm -rf node_modules package-lock.json
                    npm cache clean --force
                    npm install --legacy-peer-deps --no-optional --verbose 2>&1 | tee npm-install.log
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'backend/npm-install.log'
                }
            }
        }
        
        stage('Push to GitHub') {
            when {
                expression {
                    sh(script: 'git log -1 --pretty=%B | grep -q "@push"', returnStatus: true) == 0
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