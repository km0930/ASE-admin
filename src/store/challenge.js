import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  badgeOptions: [],
  error_msgs: {
    description_msg: '',
    description: false,
    difficulty_msg: '',
    difficulty: false,
    hints_msg: '',
    hints: false,
    instructions_msg: '',
    instructions: false,
    lab_id_msg: '',
    lab_id: false,
    name_msg: '',
    name: false,
    nature_msg: '',
    nature: false,
    score_msg: '',
    score: false,
    status: true,
    tags_msg: '',
    tags: false
  },
  labsPaginationKey: {},
  listChallenges: [],
  listLabs: [],
  listLabsOptions: [],
  listValidatorScripts: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  solution: [],
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_CHALLENGES(state, data) {
    const prev = state.listChallenges
    state.listChallenges = prev.concat(data)
  },
  RESET_LIST_CHALLENGES(state, data) {
    state.listChallenges = data
  },
  CREATE_CHALLENGE(state, data) {
    state.listChallenges.unshift(data)
  },
  UPDATE_CHALLENGE(state, data) {
    const index = state.listChallenges.findIndex((challenge) => challenge.sk === data.challenge_id)
    state.listChallenges.splice(index, 1, data)
  },
  DELETE_CHALLENGE(state, data) {
    const index = state.listChallenges.findIndex((challenge) => challenge.sk === data.challenge_id)
    state.listChallenges.splice(index, 1)
  },
  LIST_VALIDATOR_SCRIPTS(state, data) {
    state.listValidatorScripts = data
  },
  LIST_SOLUTION(state, data) {
    state.solution = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  LABS_PAGINATION_KEY(state, data) {
    state.labsPaginationKey = data
  },
  LIST_LABS(state, data) {
    const prev = state.listLabs
    state.listLabs = prev.concat(data)
  },
  LIST_LABS_OPTIONS(state, data) {
    const prev = state.listLabsOptions
    state.listLabsOptions = prev.concat(data)
  },
  RESET_LIST_LABS(state, data) {
    state.listLabs = data
  },
  RESET_LIST_LABS_OPTIONS(state, data) {
    state.listLabsOptions = data
  },
  OPTION_BADGE(state, data) {
    state.badgeOptions = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },

  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },

  fetchChallenges({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.challengeURLApi + 'challenge/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const challengesList = res.data.data.map((challenge) => ({
            ...challenge,
            id: challenge.sk
          }))
          commit('SEARCH_FIRE', false)
          if (payload.reset) {
            commit('RESET_LIST_CHALLENGES', challengesList)
          } else {
            commit('LIST_CHALLENGES', challengesList)
          }
          commit('PAGINATION_KEY', res.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async createChallenge({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      name: false,
      name_msg: '',
      description: false,
      description_msg: '',
      lab_id: false,
      lab_id_msg: '',
      instructions: false,
      instructions_msg: '',
      nature: false,
      nature_msg: '',
      difficulty: false,
      difficulty_msg: '',
      hints: false,
      hints_msg: '',
      tags: false,
      tags_msg: '',
      score: false,
      score_msg: ''
    })
    await axios
      .post(config.challengeURLApi + 'challenge/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('CREATE_CHALLENGE', res.data.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Challenge object has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            name: false,
            name_msg: '',
            description: false,
            description_msg: '',
            lab_id: false,
            lab_id_msg: '',
            instructions: false,
            instructions_msg: '',
            nature: false,
            nature_msg: '',
            difficulty: false,
            difficulty_msg: '',
            hints: false,
            hints_msg: '',
            tags: false,
            tags_msg: '',
            score: false,
            score_msg: ''
          }
          if (error.response.data.message.name) {
            if (typeof error.response.data.message.name === 'object') {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name.toString()
            } else {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name
            }
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
            }
          }
          if (error.response.data.message.lab_id) {
            if (typeof error.response.data.message.lab_id === 'object') {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id.toString()
            } else {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id
            }
          }
          if (error.response.data.message.instructions) {
            if (typeof error.response.data.message.instructions === 'object') {
              errMsgs.instructions = true
              errMsgs.instructions_msg = error.response.data.message.instructions.toString()
            } else {
              errMsgs.instructions = true
              errMsgs.instructions_msg = error.response.data.message.instructions
            }
          }
          if (error.response.data.message.nature) {
            if (typeof error.response.data.message.nature === 'object') {
              errMsgs.nature = true
              errMsgs.nature_msg = error.response.data.message.nature.toString()
            } else {
              errMsgs.nature = true
              errMsgs.nature_msg = error.response.data.message.nature
            }
          }
          if (error.response.data.message.difficulty) {
            if (typeof error.response.data.message.difficulty === 'object') {
              errMsgs.difficulty = true
              errMsgs.difficulty_msg = error.response.data.message.difficulty.toString()
            } else {
              errMsgs.difficulty = true
              errMsgs.difficulty_msg = error.response.data.message.difficulty
            }
          }
          if (error.response.data.message.hints) {
            if (typeof error.response.data.message.hints === 'object') {
              errMsgs.hints = true
              errMsgs.hints_msg = error.response.data.message.hints.toString()
            } else {
              errMsgs.hints = true
              errMsgs.hints_msg = error.response.data.message.hints
            }
          }
          if (error.response.data.message.tags) {
            if (typeof error.response.data.message.tags === 'object') {
              errMsgs.tags = true
              errMsgs.tags_msg = error.response.data.message.tags.toString()
            } else {
              errMsgs.tags = true
              errMsgs.tags_msg = error.response.data.message.tags
            }
          }
          if (error.response.data.message.score) {
            if (typeof error.response.data.message.score === 'object') {
              errMsgs.score = true
              errMsgs.score_msg = error.response.data.message.score.toString()
            } else {
              errMsgs.score = true
              errMsgs.score_msg = error.response.data.message.score
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async updateChallenge({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      name: false,
      name_msg: '',
      description: false,
      description_msg: '',
      lab_id: false,
      lab_id_msg: '',
      instructions: false,
      instructions_msg: '',
      nature: false,
      nature_msg: '',
      difficulty: false,
      difficulty_msg: '',
      hints: false,
      hints_msg: '',
      tags: false,
      tags_msg: '',
      score: false,
      score_msg: ''
    })
    await axios
      .post(config.challengeURLApi + 'challenge/update', payload)
      .then((res) => {
        if (res.data.success) {
          commit('UPDATE_CHALLENGE', res.data.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Challenge Object has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            name: false,
            name_msg: '',
            description: false,
            description_msg: '',
            lab_id: false,
            lab_id_msg: '',
            instructions: false,
            instructions_msg: '',
            nature: false,
            nature_msg: '',
            difficulty: false,
            difficulty_msg: '',
            hints: false,
            hints_msg: '',
            tags: false,
            tags_msg: '',
            score: false,
            score_msg: ''
          }
          if (error.response.data.message.name) {
            if (typeof error.response.data.message.name === 'object') {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name.toString()
            } else {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name
            }
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
            }
          }
          if (error.response.data.message.lab_id) {
            if (typeof error.response.data.message.lab_id === 'object') {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id.toString()
            } else {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id
            }
          }
          if (error.response.data.message.instructions) {
            if (typeof error.response.data.message.instructions === 'object') {
              errMsgs.instructions = true
              errMsgs.instructions_msg = error.response.data.message.instructions.toString()
            } else {
              errMsgs.instructions = true
              errMsgs.instructions_msg = error.response.data.message.instructions
            }
          }
          if (error.response.data.message.nature) {
            if (typeof error.response.data.message.nature === 'object') {
              errMsgs.nature = true
              errMsgs.nature_msg = error.response.data.message.nature.toString()
            } else {
              errMsgs.nature = true
              errMsgs.nature_msg = error.response.data.message.nature
            }
          }
          if (error.response.data.message.difficulty) {
            if (typeof error.response.data.message.difficulty === 'object') {
              errMsgs.difficulty = true
              errMsgs.difficulty_msg = error.response.data.message.difficulty.toString()
            } else {
              errMsgs.difficulty = true
              errMsgs.difficulty_msg = error.response.data.message.difficulty
            }
          }
          if (error.response.data.message.hints) {
            if (typeof error.response.data.message.hints === 'object') {
              errMsgs.hints = true
              errMsgs.hints_msg = error.response.data.message.hints.toString()
            } else {
              errMsgs.hints = true
              errMsgs.hints_msg = error.response.data.message.hints
            }
          }
          if (error.response.data.message.tags) {
            if (typeof error.response.data.message.tags === 'object') {
              errMsgs.tags = true
              errMsgs.tags_msg = error.response.data.message.tags.toString()
            } else {
              errMsgs.tags = true
              errMsgs.tags_msg = error.response.data.message.tags
            }
          }
          if (error.response.data.message.score) {
            if (typeof error.response.data.message.score === 'object') {
              errMsgs.score = true
              errMsgs.score_msg = error.response.data.message.score.toString()
            } else {
              errMsgs.score = true
              errMsgs.score_msg = error.response.data.message.score
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },

  deleteChallenge({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.challengeURLApi + 'challenge/delete', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELETE_CHALLENGE', payload)
          Notify.create({ message: 'Challenge deleted successfully', color: 'red', position: 'top' })
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async getSolution({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.challengeURLApi + 'solution/get', payload)
      .then((res) => commit('LIST_SOLUTION', res.data.data))
      .catch((error) => {
        throw error
      })
      .finally(() => commit('LOADING', false))
  },

  async attachSolution({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.challengeURLApi + 'solutions/attach', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Solution successfully attached', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ color: 'red', message: error.response.data.errors[0].msg, position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async uploadSolution({ commit }, payload) {
    commit('LOADING', true)
    return await axios
      .post(config.challengeURLApi + 'solutions/upload', payload)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async detachSolution({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.challengeURLApi + 'solutions/detach', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Solution successfully detached', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  fetchLabs({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.challengeURLApi + 'challenge/labs/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const labList = []
          const labListOptions = []
          res.data.data.forEach((labData) => {
            labList.push({
              name: labData.lab_name,
              sk: labData.sk
            })
            labListOptions.push({
              label: labData.lab_name,
              value: labData.sk
            })
          })
          if (payload.reset) {
            commit('RESET_LIST_LABS', labList)
            commit('RESET_LIST_LABS_OPTIONS', labListOptions)
          } else {
            commit('LIST_LABS', labList)
            commit('LIST_LABS_OPTIONS', labListOptions)
          }
          commit('LABS_PAGINATION_KEY', res.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async addValidatorScript({ commit }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      name: false,
      name_msg: '',
      type: false,
      type_msg: '',
      file: false,
      file_msg: '',
      url: false,
      url_msg: '',
      invoke_order: false,
      invoke_order_msg: '',
      code_dir_file: false,
      code_dir_file_msg: '',
      target_uri: false,
      target_uri_msg: '',
      entrypoint: false,
      entrypoint_msg: '',
      output_file: false,
      output_file_msg: '',
      script_out_file: false,
      script_out_file_msg: '',
      validate_query: false,
      validate_query_msg: '',
      valid_expr: false,
      valid_expr_msg: '',
      run_command: false,
      run_command_msg: ''
    })
    await axios
      .post(config.challengeURLApi + 'validator-script/add', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully added.', color: 'green', position: 'top' })
          commit('STATUS_OF_API', true)
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: true,
            name: false,
            name_msg: '',
            type: false,
            type_msg: '',
            file: false,
            file_msg: '',
            url: false,
            url_msg: '',
            invoke_order: false,
            invoke_order_msg: '',
            code_dir_file: false,
            code_dir_file_msg: '',
            target_uri: false,
            target_uri_msg: '',
            entrypoint: false,
            entrypoint_msg: '',
            output_file: false,
            output_file_msg: '',
            script_out_file: false,
            script_out_file_msg: '',
            validate_query: false,
            validate_query_msg: '',
            valid_expr: false,
            valid_expr_msg: '',
            run_command: false,
            run_command_msg: ''
          }
          if (error.response.data.message.name) {
            if (typeof error.response.data.message.name === 'object') {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name.toString()
            } else {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name
            }
          }
          if (error.response.data.message.type) {
            if (typeof error.response.data.message.file === 'object') {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file.toString()
            } else {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file
            }
          }
          if (error.response.data.message.file) {
            if (typeof error.response.data.message.file === 'object') {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file.toString()
            } else {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file
            }
          }
          if (error.response.data.message.url) {
            if (typeof error.response.data.message.url === 'object') {
              errMsgs.url = true
              errMsgs.url_msg = error.response.data.message.url.toString()
            } else {
              errMsgs.url = true
              errMsgs.url_msg = error.response.data.message.url
            }
          }
          if (error.response.data.message.invoke_order) {
            if (typeof error.response.data.message.invoke_order === 'object') {
              errMsgs.invoke_order = true
              errMsgs.invoke_order_msg = error.response.data.message.invoke_order.toString()
            } else {
              errMsgs.invoke_order = true
              errMsgs.invoke_order_msg = error.response.data.message.invoke_order
            }
          }
          if (error.response.data.message.code_dir_file) {
            if (typeof error.response.data.message.code_dir_file === 'object') {
              errMsgs.code_dir_file = true
              errMsgs.code_dir_file_msg = error.response.data.message.code_dir_file.toString()
            } else {
              errMsgs.code_dir_file = true
              errMsgs.code_dir_file_msg = error.response.data.message.code_dir_file
            }
          }
          if (error.response.data.message.target_uri) {
            if (typeof error.response.data.message.target_uri === 'object') {
              errMsgs.target_uri = true
              errMsgs.target_uri_msg = error.response.data.message.target_uri.toString()
            } else {
              errMsgs.target_uri = true
              errMsgs.target_uri_msg = error.response.data.message.target_uri
            }
          }
          if (error.response.data.message.entrypoint) {
            if (typeof error.response.data.message.entrypoint === 'object') {
              errMsgs.entrypoint = true
              errMsgs.entrypoint_msg = error.response.data.message.entrypoint.toString()
            } else {
              errMsgs.entrypoint = true
              errMsgs.entrypoint_msg = error.response.data.message.entrypoint
            }
          }
          if (error.response.data.message.output_file) {
            if (typeof error.response.data.message.output_file === 'object') {
              errMsgs.output_file = true
              errMsgs.output_file_msg = error.response.data.message.output_file.toString()
            } else {
              errMsgs.output_file = true
              errMsgs.output_file_msg = error.response.data.message.output_file
            }
          }
          if (error.response.data.message.script_out_file) {
            if (typeof error.response.data.message.script_out_file === 'object') {
              errMsgs.script_out_file = true
              errMsgs.script_out_file_msg = error.response.data.message.script_out_file.toString()
            } else {
              errMsgs.script_out_file = true
              errMsgs.script_out_file_msg = error.response.data.message.script_out_file
            }
          }
          if (error.response.data.message.validate_query) {
            if (typeof error.response.data.message.validate_query === 'object') {
              errMsgs.validate_query = true
              errMsgs.validate_query_msg = error.response.data.message.validate_query.toString()
            } else {
              errMsgs.validate_query = true
              errMsgs.validate_query_msg = error.response.data.message.validate_query
            }
          }
          if (error.response.data.message.valid_expr) {
            if (typeof error.response.data.message.valid_expr === 'object') {
              errMsgs.valid_expr = true
              errMsgs.valid_expr_msg = error.response.data.message.valid_expr.toString()
            } else {
              errMsgs.valid_expr = true
              errMsgs.valid_expr_msg = error.response.data.message.valid_expr
            }
          }
          if (error.response.data.message.run_command) {
            if (typeof error.response.data.message.run_command === 'object') {
              errMsgs.run_command = true
              errMsgs.run_command_msg = error.response.data.message.run_command.toString()
            } else {
              errMsgs.run_command = true
              errMsgs.run_command_msg = error.response.data.message.run_command
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (error.response.data.errors) {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: error.response.data.errors[0].msg
            })
          } else if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async fetchListValidatorScripts({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.challengeURLApi + 'validator-script/list', payload)
      .then((res) => {
        if (res.data.success) {
          commit('LIST_VALIDATOR_SCRIPTS', res.data.data)
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async updateValidatorScript({ commit }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      name: false,
      name_msg: '',
      type: false,
      type_msg: '',
      file: false,
      file_msg: '',
      url: false,
      url_msg: '',
      invoke_order: false,
      invoke_order_msg: '',
      code_dir_file: false,
      code_dir_file_msg: '',
      target_uri: false,
      target_uri_msg: '',
      entrypoint: false,
      entrypoint_msg: '',
      output_file: false,
      output_file_msg: '',
      script_out_file: false,
      script_out_file_msg: '',
      validate_query: false,
      validate_query_msg: '',
      valid_expr: false,
      valid_expr_msg: '',
      run_command: false,
      run_command_msg: ''
    })
    await axios
      .put(config.challengeURLApi + 'validator-script/update', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully updated.', color: 'green', position: 'top' })
          commit('STATUS_OF_API', true)
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: true,
            name: false,
            name_msg: '',
            type: false,
            type_msg: '',
            file: false,
            file_msg: '',
            url: false,
            url_msg: '',
            invoke_order: false,
            invoke_order_msg: '',
            code_dir_file: false,
            code_dir_file_msg: '',
            target_uri: false,
            target_uri_msg: '',
            entrypoint: false,
            entrypoint_msg: '',
            output_file: false,
            output_file_msg: '',
            script_out_file: false,
            script_out_file_msg: '',
            validate_query: false,
            validate_query_msg: '',
            valid_expr: false,
            valid_expr_msg: '',
            run_command: false,
            run_command_msg: ''
          }
          if (error.response.data.message.name) {
            if (typeof error.response.data.message.name === 'object') {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name.toString()
            } else {
              errMsgs.name = true
              errMsgs.name_msg = error.response.data.message.name
            }
          }
          if (error.response.data.message.type) {
            if (typeof error.response.data.message.file === 'object') {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file.toString()
            } else {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file
            }
          }
          if (error.response.data.message.file) {
            if (typeof error.response.data.message.file === 'object') {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file.toString()
            } else {
              errMsgs.file = true
              errMsgs.file_msg = error.response.data.message.file
            }
          }
          if (error.response.data.message.url) {
            if (typeof error.response.data.message.url === 'object') {
              errMsgs.url = true
              errMsgs.url_msg = error.response.data.message.url.toString()
            } else {
              errMsgs.url = true
              errMsgs.url_msg = error.response.data.message.url
            }
          }
          if (error.response.data.message.invoke_order) {
            if (typeof error.response.data.message.invoke_order === 'object') {
              errMsgs.invoke_order = true
              errMsgs.invoke_order_msg = error.response.data.message.invoke_order.toString()
            } else {
              errMsgs.invoke_order = true
              errMsgs.invoke_order_msg = error.response.data.message.invoke_order
            }
          }
          if (error.response.data.message.code_dir_file) {
            if (typeof error.response.data.message.code_dir_file === 'object') {
              errMsgs.code_dir_file = true
              errMsgs.code_dir_file_msg = error.response.data.message.code_dir_file.toString()
            } else {
              errMsgs.code_dir_file = true
              errMsgs.code_dir_file_msg = error.response.data.message.code_dir_file
            }
          }
          if (error.response.data.message.target_uri) {
            if (typeof error.response.data.message.target_uri === 'object') {
              errMsgs.target_uri = true
              errMsgs.target_uri_msg = error.response.data.message.target_uri.toString()
            } else {
              errMsgs.target_uri = true
              errMsgs.target_uri_msg = error.response.data.message.target_uri
            }
          }
          if (error.response.data.message.entrypoint) {
            if (typeof error.response.data.message.entrypoint === 'object') {
              errMsgs.entrypoint = true
              errMsgs.entrypoint_msg = error.response.data.message.entrypoint.toString()
            } else {
              errMsgs.entrypoint = true
              errMsgs.entrypoint_msg = error.response.data.message.entrypoint
            }
          }
          if (error.response.data.message.output_file) {
            if (typeof error.response.data.message.output_file === 'object') {
              errMsgs.output_file = true
              errMsgs.output_file_msg = error.response.data.message.output_file.toString()
            } else {
              errMsgs.output_file = true
              errMsgs.output_file_msg = error.response.data.message.output_file
            }
          }
          if (error.response.data.message.script_out_file) {
            if (typeof error.response.data.message.script_out_file === 'object') {
              errMsgs.script_out_file = true
              errMsgs.script_out_file_msg = error.response.data.message.script_out_file.toString()
            } else {
              errMsgs.script_out_file = true
              errMsgs.script_out_file_msg = error.response.data.message.script_out_file
            }
          }
          if (error.response.data.message.validate_query) {
            if (typeof error.response.data.message.validate_query === 'object') {
              errMsgs.validate_query = true
              errMsgs.validate_query_msg = error.response.data.message.validate_query.toString()
            } else {
              errMsgs.validate_query = true
              errMsgs.validate_query_msg = error.response.data.message.validate_query
            }
          }
          if (error.response.data.message.valid_expr) {
            if (typeof error.response.data.message.valid_expr === 'object') {
              errMsgs.valid_expr = true
              errMsgs.valid_expr_msg = error.response.data.message.valid_expr.toString()
            } else {
              errMsgs.valid_expr = true
              errMsgs.valid_expr_msg = error.response.data.message.valid_expr
            }
          }
          if (error.response.data.message.run_command) {
            if (typeof error.response.data.message.run_command === 'object') {
              errMsgs.run_command = true
              errMsgs.run_command_msg = error.response.data.message.run_command.toString()
            } else {
              errMsgs.run_command = true
              errMsgs.run_command_msg = error.response.data.message.run_command
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async uploadValidatorScript({ commit }, payload) {
    commit('LOADING', true)
    return await axios
      .post(config.challengeURLApi + 'validator-script/upload', payload)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async removeValidatorScript({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.challengeURLApi + 'validator-script/remove', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully removed.', color: 'green', position: 'top' })
          dispatch('fetchListValidatorScripts', {
            challenge_id: payload.challenge_id
          })
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  challengePaginationKeyForward: (state) => state.paginationKey || {},
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchListChallenges: (state) => (state.listChallenges.length > 0 ? [...new Set(state.listChallenges)] : []),
  fetchListLabs: (state) => (state.listLabs.length > 0 ? [...new Set(state.listLabs)] : []),
  fetchListLabsOptions: (state) => (state.listLabsOptions.length > 0 ? [...new Set(state.listLabsOptions)] : []),
  fetchSolution: (state) => state.solution,
  fetchStatusOfApi: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  labsPaginationKeyForward: (state) => state.labsPaginationKey || {},
  listValidatorScripts: (state) => (state.listValidatorScripts.length > 0 ? [...new Set(state.listValidatorScripts)] : []),
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
