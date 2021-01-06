class MyApp implements App {
    public onUserJoined(user: User) {
        user.sendPrivateMessage("Gib /restart ein um das Spiel neu zu starten");
        let file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));
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
            }
        },
        restart: (user: User, params: string, command: string) => {
            this.onUserJoined(user);
        },
    }
}

var App = new MyApp();

