// Jenkinsfile (in root of your repo)
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
          if (commitMsg.contains("@push")) {
            echo "Triggering GitHub push..."
          } else {
            error("Commit message does not contain '@push'. Aborting.")
          }
        }
      }
    }
    stage('Build') {
      steps {
        echo "Building..."
      }
    }
    stage('Test') {
      steps {
        echo "Running tests..."
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
            git config --global user.email "you@example.com"
            git config --global user.name "Jenkins"
            git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/NamgyelHuk708/DSO101_Final.git
            git push origin HEAD:main
          '''
        }
      }
    }
  }
}