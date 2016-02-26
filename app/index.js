'use strict'

let $ = require('jquery'),
    Objectid = require('objectid')

let path = require('path'),
    userConfig = require('./user-config'),
    appest = require('./appest'),
    conf = userConfig.readConfig('Appest')

const Appest = Object.assign({}, appest, conf)

let App = {
  $el: $('#js-add'),
  createTask (model) {
    let _this = this
    const api = Appest.protocol + Appest.api_domain + '/api/v2/task'
    $.ajax({
      type: 'POST',
      url: api,
      contentType: 'application/json',
      data: JSON.stringify(model),
      success (data) {
        _this.$el.val('')
      }
    })
  },

  initEvent () {
    this.$el.on('keyup', (event) => {
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
          title: this.$el.val(),
        }
        this.createTask(model)
      }
    })
  },

  init () {
    this.initEvent()
  }

}

App.init()
