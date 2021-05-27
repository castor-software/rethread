class ExhibitionView {
    constructor(container, model) {

        this.container = document.getElementById(container);
        this.model = model;
        // this.meetRobot_btn = null;
    }

    render() {
        var content = `
        <div id="webSitesWrapper"></div>
        <div id="sideMenuWrapper"></div>
		`;
        this.container.innerHTML = content;
        this.renderMainVis();

    }

    setIdentifications() {
        // this.meetRobot_btn = document.getElementById("meetRobotBtn");
    }

    renderMainVis() {
        //ADD MAIN VISUALIZATION VIEW
        let mainVisView = new MainVisView("webSitesWrapper", this.model);
        this.mainVizController = new MainVisController(mainVisView, this.model);
        this.mainVizController.renderView();

        //ADD SIDE MENU VIEW
        let sideMenuView = new SideMenuView("sideMenuWrapper", this.model);
        this.sideMenuController = new SideMenuController(sideMenuView, this.model);
        this.sideMenuController.renderView();
        //ADD TIMELINE VIEW

    }
}
