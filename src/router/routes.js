import { isAuthenticated } from 'src/utils/auth'
const routes = [
  {
    path: '/portal',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, _from, next) => {
      isAuthenticated(to) ? next() : next({ path: '/' })
    },
    children: [
      {
        path: '',
        redirect: '/portal/dashboard'
      },
      {
        path: 'courses',
        component: () => import('pages/course/UpdatedListView.vue'),
        meta: { main: 'courses', title: 'Course', icon: 'school' }
      },
      {
        path: 'un-published-courses',
        component: () => import('pages/course/UnpublishedCourses.vue'),
        meta: { main: 'courses', title: 'Course', icon: 'school' }
      },
      {
        path: 'challenges',
        component: () => import('pages/challenge_object/ChallengeIndex.vue'),
        meta: { main: 'courses', title: 'Challenges', icon: 'fas fa-chess-board' }
      },
      {
        path: 'ai_challenges',
        component: () => import('pages/ai_challenges/index.vue'),
        meta: { main: 'courses', title: 'AI Challenges', icon: 'img:sidebar_aiquiz.svg' }
      },
      {
        path: 'subject/:courseId/:courseName',
        component: () => import('pages/subject/SubjectIndex.vue'),
        meta: { main: 'courses', title: 'Subject', icon: 'book' }
      },
      {
        path: 'course/:courseId/:courseName',
        component: () => import('pages/feedback/index.vue'),
        meta: { main: 'courses', title: 'Feedback', icon: 'book' }
      },
      {
        path: 'subject-detailed-information/:subjectId/:courseId/:courseName/:subjectName',
        component: () => import('pages/subject/SubjectDetailedInfo.vue'),
        meta: { main: 'courses', title: 'Detailed subject', icon: 'info' }
      },
      {
        path: 'move-to-prod/:courseId',
        component: () => import('pages/moveCourse/index.vue'),
        meta: { main: 'courses', title: 'sync', icon: 'sync' }
      },
      {
        path: 'sort/:subjectId/:courseId',
        component: () => import('pages/content_sort/SubjectContentSortIndex.vue'),
        meta: { main: 'courses', title: 'Sort Course', icon: 'sort' }
      },
      {
        path: 'sort/lp/:lpId/:lpName',
        component: () => import('pages/content_sort/LpSortIndex.vue'),
        meta: { main: 'learning-path', title: 'Sort Learning path', icon: 'sort' }
      },
      {
        path: 'subject-order/:id',
        component: () => import('pages/content_sort/SubjectSortIndex.vue'),
        meta: { main: 'courses', title: 'Sort Subject', icon: 'sort' }
      },
      {
        path: 'company',
        component: () => import('pages/company/CompanyIndex.vue'),
        meta: { main: 'company', title: 'Company', icon: 'list' }
      },
      {
        path: 'dashboard',
        component: () => import('pages/dashboard/index.vue'),
        meta: { main: 'home', title: 'Dashboard', icon: 'home' }
      },
      {
        path: 'company/dashboard/:companyid',
        component: () => import('pages/company/CompanyDashboard.vue'),
        meta: { main: 'company', title: 'Company Dashboard', icon: 'home' }
      },
      {
        path: 'user-info/:userEmail/:userName',
        component: () => import('pages/user/detailedInfo.vue'),
        meta: { main: 'user', title: 'user information', icon: 'people' }
      },
      {
        path: 'learning-path',
        component: () => import('pages/learning_path/LearningPathIndex.vue'),
        meta: { main: 'learning-path', title: 'Learning Path', icon: 'add_road' }
      },
      {
        path: 'learning-path/:individualId/:individualName',
        component: () => import('pages/learning_path/individualLearningPath.vue'),
        meta: { main: 'learning-path', title: 'Learning Path Individual', icon: 'directions_boat' }
      },
      {
        path: 'instructor',
        component: () => import('pages/instructor/InstructorIndex.vue'),
        meta: { main: 'instructor', title: 'Instructor', icon: 'face' }
      },
      {
        path: 'labs',
        component: () => import('pages/labs/LabPage.vue'),
        meta: { main: 'science', title: 'Labs', icon: 'science' }
      },
      {
        path: 'delivery',
        component: () => import('pages/delivery/DeliveryIndex.vue'),
        meta: { main: 'Delivery', title: 'Delivery', icon: 'badge' }
      },
      {
        path: 'settings',
        component: () => import('pages/settings/SettingPage.vue'),
        meta: { main: 'settings', title: 'Settings', icon: 'settings' }
      },
      {
        path: 'map',
        component: () => import('pages/map/index.vue'),
        meta: { main: 'map', title: 'map', icon: 'map' },
        children: [
          {
            path: '',
            component: () => import('pages/map/CourseMapIndex.vue')
          },
          {
            path: 'bundle',
            component: () => import('pages/map/BundleIndex.vue')
          }
        ]
      },
      {
        path: 'certification',
        component: () => import('pages/certification/index.vue'),
        meta: { main: 'certification', title: 'Certification', icon: 'workspace_premium' }
      },
      {
        path: 'userprofile',
        component: () => import('pages/user/userProfile.vue'),
        meta: { main: 'profile', title: 'User Profile', icon: 'account_circle' }
      },
      {
        path: 'partner',
        component: () => import('pages/partner/PartnerIndex.vue'),
        meta: { main: 'partner', title: 'Partner', icon: 'link' }
      },
      {
        path: 'partner/:partnerId',
        component: () => import('pages/users/usersListPartner.vue'),
        meta: { main: 'partner', title: 'Individual Partner', icon: 'attach_file' }
      },
      {
        path: 'events',
        component: () => import('pages/training/TrainingIndex.vue'),
        meta: { main: 'events', title: 'Events', icon: 'class' }
      },
      {
        path: 'events/:eventId',
        component: () => import('pages/users/usersListTraining.vue'),
        meta: { main: 'events', title: 'Individual Events', icon: 'model_training' }
      },
      {
        path: 'offline-payments',
        component: () => import('pages/payments/offlinePayements.vue'),
        meta: { main: 'offline-payments', title: 'Offline-Payments', icon: 'cloud_off' }
      },
      {
        path: 'tags',
        component: () => import('pages/Tags/Index.vue'),
        meta: { main: 'tags', title: 'Tags', icon: 'workspace_premium' }
      },
      {
        path: 'journeys',
        component: () => import('pages/journeys/JourneyIndex.vue'),
        meta: { main: 'journey', title: 'Journeys', icon: 'explore' }
      }
    ]
  },
  { path: '', component: () => import('pages/login/Index.vue') },
  { path: '/', component: () => import('pages/login/Index.vue') },
  {
    path: '/auth',
    name: 'Auth',
    meta: { title: 'Authentications' },
    component: () => import('pages/login/verificationLink.vue')
  },

  {
    path: '/:catchAll(.*)*',
    alias: '/error',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
