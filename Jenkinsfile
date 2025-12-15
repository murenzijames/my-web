pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'murenzi123/my-web'
        // IMPORTANT: Ensure a Jenkins 'Username with password' credential exists 
        // with the ID 'docker-hub-credentials'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        CONTAINER_NAME = 'my-web'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker build -t ${DOCKER_IMAGE}:latest ."
                    } else {
                        bat "docker build -t %DOCKER_IMAGE% ."
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        if (isUnix()) {
                            // Unix/sh: Simple echo and pipe works reliably
                            sh """
                                echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                                docker push ${DOCKER_IMAGE}:latest
                            """
                        } else {
                            // Windows/bat: Use a simple string pipe via PowerShell/cmd
                            // to ensure standard input is correctly passed.
                            bat """
                                powershell -Command "'%DOCKER_PASS%' | docker login -u '%DOCKER_USER%' --password-stdin"
                                docker push %DOCKER_IMAGE%
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy (Local Host)') {
            steps {
                script {
                    if (isUnix()) {
                        sh """
                            docker rm -f ${CONTAINER_NAME} || true
                            docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}:latest
                        """
                    } else {
                        // Windows cleanup requires a slightly different approach for error handling
                        bat "docker rm -f %CONTAINER_NAME% || exit 0" 
                        bat "docker run -d --name %CONTAINER_NAME% -p 3000:3000 %DOCKER_IMAGE%"
                    }
                }
            }
        }
    }
}
