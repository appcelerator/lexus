#! groovy
library 'pipeline-library'

ansiColor('xterm') {
  node('alfred') {
    // git checkout stages
    stage('Checkout') {
      checkout scm
    }

    try {
      // skip double builds on branch pushes
      if (!env.BRANCH_NAME.startsWith('PR-') && env.BRANCH_NAME != 'master') {
        currentBuild.result = 'SUCCESS'
        return
      }

      // docker initialization
      stage('Docker Setup') {
        dockerStart()
      }

      // shorthand container execution
      def exec = { command ->
        sh 'docker run -i --rm ' +
              '-v $HOME/.npm:/root/.npm ' +   // mount the npm cache directories
              '-v $WORKSPACE:/build ' +       // mount the build workspace
              '-w /build ' +                  // set the working directory
              'node:lts ' +                   // use the latest node LTS
              command                         // add the custom commands
      };

      // main builds
      stage('Build') {
        exec('npm install')
        exec('npm test')
        exec('bin/lexus-spec bundle dev')
      }
    } finally {
      // stop all spare docker containers just in case
      sh 'docker stop $(docker ps -aq) 2> /dev/null || true'
      sh 'docker container prune -f'
    }
  }
}
