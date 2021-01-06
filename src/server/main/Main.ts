class MyApp implements App {
    public onUserJoined(user: User) {
        user.sendPrivateMessage("Hi " + user.getNick());
    }
}

var App = new MyApp();

