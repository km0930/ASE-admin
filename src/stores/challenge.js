import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { challengeURLApi } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useChallengeStore = defineStore('challengeStore', () => {
  const error_msgs = ref({
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
  })
  const labsPaginationKey = ref({})
  const listChallenges = ref([])
  const listLabs = ref([])
  const listLabsOptions = ref([])
  const listValidatorScripts = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const solution = ref([])
  const statusOfApi = ref(true)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_CHALLENGES(data) {
    const prev = listChallenges.value
    listChallenges.value = prev.concat(data)
  }
  function RESET_LIST_CHALLENGES(data) {
    listChallenges.value = data
  }
  function CREATE_CHALLENGE(data) {
    listChallenges.value.unshift(data)
  }
  function UPDATE_CHALLENGE(data) {
    const index = listChallenges.value.findIndex((challenge) => challenge.sk === data.challenge_id)
    listChallenges.value.splice(index, 1, data)
  }
  function DELETE_CHALLENGE(data) {
    const index = listChallenges.value.findIndex((challenge) => challenge.sk === data.challenge_id)
    listChallenges.value.splice(index, 1)
  }
  function LIST_VALIDATOR_SCRIPTS(data) {
    listValidatorScripts.value = data
  }
  function LIST_SOLUTION(data) {
    solution.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function LABS_PAGINATION_KEY(data) {
    labsPaginationKey.value = data
  }
  function LIST_LABS(data) {
    const prev = listLabs.value
    listLabs.value = prev.concat(data)
  }
  function LIST_LABS_OPTIONS(data) {
    const prev = listLabsOptions.value
    listLabsOptions.value = prev.concat(data)
  }
  function RESET_LIST_LABS(data) {
    listLabs.value = data
  }
  function RESET_LIST_LABS_OPTIONS(data) {
    listLabsOptions.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }

  function loadingStatus(data) {
    LOADING(data)
  }

  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }

  async function fetchChallenges(payload) {
    LOADING(true)
    await challengeURLApi
      .post('challenge/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const challengesList = res.data.data.map((challenge) => ({
            ...challenge,
            id: challenge.sk
          }))
          SEARCH_FIRE(false)
          if (payload.reset) {
            RESET_LIST_CHALLENGES(challengesList)
          } else {
            LIST_CHALLENGES(challengesList)
          }
          PAGINATION_KEY(res.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function createChallenge(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    await challengeURLApi
      .post('challenge/create', payload)
      .then((res) => {
        if (res.data.success) {
          CREATE_CHALLENGE(res.data.data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Challenge object has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }

  async function updateChallenge(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    await challengeURLApi
      .post('challenge/update', payload)
      .then((res) => {
        if (res.data.success) {
          UPDATE_CHALLENGE(res.data.data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Challenge Object has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }

  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }

  function deleteChallenge(payload) {
    LOADING(true)
    challengeURLApi
      .post('challenge/delete', payload)
      .then((res) => {
        if (res.data.success) {
          DELETE_CHALLENGE(payload)
          Notify.create({ message: 'Challenge deleted successfully', color: 'red', position: 'top' })
        } else {
          IS_CREATE_ERROR('Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function getSolution(payload) {
    LOADING(true)
    await challengeURLApi
      .post('solution/get', payload)
      .then((res) => LIST_SOLUTION(res.data.data))
      .catch((error) => {
        throw error
      })
      .finally(() => LOADING(false))
  }

  async function attachSolution(payload) {
    LOADING(true)
    await challengeURLApi
      .post('solutions/attach', payload)
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
      .finally(() => LOADING(false))
  }

  async function uploadSolution(payload) {
    LOADING(true)
    return await challengeURLApi
      .post('solutions/upload', payload)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function detachSolution(payload) {
    LOADING(true)
    await challengeURLApi
      .post('solutions/detach', payload)
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
      .finally(() => LOADING(false))
  }

  function fetchLabs(payload) {
    LOADING(true)
    challengeURLApi
      .post('challenge/labs/list', payload.pagination)
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
            RESET_LIST_LABS(labList)
            RESET_LIST_LABS_OPTIONS(labListOptions)
          } else {
            LIST_LABS(labList)
            LIST_LABS_OPTIONS(labListOptions)
          }
          LABS_PAGINATION_KEY(res.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function addValidatorScript(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    await challengeURLApi
      .post('validator-script/add', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully added.', color: 'green', position: 'top' })
          STATUS_OF_API(true)
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
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
      .finally(() => LOADING(false))
  }

  async function fetchListValidatorScripts(payload) {
    LOADING(true)
    await challengeURLApi
      .post('validator-script/list', payload)
      .then((res) => {
        if (res.data.success) {
          LIST_VALIDATOR_SCRIPTS(res.data.data)
        } else {
          IS_CREATE_ERROR('Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function updateValidatorScript(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    await challengeURLApi
      .put('validator-script/update', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully updated.', color: 'green', position: 'top' })
          STATUS_OF_API(true)
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }

  async function uploadValidatorScript(payload) {
    LOADING(true)
    return await challengeURLApi
      .post('validator-script/upload', payload)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  async function removeValidatorScript(payload) {
    LOADING(true)
    await challengeURLApi
      .post('validator-script/remove', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Validator script was successfully removed.', color: 'green', position: 'top' })
          fetchListValidatorScripts({
            challenge_id: payload.challenge_id
          })
        } else {
          IS_CREATE_ERROR('Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    solution,
    labsPaginationKey,
    listChallenges,
    error_msgs,
    statusOfApi,
    listLabsOptions,
    paginationKey,
    loading,
    searchByName,
    searchFire,
    listValidatorScripts,
    loadingStatus,
    errorMsgReset,
    fetchChallenges,
    createChallenge,
    updateChallenge,
    searchByNameAction,
    deleteChallenge,
    getSolution,
    attachSolution,
    uploadSolution,
    detachSolution,
    fetchLabs,
    addValidatorScript,
    fetchListValidatorScripts,
    updateValidatorScript,
    uploadValidatorScript,
    removeValidatorScript
  }
})
