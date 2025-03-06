<template>
  <q-breadcrumbs class="q-pl-md">
    <div v-for="(item, index) in levelList" :key="index">
      <div class="row" style="display: block">
        <div class="flex items-center">
          <q-breadcrumbs-el class="text-subtitle2 ase-roboto text-white" :icon="item.icon" :label="item.title" :to="item.path" />
          <q-btn v-if="linkCheck() === '/portal/dashboard'" icon="refresh" round @click="reloadPage" />
        </div>
      </div>
    </div>
  </q-breadcrumbs>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: '',
      breadCrumbList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    linkCheck(value) {
      return this.$route.path
    },
    reloadPage() {
      window.location.reload()
    },
    checkPathExistValue(val) {
      return this.breadCrumbList.some(function (el) {
        return el.title === val
      })
    },
    getBreadcrumb() {
      const matched = this.$route.matched.filter((item) => item.meta.title)

      const first = matched[0]
      const firstPathSplit = first.path.split(':')
      const mainPathIndex = first.path

      let pathData = ''
      if (firstPathSplit[0] !== undefined) {
        pathData = firstPathSplit[0]
      }

      if (firstPathSplit[1] !== undefined) {
        const pathOne = firstPathSplit[1].split('/')[0]
        const pathTwo = this.$route.params[pathOne]
        pathData = mainPathIndex.replace(':' + pathOne, pathTwo + '/')
      }
      if (firstPathSplit[2] !== undefined) {
        const pathOne = firstPathSplit[1].split('/')[0]
        const pathTwo = this.$route.params[pathOne]
        const pathThree = firstPathSplit[2].split('/')[0]
        const pathFour = this.$route.params[pathThree]
        pathData = mainPathIndex.replace(':' + pathOne, pathTwo).replace(':' + pathThree, pathFour + '/')
      }
      if (firstPathSplit[3] !== undefined) {
        const pathOne = firstPathSplit[1].split('/')[0]
        const pathTwo = this.$route.params[pathOne]
        const pathThree = firstPathSplit[2].split('/')[0]
        const pathFour = this.$route.params[pathThree]
        const pathFive = firstPathSplit[3].split('/')[0]
        const pathSix = this.$route.params[pathFive]
        pathData = mainPathIndex
          .replace(':' + pathOne, pathTwo)
          .replace(':' + pathThree, pathFour)
          .replace(':' + pathFive, pathSix)
      }
      if (firstPathSplit[4] !== undefined) {
        const pathOne = firstPathSplit[1].split('/')[0]
        const pathTwo = this.$route.params[pathOne]
        const pathThree = firstPathSplit[2].split('/')[0]
        const pathFour = this.$route.params[pathThree]
        const pathFive = firstPathSplit[3].split('/')[0]
        const pathSix = this.$route.params[pathFive]
        const pathSeven = firstPathSplit[4].split('/')[0]
        const pathEight = this.$route.params[pathSeven]
        pathData = mainPathIndex
          .replace(':' + pathOne, pathTwo)
          .replace(':' + pathThree, pathFour)
          .replace(':' + pathFive, pathSix)
          .replace(':' + pathSeven, pathEight)
      }
      if (firstPathSplit[5] !== undefined) {
        const pathOne = firstPathSplit[1].split('/')[0]
        const pathTwo = this.$route.params[pathOne]
        const pathThree = firstPathSplit[2].split('/')[0]
        const pathFour = this.$route.params[pathThree]
        const pathFive = firstPathSplit[3].split('/')[0]
        const pathSix = this.$route.params[pathFive]
        const pathSeven = firstPathSplit[4].split('/')[0]
        const pathEight = this.$route.params[pathSeven]
        const pathNine = firstPathSplit[5].split('/')[0]
        const pathTen = this.$route.params[pathNine]
        pathData = mainPathIndex
          .replace(':' + pathOne, pathTwo)
          .replace(':' + pathThree, pathFour)
          .replace(':' + pathFive, pathSix)
          .replace(':' + pathSeven, pathEight)
          .replace(':' + pathNine, pathTen)
      }
      const getBread = localStorage.getItem('breadcrumbs')
      if (getBread) {
        const convertedObj = JSON.parse(getBread)
        if (convertedObj.length > 0) {
          this.breadCrumbList = convertedObj
        }
      }
      if (this.breadCrumbList.length > 0) {
        if (this.checkPathExistValue(first.meta.title) === false) {
          this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        }
        if (this.breadCrumbList.length > 5) {
          this.breadCrumbList.shift()
        }
      } else {
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
      }

      if (this.breadCrumbList.length === 1) {
        localStorage.setItem('breadcrumbs', JSON.stringify(this.breadCrumbList))
        const getBread = localStorage.getItem('breadcrumbs')
        const convertedObj = JSON.parse(getBread)
        this.breadCrumbList = convertedObj
      }
      if (this.breadCrumbList > 1) {
        if (this.checkPathExistValue(first.meta.title) === false) {
          this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        }
        if (this.breadCrumbList.length > 5) {
          this.breadCrumbList.shift()
        }
      }

      let i = 0
      this.breadCrumbList.forEach((item) => {
        if (item.title === first.meta.title) {
          this.breadCrumbList = this.breadCrumbList.slice(0, i + 1)
          const matched = this.breadCrumbList
          this.levelList = matched
        }
        i = i + 1
      })
      if (first.meta.title === 'Dashboard') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Instructor') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Learning Path') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Labs') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Badge') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Certification') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Challenge') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Delivery') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Course') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Company') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Events') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Partner') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Offline-Payments') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'ASE Users') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Free users') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'Settings') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
      if (first.meta.title === 'User Profile') {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }

      localStorage.setItem('breadcrumbs', JSON.stringify(this.levelList))
      if (this.levelList === null) {
        this.levelList = []
        this.breadCrumbList = []
        this.breadCrumbList.push({ title: first.meta.title, icon: first.meta.icon, path: pathData })
        this.levelList = this.breadCrumbList
      }
    }
  }
}
</script>

<style>
.breadcrumb-arrow {
  height: 20px;
  padding: 0;
  line-height: 20px;
  list-style: none;
  background-color: transparent;
}
.breadcrumb-arrow li:first-child a {
  border-radius: 4px 0 0 4px;
  -webkit-border-radius: 4px 0 0 4px;
  -moz-border-radius: 4px 0 0 4px;
}
.breadcrumb-arrow li,
.breadcrumb-arrow li .routerTag,
.breadcrumb-arrow li span {
  display: inline-block;
  vertical-align: top;
}
.breadcrumb-arrow li:not(:first-child) {
  margin-left: -5px;
}
.breadcrumb-arrow li + li:before {
  padding: 0;
  content: '';
}
.breadcrumb-arrow li span {
  padding: 0 5px;
}
.breadcrumb-arrow li .routerTag,
.breadcrumb-arrow li:not(:first-child) span {
  height: 26px;
  padding: 0 10px 0 25px;
  line-height: 26px;
}
.breadcrumb-arrow li:first-child .routerTag {
  padding: 0 5px;
}
.breadcrumb-arrow li .routerTag {
  position: relative;
  color: #fff;
  text-decoration: none;
  background-color: #2b68b3;
}
.breadcrumb-arrow li:first-child .routerTag {
  padding-left: 5px;
}
.breadcrumb-arrow li .routerTag:after,
.breadcrumb-arrow li .routerTag:before {
  position: absolute;
  top: -1px;
  width: 0;
  height: 0;
  content: '';
  border-top: 14px solid transparent;
  border-bottom: 13px solid transparent;
}
.breadcrumb-arrow li .routerTag:before {
  right: -10px;
  z-index: 3;
  border-left-color: #2b68b3;
  border-left-style: solid;
  border-left-width: 10px;
}
.breadcrumb-arrow li .routerTag:after {
  right: -11px;
  z-index: 2;
  border-left: 10px solid #ffffff;
}
.breadcrumb-arrow li .routerTag:focus,
.breadcrumb-arrow li .routerTag:hover {
  display: inline-block;
  background-color: #2b68b3;
}
.breadcrumb-arrow li .routerTag:focus:before,
.breadcrumb-arrow li .routerTag:hover:before {
  display: inline-block;
  border-left-color: #2b68b3;
}
.breadcrumb-arrow li .routerTag:active {
  background-color: #2b68b3;
}
.breadcrumb-arrow li .routerTag:active:after,
.breadcrumb-arrow li .routerTag:active:before {
  border-left-color: #2b68b3;
}
.breadcrumb-arrow li span {
  color: #434a54;
}
</style>
