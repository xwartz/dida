;
(function ($) {

  var ipc = window.require && require('electron').ipcRenderer

  var homeUrl = window.Appest.protocol + window.Appest.domain

  var emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/i

  var signinView = {
    password: '',
    email: '',
    isPasswordOK: false,
    isEmailValid: false,
    dom: $('#login-box'),
    regExt: /\?channel=chrome_extension_open_panel/,
    checkChannel: function () {
      if (this.regExt.test(window.location.href)) {
        this.dom.addClass('chrome-extension')
      }
    },

    find: function (query) {
      return this.dom.find(query)
    },
    init: function () {
      this.checkChannel()
      var self = this
      this.find('.switch-site a').click(function (event) {
        event.preventDefault()
        self.setSwitchUrl()
      })
      this.find('#username').change(function () {
        self.checkEmailFormat()
      })
      this.find('#username').keyup(function () {
        self.checkingEmailFormat()
      })
      this.find('#password').keyup(function () {
        self.checkingPassword1()
      })
      this.find('#submit-btn').click(function (event) {
        event.preventDefault()
        self.submit()
      })
      this.find('input').keydown(function (event) {
        if (event.keyCode === 13) {
          self.submit()
        }
      })
      this.find('#forget-password').click(function (event) {
        event.preventDefault()
        self.resetPassword()
      })
      this.find('.signup-link').click(function (event) {
        event.preventDefault()
        self.signUp()
      })
      this.find('.required').focus(function (event) {
        var event = event || window.event,
          parent = $(event.target).parent(),
          element = parent.find('i').first(),
          iconClass = 'icon-' + element.attr('icon') + '-gray',
          activeIcon = 'icon-' + element.attr('icon') + '-blue';

        parent.addClass('active')
        element.removeClass(iconClass)
        element.addClass(activeIcon)
      })

      this.find('.required').blur(function (event) {
        var event = event || window.event,
          parent = $(event.target).parent(),
          element = parent.find('i').first(),
          iconClass = 'icon-' + element.attr('icon') + '-gray',
          activeIcon = 'icon-' + element.attr('icon') + '-blue';

        parent.removeClass('active')
        element.addClass(iconClass)
        element.removeClass(activeIcon)
      })
    },

    setSwitchUrl: function () {
      var url = this.find('.switch-site a').attr('href');
      var email = this.find('#username').val();

      url = url + '?username=' + email;
      if (this.regExt.test(window.location.href)) {
        url = url + '&&channel=chrome_extension_open_panel'
      }
      window.location.href = url
    },

    submit: function () {
      this.checkEmailFormat()
      this.checkPassword1()
      this.postLogin()
    },

    checkEmailFormat: function () {
      this.email = this.find('#username').val()
      this.find('#error_no_user_info').fadeOut(200)
      this.isEmailValid = false
      var isMatch = this.email.match(emailRegexp)
      if (isMatch) {
        this.find('#email_invalid_warn').fadeOut(200);
        this.find('#not_blank').fadeOut(200);
        this.isEmailValid = true
      } else {
        if (this.email.length > 0) {
          this.find('#not_blank').fadeOut(200);
          this.find('#email_invalid_warn').fadeIn(200)
        } else {
          this.find('#not_blank').fadeIn(200);
        }
      }
    },

    checkingEmailFormat: function () {
      this.email = this.find('#username').val()
      var isMatch = this.email.match(emailRegexp)
      this.find('#email_invalid_warn').fadeOut(200);
      if (this.email.length > 0) {
        this.find('#not_blank').fadeOut(200);
      }
      return isMatch
    },

    checkPassword1: function () {
      this.password = this.find('#password').val()
      this.isPasswordOK = false
      var isMatch = this.password.length >= 6;
      if (isMatch) {
        this.find('#login_length_warn_empty').fadeOut(200);
        this.find('#login_length_warn').fadeOut(200);
        this.isPasswordOK = true
      } else {
        if (this.password.length > 0) {
          this.find('#login_length_warn_empty').fadeOut(200);
          this.find('#login_length_warn').fadeIn(200);
        } else {
          this.find('#login_length_warn_empty').fadeIn(200);
        }
      }
    },

    checkingPassword1: function () {
      this.find("#error_username_password").fadeOut(200);
      this.password = this.find('#password').val()
      if ((this.password.length >= 6)) {
        this.find('#login_length_warn').fadeOut(200);
      } else if (this.password.length > 0) {
        this.find('#login_length_warn_empty').fadeOut(200);
      }
    },

    postLogin: function () {
      if (!this.isPasswordOK || !this.isEmailValid) return
      this.find('.submit input').attr('disabled')
      this.find('.submit').addClass('waiting ing')
      var url = window.Appest.protocol + window.Appest.api_domain + '/api/v2/user/signon?wc=true&remember=true'
      var self = this
      $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify({
          username: this.email,
          password: this.password
        }),
        success: function (data) {
          if(ipc) {
            ipc.send('signin', data)
            return;
          }
          window.analy('signin')
          window.location.href = homeUrl
        },
        error: function (err) {
          self.loginError(err);
        }
      })
    },

    needSwitchDomain: function () {
      var url = ' /api/v2/user/sign/available/brothersite?username=' + this.email;
      $.get(url, function (data) {
        if (!data) {
          $('#need_switch_domain').fadeIn(200);
        } else {
          $("#error_no_user_info").fadeIn(200);
        }
      })
    },

    loginError: function (err) {
      this.find('.submit input').removeAttr('disabled')
      this.find('.submit').removeClass('waiting ing')
      var obj = $.parseJSON(err.responseText)
      if (obj && obj.errorCode === 'username_not_exist') {
        this.needSwitchDomain()
      } else if (obj && obj.errorCode === 'username_password_not_match') {
        this.find('#error_username_password').fadeIn(200)
      } else {
        $('#login_server_error').fadeIn(200)
      }
    },
    resetPassword: function () {
      var username = $("#username").val()
      var url = "/sign/requestRestPassword"
      if (username) {
        url += '?username=' + username
      }
      window.location.href = homeUrl + url
    },
    signUp: function () {
      var username = $("#username").val()
      var url = "/signup"
      if (username) {
        url += '?username=' + username
      }
      window.location.href = homeUrl + url
    }
  }

  // the signup ajax part

  var signupView = {
    email: '',
    password1: '',
    isEmailValid: false,
    isPasswordOK: false,
    canShowShareAccount: $('#share_user_account').length,
    nickNameLimit: 30,
    emailLimit: 80,

    dom: $("#signup-box"),

    init: function () {
      var self = this
      this.find('#nickname').keydown(function (event) {
        self.nickNameLimitCheck()
      })
      this.find('#set-username').keydown(function (event) {
        self.emailLimitCheck()
      })
      this.find('#set-username').change(function (event) {
        self.checkEmail()
      })

      this.find('#set-username').keyup(function (event) {
        self.checkingEmailFormat()
      })

      this.find('#set-password').keyup(function (event) {
        self.checkingPassword1()
      })
      this.find('#submit-btn').click(function (event) {
        event.preventDefault()
        self.submit()
      })
      this.find('input').keydown(function (event) {
        if (event.keyCode === 13) {
          self.submit()
        }
      })
      this.find('.signin-link,.switch-login').click(function (event) {
        event.preventDefault()
        self.signIn()
      })

      this.find('.required').focus(function (event) {
        var event = event || window.event,
          parent = $(event.target).parent(),
          element = parent.find('i').first(),
          iconClass = 'icon-' + element.attr('icon') + '-gray',
          activeIcon = 'icon-' + element.attr('icon') + '-blue';

        parent.addClass('active')
        element.removeClass(iconClass)
        element.addClass(activeIcon)
      })

      this.find('.required').blur(function (event) {
        var event = event || window.event,
          parent = $(event.target).parent(),
          element = parent.find('i').first(),
          iconClass = 'icon-' + element.attr('icon') + '-gray',
          activeIcon = 'icon-' + element.attr('icon') + '-blue';

        parent.removeClass('active')
        element.addClass(iconClass)
        element.removeClass(activeIcon)
      })
    },

    submit: function () {
      this.checkAll()
      this.postSignup()
    },

    signIn: function () {
      var username = this.find('#set-username').val()
      var url = "/signin"
      if (username) {
        url += '?username=' + username
      }
      window.location.href = homeUrl + url
    },

    checkAll: function () {
      if (!this.isChecked) {
        this.checkEmail()
      }
      this.checkEmailFormat()
      this.checkPassword1()
    },

    postSignup: function () {
      if (!this.isEmailValid || !this.isPasswordOK) return
      var url = window.Appest.protocol + window.Appest.api_domain + '/api/v2/user/signup/'
      var name = this.find('#nickname').val();
      var data = {
        name: name,
        username: this.email,
        password: this.password1
      }
      this.find('.submit input').attr('disabled')
      this.find('.submit').addClass('waiting ing')
      var self = this
      $.ajax({
        headers: {
          // 'X-Device': this.getDeviceInfo()
        },
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          if(ipc) {
            ipc.send('signin', data)
            return;
          }
          window.analy('signup')
          self.signupSuccess()
        },
        error: function (err) {
          self.singupError(err)
          self.find('.submit input').removeAttr('disabled')
          self.find('.submit').removeClass('waiting ing')
        }
      })
    },

    getDeviceInfo: function () {
      var deviceName = "Other";
      var version = "0";
      try {
        if (window.navigator.userAgent.indexOf('Chrome') != -1) {
          deviceName = "Chrome";
          version = window.navigator.userAgent.match(/Chrome\/(\S*)/)[1];
        } else if (window.navigator.userAgent.indexOf('Safari') != -1) {
          deviceName = "Safari";
          version = window.navigator.userAgent.match(/Version\/(\S*)/)[1];
        } else if (window.navigator.userAgent.indexOf('Firefox') != -1) {
          deviceName = "Firefox";
          version = window.navigator.userAgent.match(/Firefox\/(\S*)/)[1];
        } else if (this.isIE()) {
          deviceName = "IE";
          version = window.navigator.userAgent.match(/MSIE\s?(\S*)/)[1];
        }
      } catch (e) {

      }
      return "web_App, " + deviceName + ", " + version + ", , " + "web_App";
    },

    isIE: function (ver) {
      var b = document.createElement('b')
      b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
      return b.getElementsByTagName('i').length === 1
    },

    signupSuccess: function () {
      window.location.href = homeUrl
    },

    singupError: function (err) {
      this.find('#server_error').fadeIn(200);
    },

    nickNameLimitCheck: function () {
      var nickName = this.find('#nickname').val()
      if (nickName.length > this.nickNameLimit) {
        nickName = nickName.substr(0, this.nickNameLimit)
        this.find('#nickname').val(nickName)
      }
    },

    emailLimitCheck: function (argument) {
      var email = this.find('#set-username').val()
      if (email.length > this.emailLimit) {
        email = email.substr(0, this.emailLimit)
        this.find('#set-username').val(email)
      }
    },

    checkEmail: function () {
      this.isChecked = true
      this.email = this.find('#set-username').val()
      this.isEmailValid = false
      if (!this.checkEmailFormat()) return;
      var self = this
      var url = window.Appest.protocol + window.Appest.api_domain + '/api/v1/user/sign/available?username=' + this.email
      $.get(url, function (data) {
        self.handleEmail(data)
      })
    },

    handleEmail: function (err) {
      if (err.available) {
        this.isEmailValid = true
      } else if (err.share_user_account && this.canShowShareAccount) {
        this.find('#share_user_account').fadeIn(200);
        this.find('#taken_warn').fadeOut(200);
        this.find('#invalid_warn').fadeOut(200);
        $('#username').val(this.email)
      } else {
        this.canShowShareAccount && this.find('#share_user_account').fadeOut(200);
        this.find('#taken_warn').fadeIn(200);
        if (this.email.length > 0) {
          this.find('#invalid_warn').fadeOut(200);
        } else {
          this.find('#invalid_warn').fadeIn(200);
        }
      }
    },

    find: function (query) {
      return this.dom.find(query)
    },

    checkEmailFormat: function () {
      var emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,9}$/i
      var isMatch = this.email.match(emailRegexp)
      if (isMatch) {
        this.find('#not_blank').fadeOut(200);
        this.find('#invalid_warn').fadeOut(200);
      } else {
        if (this.email.length > 0) {
          this.find('#not_blank').fadeOut(200);
          this.find('#invalid_warn').fadeIn(200);
        } else {
          this.find('#not_blank').fadeIn(200);
        }
      }
      return isMatch
    },

    checkingEmailFormat: function () {
      this.find('#taken_warn').fadeOut(200)
      this.canShowShareAccount && this.find('#share_user_account').fadeOut(200)
      this.email = this.find('#set-username').val()
      var isMatch = this.email.match(emailRegexp)
      this.find('#invalid_warn').fadeOut(200);
      if (this.email.length > 0) {
        this.find('#not_blank').fadeOut(200);
      }
      return isMatch
    },

    checkPassword1: function () {
      this.password1 = this.find('#set-password').val()
      this.isPasswordOK = false
      var isMatch = this.password1.length >= 6;
      var tooLong = this.password1.length <= 20;
      if (isMatch && tooLong) {
        this.find('#length_warn1').fadeOut(200);
        this.isPasswordOK = true
      } else {
        if (this.password1.length > 0) {
          this.find('#length_warn1').fadeIn(200);
        } else {
          this.find('#login_length_warn_empty').fadeIn(200);
        }
      }
      return isMatch;
    },

    checkingPassword1: function () {
      this.password1 = this.find('#set-password').val()
      if ((this.password1.length >= 6)) {
        this.find('#length_warn1').fadeOut(200)
      } else if (this.password1.length > 0) {
        this.find('#login_length_warn_empty').fadeOut(200);
      }
    }
  }

  signinView.init()
  signupView.init()

}(window.$))
