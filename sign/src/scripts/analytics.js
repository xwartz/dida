;(function () {
  var report = function(data) {
      if (window.Appest.isCnSites){
        _czc.push(data); // czc 统计
      } else {
        _gaq.push(data); // google 统计
      }
    }

    
    var sign = {
      'signin': 'signin',
      'signup': 'signup'
    }

    var analy = function (key) {
      var pushData = ['_trackEvent', 'signin_up'];
      pushData.push(sign[key])
      report(pushData);
    }
    window.analy = analy;
}());