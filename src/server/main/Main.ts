class MyApp implements App {
    constructor() {
        let users = KnuddelsServer.getChannel().getOnlineUsers();
        users.forEach(user => {
            this.openApp(user);
        });
    }
    public onUserJoined(user: User) {
        this.openApp(user);
        //Client.playSound("sfx/Calming - AShamaluevMusic.mp3");
        //https://www.ashamaluevmusic.com/ambient-music
    }
    private openApp(user: User) {
        user.sendPrivateMessage("Gib /restart ein um das Spiel neu zu starten und gib /quit ein um das Spiel zu beenden");
        let file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));
        user.getPersistence().addNumber("upgradePoints", 0);
    }
    /*    public onPublicMessage(msg:PublicMessage) {
            if (msg.getAuthor().isChannelModerator()) {
                if (msg.getRawText().contains("/kick"))
            }
        }
    */
    public mayShowPublicMessage(msg: PublicMessage): boolean {
        if (msg.getAuthor().getPersistence().getNumber("muted", 0) == 1) {
            return false;
        }
        return true;
    }
    private addUpgradePoints(toAdd: number, user: User) {
        const persistence = user.getPersistence();
        persistence.setNumber("upgradePoints", persistence.getNumber("upgradePoints", 0) + toAdd);
    }
    private subUpgradePoints(toSub: number, user: User) {
        const persistence = user.getPersistence();
        persistence.setNumber("upgradePoints", persistence.getNumber("upgradePoints", 0) - toSub);
    }
    private getUserByNick(nick: string): User {
        const userAcces = KnuddelsServer.getUserAccess();
        const user = userAcces.getUserById(userAcces.getUserId(nick));
        return user;
    }
    public chatCommands = {
        kill: (user: User, params: string, command: string) => {
            if (user.isChannelModerator()) {
                const userAcces = KnuddelsServer.getUserAccess();
                const victim = userAcces.getUserById(userAcces.getUserId(params));
                if (victim.isAppDeveloper()) {
                    return;
                }
                const persistence = victim.getPersistence();
                persistence.setNumber("muted", 1);
                user.sendPrivateMessage(victim.getNick() + " was muted");
            }
        },
        pardon: (user: User, params: string, command: string) => {
            if (user.isChannelModerator()) {
                const userAcces = KnuddelsServer.getUserAccess();
                const pardoned = userAcces.getUserById(userAcces.getUserId(params));
                const persistence = pardoned.getPersistence();
                persistence.deleteNumber("muted");
                user.sendPrivateMessage(pardoned.getNick() + " was muted");
            }
        },
        restart: (user: User, params: string, command: string) => {
            this.onUserJoined(user);
        },
        quit: (user: User, params: string, command: string) => {
            user.getAppContentSession(AppViewMode.Overlay).remove();
        },
        givePoints: (user: User, params: string, command: string) => {
            if (user.isChannelModerator()) {
                const paramsArray = params.split(" ");
                this.addUpgradePoints(parseInt(paramsArray[0]), this.getUserByNick(paramsArray[1]));
                user.sendPrivateMessage("Set points of " + paramsArray[1] + " to " + this.getUserByNick(paramsArray[1]).getPersistence().getNumber("upgradePoints"));
            }
        },
    }
}

var App = new MyApp();

