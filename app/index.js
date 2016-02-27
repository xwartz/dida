'use strict'

let Objectid = require('objectid')


let path = require('path'),
    userConfig = require('./user-config'),
    appest = require('./appest'),
    conf = userConfig.readConfig('Appest')

const Appest = Object.assign({}, appest, conf)

let App = {
  $el: document.getElementById('js-add'),
  createTask (model) {
    const api = Appest.protocol + Appest.api_domain + '/api/v2/task'

    fetch(api, {
      credentials: 'include',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(model)
    }).then((res) => {
      if(res.status >= 200 && res.status < 300) {
        this.$el.value = ''
      }
    })
  },

  initEvent () {
    this.$el.addEventListener('keyup', (event) => {
      if(event.keyCode === 13) {
        let model = {
          assignee: null,
          content: '',
          deleted: 0,
          dueDate: null,
          id: Objectid().toString(),
          isAllDay: null,
          items: [],
          local: true,
          priority: 0,
          projectId: Appest.user.inboxId,
          remindTime: null,
          reminder: null,
          reminders: null,
          status: 0,
          timeZone: 'Asia/Shanghai',
          title: this.$el.value,
        }
        this.createTask(model)
      }
    }, false)
  },

  init () {
    this.initEvent()
  }

}

App.init()
