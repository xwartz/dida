'use strict'

let path = require('path'),
    userConfig = require('./desktop/user-config'),
    appest = require('./desktop/appest'),
    conf = userConfig.readConfig('Appest')

const Appest = Object.assign({}, appest, conf)

let $ = require('jquery'),
    Objectid = require('objectid')

let App = {
  createTask: function(model) {
    const api = Appest.protocol + Appest.api_domain + '/api/v2/task'
    $.ajax({
      type: 'POST',
      url: api,
      contentType: 'application/json',
      data: JSON.stringify(model),
      success: function(data) {
        console.log(data)
      }
    })
  },

  initEvent: function() {
    let _this = this
    $('#js-add').on('keyup', function(event) {
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
          modifiedTime: '2016-02-23T22:24:29.845+0800',
          priority: 0,
          projectId: Appest.user.inboxId,
          remindTime: null,
          reminder: null,
          reminders: null,
          sortOrder: 0,
          status: 0,
          timeZone: 'Asia/Shanghai',
          title: $(this).val(),
        }
        _this.createTask(model)
      }
    })
  },

  init: function() {
    console.log(Appest)
    this.initEvent()
  }

}

App.init()
