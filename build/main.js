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
                    user.sendPrivateMessage(pardoned.getNick() + " was muted");
                }
            },
            restart: function (user, params, command) {
                _this.onUserJoined(user);
            },
            quit: function (user, params, command) {
                user.getAppContentSession(AppViewMode.Overlay).remove();
            },
            givePoints: function (user, params, command) {
                if (user.isChannelModerator()) {
                    var paramsArray = params.split(" ");
                    _this.addUpgradePoints(parseInt(paramsArray[0]), _this.getUserByNick(paramsArray[1]));
                    user.sendPrivateMessage("Set points of " + paramsArray[1] + " to " + _this.getUserByNick(paramsArray[1]).getPersistence().getNumber("upgradePoints"));
                }
            },
        };
    }
    MyApp.prototype.onUserJoined = function (user) {
        user.sendPrivateMessage("Gib /restart ein um das Spiel neu zu starten und gib /quit ein um das Spiel zu beenden");
        var file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));
        user.getPersistence().addNumber("upgradePoints", 0);
        //Client.playSound("sfx/Calming - AShamaluevMusic.mp3");
        //https://www.ashamaluevmusic.com/ambient-music
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
    MyApp.prototype.addUpgradePoints = function (toAdd, user) {
        var persistence = user.getPersistence();
        persistence.setNumber("upgradePoints", persistence.getNumber("upgradePoints", 0) + toAdd);
    };
    MyApp.prototype.subUpgradePoints = function (toSub, user) {
        var persistence = user.getPersistence();
        persistence.setNumber("upgradePoints", persistence.getNumber("upgradePoints", 0) - toSub);
    };
    MyApp.prototype.getUserByNick = function (nick) {
        var userAcces = KnuddelsServer.getUserAccess();
        var user = userAcces.getUserById(userAcces.getUserId(nick));
        return user;
    };
    return MyApp;
}());
var App = new MyApp();
