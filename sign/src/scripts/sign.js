'use strict'

let ipc = require('electron').ipcRenderer
let Appest = require(__dirname + '/app/appest')

let homeUrl = Appest.protocol + Appest.domain
let emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/i

let View = {
  password: '',
  email: '',
  isPasswordOK: false,
  isEmailValid: false,

  initDom () {
    this.$empty = $('#login_length_warn_empty')
    this.$warn = $('#login_length_warn')
    this.$ewarn = $('#email_invalid_warn')
    this.$blank = $('#not_blank')
    this.$ps = $('#password')
    this.$eps = $('#error_username_password')
    this.$spt = $('.submit input')
    this.$submit = $('.submit')
    this.$name = $('#username')
  },

  init () {
    let _this = this
    this.initDom()

    this.$name.change(() => {
      _this.checkEmailFormat()
    }).keyup(() => {
      _this.checkingEmailFormat()
    })

    this.$ps.keyup(() => {
      _this.checkingPassword1()
    })

    $('#submit-btn').click(() => {
      event.preventDefault()
      _this.submit()
    })

    $('input').keydown(() => {
      if (event.keyCode === 13) {
        _this.submit()
      }
    })

    $('.required').focus(() => {
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

  submit () {
    this.checkEmailFormat()
    this.checkPassword1()
    this.postLogin()
  },

  checkEmailFormat () {
    this.isEmailValid = false
    this.email = this.$name.val()
    $('#error_no_user_info').fadeOut(200)
    let isMatch = this.email.match(emailRegexp)
    if (isMatch) {
      this.$ewarn.fadeOut(200)
      this.$blank.fadeOut(200)
      this.isEmailValid = true
    } else {
      if (this.email.length > 0) {
        this.$blank.fadeOut(200)
        this.$ewarn.fadeIn(200)
      } else {
        this.$blank.fadeIn(200)
      }
    }
  },

  checkingEmailFormat () {
    this.email = this.$name.val()
    let isMatch = this.email.match(emailRegexp)
    this.$ewarn.fadeOut(200)
    if (this.email.length > 0) {
      this.$blank.fadeOut(200)
    }
    return isMatch
  },

  checkPassword1 () {
    this.password = this.$ps.val()
    this.isPasswordOK = false

    let isMatch = this.password.length >= 6

    if (isMatch) {
      this.$empty.fadeOut(200)
      this.$warn.fadeOut(200)
      this.isPasswordOK = true
    } else {
      if (this.password.length > 0) {
        this.$empty.fadeOut(200)
        this.$warn.fadeIn(200)
      } else {
        this.$empty.fadeIn(200)
      }
    }
  },

  checkingPassword1 () {
    this.$eps.fadeOut(200)
    this.password = this.$ps.val()
    if ((this.password.length >= 6)) {
      this.$warn.fadeOut(200)
    } else if (this.password.length > 0) {
      this.$empty.fadeOut(200)
    }
  },

  postLogin () {
    if (!this.isPasswordOK || !this.isEmailValid)
      return

    this.$spt.attr('disabled')
    this.$submit.addClass('waiting ing')

    let url = homeUrl + '/api/v2/user/signon?wc=true&remember=true'

    let _this = this
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
        _this.loginError(err)
      }
    })
  },

  loginError (err) {
    this.$spt.removeAttr('disabled')
    this.$submit.removeClass('waiting ing')
    let obj = $.parseJSON(err.responseText)
    if (obj && obj.errorCode === 'username_password_not_match') {
      this.$eps.fadeIn(200)
    } else {
      $('#login_server_error').fadeIn(200)
    }
  }
}

View.init()
