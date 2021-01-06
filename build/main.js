"use strict";
var MyApp = /** @class */ (function () {
    function MyApp() {
        var _this = this;
        this.chatCommands = {
            kill: function (user, params, command) {
                if (user.isChannelModerator()) {
                    var userAcces = KnuddelsServer.getUserAccess();
                    var victim = userAcces.getUserById(userAcces.getUserId(params));
                    if (victim.isAppDeveloper()) {
                        return;
                    }
                    var persistence = victim.getPersistence();
                    persistence.setNumber("muted", 1);
                    user.sendPrivateMessage(victim.getNick() + " was muted");
                }
            },
            pardon: function (user, params, command) {
                if (user.isChannelModerator()) {
                    var userAcces = KnuddelsServer.getUserAccess();
                    var pardoned = userAcces.getUserById(userAcces.getUserId(params));
                    var persistence = pardoned.getPersistence();
                    persistence.deleteNumber("muted");
                }
            },
            restart: function (user, params, command) {
                _this.onUserJoined(user);
            },
        };
    }
    MyApp.prototype.onUserJoined = function (user) {
        user.sendPrivateMessage("Gib /restart ein um das Spiel neu zu starten");
        var file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));
    };
    /*    public onPublicMessage(msg:PublicMessage) {
            if (msg.getAuthor().isChannelModerator()) {
                if (msg.getRawText().contains("/kick"))
            }
        }
    */
    MyApp.prototype.mayShowPublicMessage = function (msg) {
        if (msg.getAuthor().getPersistence().getNumber("muted", 0) == 1) {
            return false;
        }
        return true;
    };
    return MyApp;
}());
var App = new MyApp();
