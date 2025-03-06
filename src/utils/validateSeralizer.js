import { urlSafeBase64Encode } from './reuseFunctions'

export const compareFunction = (type, objectCompare, objectFromGet) => {
  if (type === 'instructor') {
    if (objectFromGet.instructor_name === objectCompare.instructor_name) {
      delete objectCompare.instructor_name
    }
    if (objectFromGet.about === objectCompare.about) {
      delete objectCompare.about
    }
  } else if (type === 'learningPathUpdate') {
    if (objectFromGet.name === objectCompare.learning_path_name) {
      delete objectCompare.learning_path_name
    }
    if (objectFromGet.description === objectCompare.description) {
      delete objectCompare.description
    }
  } else if (type === 'deliveryUpdate') {
    if (objectFromGet.detailId === objectCompare.detailId) {
      delete objectCompare.detailId
    }
    if (objectFromGet.emailFromName === objectCompare.emailFromName) {
      delete objectCompare.emailFromName
    }
  } else if (type === 'badgeUpdate') {
    if (urlSafeBase64Encode(objectFromGet.about) === objectCompare.about) {
      delete objectCompare.about
    }
    if (objectFromGet.name === objectCompare.badge_name) {
      delete objectCompare.badge_name
    }
    if (objectFromGet.skills === objectCompare.skills) {
      delete objectCompare.skills
    }
  } else if (type === 'labsUpdate') {
    if (objectFromGet.name === objectCompare.lab_name) {
      delete objectCompare.lab_name
    }
    if (objectFromGet.labTtl === objectCompare.lab_ttl) {
      delete objectCompare.labTtl
    }
    if (objectFromGet.approxTime === objectCompare.approx_time) {
      delete objectCompare.approx_time
    }
    if (objectFromGet.description === objectCompare.description) {
      delete objectCompare.description
    }
    if (objectFromGet.configuration === objectCompare.configuration) {
      delete objectCompare.configuration
    }
    if (objectFromGet.is_challenge_object === objectCompare.is_challenge_object) {
      delete objectCompare.is_challenge_object
    }
  } else if (type === 'course') {
    if (objectFromGet.name === objectCompare.event_name) {
      delete objectCompare.event_name
    }
    if (objectFromGet.achievement_type === objectCompare.achievement_type) {
      delete objectCompare.achievement_type
    }
    if (objectFromGet.proficiency === objectCompare.proficiency) {
      delete objectCompare.proficiency
    }
    if (objectFromGet.event_status === objectCompare.event_status) {
      delete objectCompare.event_status
    }
    if (objectFromGet.avgMinutes === objectCompare.avg_minutes) {
      delete objectCompare.avg_minutes
    }
    if (JSON.stringify(objectFromGet.career) === JSON.stringify(objectCompare.career)) {
      delete objectCompare.career
    }
    if (JSON.stringify(objectFromGet.instructorId) === JSON.stringify(objectCompare.instructor_id)) {
      delete objectCompare.instructor_id
    }
    if (objectFromGet.issue_date === objectCompare.issue_date && objectCompare.achievement_type !== 'certificate') {
      delete objectCompare.issue_date
    }
    if (objectFromGet.expiry_date === objectCompare.expiry_date && objectCompare.achievement_type !== 'certificate') {
      delete objectCompare.expiry_date
    }
    if (objectFromGet.isActive === objectCompare.is_active) {
      delete objectCompare.is_active
    }
    if (objectFromGet.isEvent === objectCompare.is_event) {
      delete objectCompare.is_event
    }
    if (objectFromGet.freetier === objectCompare.is_free) {
      delete objectCompare.is_free
    }
    if (JSON.stringify(objectFromGet.learningPaths?.map((i) => i.value)) === JSON.stringify(objectCompare.learning_path_id)) {
      delete objectCompare.learning_path_id
    }
    if (JSON.stringify(objectFromGet.instructors?.map((i) => i.value)) === JSON.stringify(objectCompare.instructor_id)) {
      delete objectCompare.instructor_id
    }
    if (objectFromGet.description === objectCompare.description) {
      delete objectCompare.description
    }
    if (objectFromGet.isBanner === objectCompare.show_banner) {
      delete objectCompare.show_banner
    }
  } else if (type === 'company') {
    if (objectFromGet.company_name === objectCompare.company_name) {
      delete objectCompare.company_name
    }
    if (objectFromGet.courses === objectCompare.events) {
      delete objectCompare.events
    }
    if (objectFromGet.end_date === objectCompare.end_date) {
      delete objectCompare.end_date
    }
    if (objectFromGet.is_event === objectCompare.is_event) {
      delete objectCompare.is_event
    }
    if (objectFromGet.minutes_per_user === objectCompare.minutes_per_user) {
      delete objectCompare.minutes_per_user
    }
    if (objectFromGet.num_users === objectCompare.num_users) {
      delete objectCompare.num_users
    }
    if (objectFromGet.payment_complete === objectCompare.payment_complete) {
      delete objectCompare.payment_complete
    }
    if (objectFromGet.start_date === objectCompare.start_date) {
      delete objectCompare.start_date
    }
    if (JSON.stringify(objectFromGet.domains) === JSON.stringify(objectCompare.domains)) {
      delete objectCompare.domains
    }
    if (JSON.stringify(objectFromGet.plans) === JSON.stringify(objectCompare.plans)) {
      delete objectCompare.plans
    }
  } else if (type === 'subject') {
    if (objectFromGet.name === objectCompare.subject_name) {
      delete objectCompare.subject_name
    }
    if (objectFromGet.description === objectCompare.description) {
      delete objectCompare.description
    }
    if (objectFromGet.is_active === objectCompare.is_active) {
      delete objectCompare.is_active
    }
  } else if (type === 'challenge') {
    if (objectFromGet.name === objectCompare.name) {
      delete objectCompare.name
    }
    if (objectFromGet.description === objectCompare.description) {
      delete objectCompare.description
    }
    if (objectFromGet.difficulty === objectCompare.difficulty) {
      delete objectCompare.difficulty
    }
    if (objectFromGet.validation_type === objectCompare.validation_type) {
      delete objectCompare.validation_type
    }
    if (objectFromGet.nature === objectCompare.nature) {
      delete objectCompare.nature
    }
    if (JSON.stringify(objectCompare.hints) === JSON.stringify(objectFromGet.hints)) {
      delete objectCompare.hints
    }
    if (objectFromGet.lab_id === objectCompare.lab_id) {
      delete objectCompare.lab_id
    }
    if (objectFromGet.score === objectCompare.score) {
      delete objectCompare.score
    }
    if (objectFromGet.tags.length === objectCompare.tags.length) {
      objectCompare.tags.every((element) => objectFromGet.tags.includes(element))
      delete objectCompare.tags
    }
  } else if (type === 'training') {
    if (objectFromGet.training_name === objectCompare.training_name) {
      delete objectCompare.training_name
    }
    if (JSON.stringify(objectFromGet.domains) === JSON.stringify(objectCompare.domains)) {
      delete objectCompare.domains
    }
  }
  return objectCompare
}

export const base64decode = (str) => {
  const decode = atob(str).replace(/[\x80-\uffff]/g, (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`)
  return decodeURIComponent(decode)
}

export const base64encode = (str) => {
  const encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
  return btoa(encode)
}
