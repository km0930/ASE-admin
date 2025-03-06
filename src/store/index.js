import { createStore } from 'vuex'
import analyticsStats from './analyticsStats'
import bundles from './bundles'
import certification from './certification'
import challenge from './challenge'
import company from './company'
import companycourses from './companycourses'
import companyusers from './companyusers'
import course from './course'
import dashboard from './dashboard'
import delivery from './delivery'
import download from './download'
import instructor from './instructor'
import journeys from './journeys'
import lab from './lab'
import labs from './labs'
import learningPath from './learningPath'
import login from './login'
import map from './map'
import media from './media'
import partner from './partner'
import payments from './payments'
import quiz from './quiz'
import subject from './subject'
import tags from './tags'
import training from './training'
import userDetails from './userDetails'
import users from './users'
import video from './video'

export default function (/* { ssrContext } */) {
  return createStore({
    modules: {
      analyticsStats,
      challenge,
      company,
      companycourses,
      companyusers,
      course,
      dashboard,
      delivery,
      download,
      instructor,
      lab,
      labs,
      learningPath,
      login,
      map,
      media,
      partner,
      payments,
      quiz,
      subject,
      training,
      userDetails,
      users,
      video,
      certification,
      tags,
      bundles,
      journeys
    },
    strict: process.env.DEBUGGING
  })
}
