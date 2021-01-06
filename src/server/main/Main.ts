class MyApp implements App {
    public onUserJoined(user: User) {
        let file = new HTMLFile('index.html', {});
        user.sendAppContent(AppContent.overlayContent(file, 330, 570));        
    }
}

var App = new MyApp();

