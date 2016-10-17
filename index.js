require(["requirejsConfig"], function () {
  require(["jquery", "jquery.mobile", "js/Pages"], function ($, jqm, Pages) {
    $(document)
      .ready(function () {

        if (window.parent.location.href.indexOf(".m.pozi.com") == -1 &&
          window.parent.location.href.indexOf("localhost") == -1 &&
          window.parent.location.href.indexOf("127.0.0.1") == -1) {

          var redirectURL = window.parent.location.href.replace(".pozi.com", ".m.pozi.com")
          var redirectURLNoHash = redirectURL.replace(window.parent.location.hash, '')

          //console.log("Redirecting to: " + redirectURLNoHash)
          // This alert to be uncommented near to when we setup the bendigo domain on AWS
          //alert('The web address of this app is moving. \n\nPlease update your bookmark: \n\n' + redirectURLNoHash) // Warning Message 1
          //alert('The web address of this app will expire on Tuesday 18th October. \n\nPlease update your bookmark: \n\n' + redirectURLNoHash) // More urgent message.
          // Next level will be static text (Make change on Tuesday 25-Oct.)
          // window.location.replace(redirectURLNoHash)

          $("#pageMain")
            .html("<h2>This web app has moved.</h2><br/>The new address is:<br/><br/><a href='" + redirectURLNoHash + "'>" + redirectURLNoHash + "</a><br/><br/>Please update your bookmarks.")

          return
        }

        if (!window.startedPoziMobile) {
          Pages.doNew();
          window.startedPoziMobile = true;
        }
      });
  });
});
