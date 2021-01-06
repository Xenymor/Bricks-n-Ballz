"use strict";
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp.prototype.onUserJoined = function (user) {
        var file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));
    };
    return MyApp;
}());
var App = new MyApp();
