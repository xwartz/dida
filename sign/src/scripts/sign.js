'use strict'

let ipc = require('electron').ipcRenderer
let homeUrl = window.Appest.protocol + window.Appest.domain

let emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/i

let View = {
  password: '',
  email: '',
  isPasswordOK: false,
  isEmailValid: false,
  dom: $('#login-box'),

  find (query) {
    return this.dom.find(query)
  },

  init () {
    let self = this
    this.find('.switch-site a').click((event) => {
      event.preventDefault()
      self.setSwitchUrl()
    })

    this.find('#username').change(() => {
      self.checkEmailFormat()
    }).keyup(() => {
      self.checkingEmailFormat()
    })

    this.find('#password').keyup(() => {
      self.checkingPassword1()
    })
    this.find('#submit-btn').click(() => {
      event.preventDefault()
      self.submit()
    })
    this.find('input').keydown(() => {
      if (event.keyCode === 13) {
        self.submit()
      }
    })
    this.find('#forget-password').click(() => {
      event.preventDefault()
      self.resetPassword()
    })
    this.find('.signup-link').click(() => {
      event.preventDefault()
      self.signUp()
    })
    this.find('.required').focus(() => {
      let
        parent = $(event.target).parent(),
        element = parent.find('i').first(),
        iconClass = 'icon-' + element.attr('icon') + '-gray',
        activeIcon = 'icon-' + element.attr('icon') + '-blue'

      parent.addClass('active')
      element.removeClass(iconClass)
      element.addClass(activeIcon)
    }).blur(() => {
      let
        parent = $(event.target).parent(),
        element = parent.find('i').first(),
        iconClass = 'icon-' + element.attr('icon') + '-gray',
        activeIcon = 'icon-' + element.attr('icon') + '-blue'

      parent.removeClass('active')
      element.addClass(iconClass)
      element.removeClass(activeIcon)
    })
  },

  setSwitchUrl () {
    let url = this.find('.switch-site a').attr('href')
    let email = this.find('#username').val()
    url = url + '?username=' + email
    window.location.href = url
  },

  submit () {
    this.checkEmailFormat()
    this.checkPassword1()
    this.postLogin()
  },

  checkEmailFormat () {
    this.email = this.find('#username').val()
    this.find('#error_no_user_info').fadeOut(200)
    this.isEmailValid = false
    let isMatch = this.email.match(emailRegexp)
    if (isMatch) {
      this.find('#email_invalid_warn').fadeOut(200)
      this.find('#not_blank').fadeOut(200)
      this.isEmailValid = true
    } else {
      if (this.email.length > 0) {
        this.find('#not_blank').fadeOut(200)
        this.find('#email_invalid_warn').fadeIn(200)
      } else {
        this.find('#not_blank').fadeIn(200)
      }
    }
  },

  checkingEmailFormat () {
    this.email = this.find('#username').val()
    let isMatch = this.email.match(emailRegexp)
    this.find('#email_invalid_warn').fadeOut(200)
    if (this.email.length > 0) {
      this.find('#not_blank').fadeOut(200)
    }
    return isMatch
  },

  checkPassword1 () {
    this.password = this.find('#password').val()
    this.isPasswordOK = false
    let isMatch = this.password.length >= 6
    if (isMatch) {
      this.find('#login_length_warn_empty').fadeOut(200)
      this.find('#login_length_warn').fadeOut(200)
      this.isPasswordOK = true
    } else {
      if (this.password.length > 0) {
        this.find('#login_length_warn_empty').fadeOut(200)
        this.find('#login_length_warn').fadeIn(200)
      } else {
        this.find('#login_length_warn_empty').fadeIn(200)
      }
    }
  },

  checkingPassword1 () {
    this.find('#error_username_password').fadeOut(200)
    this.password = this.find('#password').val()
    if ((this.password.length >= 6)) {
      this.find('#login_length_warn').fadeOut(200)
    } else if (this.password.length > 0) {
      this.find('#login_length_warn_empty').fadeOut(200)
    }
  },

  postLogin () {
    if (!this.isPasswordOK || !this.isEmailValid)
      return

    this.find('.submit input').attr('disabled')
    this.find('.submit').addClass('waiting ing')
    let url = window.Appest.protocol + window.Appest.api_domain + '/api/v2/user/signon?wc=true&remember=true'
    let self = this
    $.ajax({
      type: 'POST',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.email,
        password: this.password
      }),

      success (data) {
        ipc.send('signin', data)
      },

      error (err) {
        self.loginError(err)
      }
    })
  },

  needSwitchDomain () {
    let url = ' /api/v2/user/sign/available/brothersite?username=' + this.email
    $.get(url, (data) => {
      if (!data) {
        $('#need_switch_domain').fadeIn(200)
      } else {
        $('#error_no_user_info').fadeIn(200)
      }
    })
  },

  loginError (err) {
    this.find('.submit input').removeAttr('disabled')
    this.find('.submit').removeClass('waiting ing')
    let obj = $.parseJSON(err.responseText)
    if (obj && obj.errorCode === 'username_not_exist') {
      this.needSwitchDomain()
    } else if (obj && obj.errorCode === 'username_password_not_match') {
      this.find('#error_username_password').fadeIn(200)
    } else {
      $('#login_server_error').fadeIn(200)
    }
  },
  resetPassword () {
    let username = $('#username').val()
    let url = '/sign/requestRestPassword'
    if (username) {
      url += '?username=' + username
    }
    window.location.href = homeUrl + url
  },
  signUp () {
    let username = $('#username').val()
    let url = '/signup'
    if (username) {
      url += '?username=' + username
    }
    window.location.href = homeUrl + url
  }
}

View.init()
