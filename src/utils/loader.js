import { Loading, QSpinnerFacebook } from 'quasar'

let pendingRequests = 0

export function showLoader(status) {
  status ? pendingRequests++ : pendingRequests--

  if (pendingRequests > 0) {
    return Loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: 'white',
      spinnerSize: 140,
      message: 'Hang on...',
      messageColor: 'white'
    })
  } else {
    pendingRequests = 0
    return Loading.hide()
  }
}
