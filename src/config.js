const environments = {
  admin: {
    baseURLApi: 'https://98m24bbbgh.execute-api.us-east-2.amazonaws.com/prod/',
    challengeURLApi: 'https://w8w0zirqti.execute-api.us-east-2.amazonaws.com/prod/',
    certificationApi: 'https://j0u9ovucy2.execute-api.us-east-2.amazonaws.com/prod',
    generateQuestionApi: 'https://q-generator-ht3uhxhtna-ue.a.run.app/',
    aiChallengesURL: 'https://32d8fx0t13.execute-api.us-east-2.amazonaws.com/prod',
    awsExports: {
      production: false,
      region: 'us-east-2',
      userPoolId: 'us-east-2_wH3UGOA6c',
      userPoolWebClientId: '1rvn77086po02g5qu01nnus3iq'
    },
    injectApi: 'https://zp56bu78ma.execute-api.us-east-2.amazonaws.com/prod/',
    webSocketApi: 'wss://e74ufzdef8.execute-api.us-east-2.amazonaws.com/prod/',
    webSocketCheckApi: 'https://zp56bu78ma.execute-api.us-east-2.amazonaws.com/prod/'
  },
  uat: {
    baseURLApi: 'https://s6vgie7rg4.execute-api.us-west-1.amazonaws.com/uat/',
    challengeURLApi: 'https://i77i9zva54.execute-api.us-west-1.amazonaws.com/uat/',
    certificationApi: 'https://jpekencwud.execute-api.us-west-1.amazonaws.com/uat/',
    generateQuestionApi: 'https://q-generator-ht3uhxhtna-ue.a.run.app/',
    aiChallengesURL: 'https://08b1ivq1g7.execute-api.us-west-1.amazonaws.com/uat',
    awsExports: {
      production: false,
      region: 'us-west-1',
      userPoolId: 'us-west-1_epFKRTX89',
      userPoolWebClientId: 'b9jc5s2988r9mk4coaut2vpdb'
    },
    injectApi: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/',
    webSocketApi: 'wss://v2a7rj7jhj.execute-api.us-east-2.amazonaws.com/staging',
    webSocketCheckApi: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/'
  },
  staging: {
    baseURLApi: 'https://deh80jlur3.execute-api.us-east-2.amazonaws.com/staging/',
    challengeURLApi: 'https://9ismepcb43.execute-api.us-east-2.amazonaws.com/staging/',
    certificationApi: 'https://cyvrklphx1.execute-api.us-east-2.amazonaws.com/staging/',
    generateQuestionApi: 'https://q-generator-ht3uhxhtna-ue.a.run.app/',
    skillsApi: 'https://b398t74m8h.execute-api.us-east-2.amazonaws.com/staging/',
    aiChallengesURL: 'https://91gulcsfbg.execute-api.us-east-2.amazonaws.com/staging/',
    awsExports: {
      production: false,
      region: 'us-east-2',
      userPoolId: 'us-east-2_d7stFz870',
      userPoolWebClientId: '57kibdnh91i4psrlr8emmuk0ut'
    },
    injectApi: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/',
    webSocketApi: 'wss://v2a7rj7jhj.execute-api.us-east-2.amazonaws.com/staging',
    webSocketCheckApi: 'https://8hqy7jf2o3.execute-api.us-east-2.amazonaws.com/staging/'
  }
}

const subdomain = window.location.hostname.split('.')[0]
const config = environments[subdomain] || environments.staging

export default config
