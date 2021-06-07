let currentView, model;
window.onload = function () {
    //We instantiate our model
    model = new DriftModel();
    model.init();

    let chatView = new ChatView('chat', model);
    miniChatController = new MiniChatController(chatView, model);

    //Initialize VIEWS and controllers
    let homeView = new HomeView('page-content')
    homeViewController = new HomeViewController(homeView, model);

    let exhibitionView = new ExhibitionView('page-content', model);
    exhibitionViewController = new ExhibitionViewController(exhibitionView);

    let robotView = new RobotView('page-content', model);
    robotViewController = new RobotViewController(robotView, chatView, model);

    let tourView = new TourView('page-content', model);
    tourViewController = new TourViewController(tourView);

    let aboutView = new AboutView('page-content', model);
    aboutViewController = new AboutViewController(aboutView);

    let mainMenuView = new MainMenuView('mainMenu', model);
    mainMenuViewController = new MainMenuViewController(mainMenuView);

    let emojiView = new EmojiView('emojiParty');
    emojiController = new EmojiController(emojiView, model);

    //start home view
    showView("home");
};

//show view
//view: string with the name of the view to render
function showView(view) {
    model.interaction.page(view);
    if (currentView != null) currentView.unMountView()
    switch (view) {
        case 'home':
            currentView = homeViewController;
            homeViewController.renderView();
            mainMenuViewController.unMountView();
            break;
        case 'exhibition':
            currentView = exhibitionViewController;
            exhibitionViewController.renderView();
            mainMenuViewController.renderView();
            break;
        case 'meetTheRobot':
            currentView = robotViewController;
            robotViewController.renderView();
            mainMenuViewController.renderView();
            break;
        case 'tour':
            currentView = tourViewController;
            tourViewController.renderView();
            mainMenuViewController.renderView();
            break;
        case 'about':
            currentView = aboutViewController;
            aboutViewController.renderView();
            mainMenuViewController.renderView();
            break;
        default:
            currentView = homeViewController;
            homeViewController.renderView();
            mainMenuViewController.unMountView();
    }
}
