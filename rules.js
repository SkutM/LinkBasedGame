class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.show("You are a daring archaeologist who has ventured into the windswept dunes of the Egyptian desert, where the great Pyramid of Anubis stands as a testament to the ancients. <br>Having discovered the entrance to this long-lost temple, you are on a quest to locate the Gem of Osiris, a legendary jewel said to possess untold power.<br>-=-=-=-=-=-=-=-=-<br>You stand before the grand entrance of an ancient Egyptian pyramid, its massive stone doors carved with intricate hieroglyphs that tell tales of gods and pharaohs long passed. <br>The air is heavy with the scent of sandalwood and myrrh, and the quiet whisper of the desert wind beckons you inside. <br> Palm trees sway gently at the periphery, framing the gateway to forgotten chambers and hidden treasures.");
        this.engine.addChoice("Continue Inside", "InitialLocation");
        this.engine.storyData.HasKey = false; // Initialize key state
        this.engine.storyData.isClicked = false;
        this.engine.storyData.HasAmulet = false;
        this.engine.storyData.GoodEnding = false;

        // seen ?

        this.engine.storyData.seen01 = false;
    }

    handleChoice(choice) {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // Use the key to get the correct location data

        let bodyHtml = locationData.Body; 
        if (key === "Temple Gardens" && this.engine.storyData.isClicked == false) {
            bodyHtml += "This lush oasis in the midst of sandy desolation offers a respite with its array of <span id='exoticPlants' style='cursor: pointer; text-decoration: underline;'>exotic plants</span> and flowers.<br>The paths are lined with statues of deities, each offering blessings of health and prosperity.";
            this.engine.show(bodyHtml);
            this.engine.storyData.isClicked = true;
        }
        
        if (key === "Final") {
            if (this.engine.storyData.GoodEnding == false) {
                bodyHtml += "Running back to the Sacred Altar, notice the Altar has disappeared, and a large stone wall has suddenly emerged from the depths, blocking your exit.<br><br> Turning around, you notice the beast is right behind you...<br><br><br> Perhaps if you had found the Amulet?"
                this.engine.show(bodyHtml);
            }
            else if (this.engine.storyData.GoodEnding == true){
                bodyHtml += "Running back to the Sacred Altar, you glance at the Amulet to see it suddenly glowing a bright red color. The beast, upon entering the room behind you, suddenly stops and widens its eyes at the sight of the Amulet.<br><br>A large beam emits from the Amulet, and strikes the beast, vaporizing it completely.<br><br>You pick up the Gem of Osiris from where the beast once stood. You are victorious!"
                this.engine.show(bodyHtml);
            }

            // "Running back to the Sacred Altar, you glance at the Amulet to see it suddenly glowing a bright red color. The beast, upon entering the room behind you, suddenly stops and widens its eyes at the sight of the Amulet.<br><br>A large beam emits from the Amulet, and strikes the beast, vaporizing it completely.<br><br>You pick up the Gem of Osiris from where the beast once stood. You are victorious!"
            // "Running back to the Sacred Altar, notice the Altar has disappeared, and a large stone wall has suddenly emerged from the depths, blocking your exit.<br><br> Turning around, you notice the beast is right behind you...<br><br><br> Perhaps if you had found the Amulet?"
            
        }

        if (key === "Temple Gardens") {
            setTimeout(() => {
                document.getElementById('exoticPlants').addEventListener('click', () => {
                    this.engine.show("<br><br>Tucked away behind an unassuming wall of exotic plants lies the Hidden Niche, a small space overflowing with ancient scrolls and artifacts.<br>Among these treasures sits an amulet, aglow with an ethereal light.<br>It's said to restrain the guardian beast if placed atop the Altar's Pedastal.");
                    this.engine.storyData.HasAmulet = true;
                    this.engine.gotoScene(Location, this.engine.storyData.Garden);
                });
            }, 0);
        }

        if (locationData.RequiresKey && !this.engine.storyData.HasKey) {
            this.engine.show("You approach the door and attempt to open it. It does not budge.");
            this.engine.gotoScene(Location, this.engine.storyData.Chamber);
            return;
        }
        if (!locationData.isBodyShown) {
            this.engine.show(locationData.Body);
            locationData.isBodyShown = true; // Mark as shown

        }
        else {
            this.engine.show(locationData.Body2);
        }
        
        if (locationData.Choices && locationData.Choices.length > 0) { 
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.", () => this.engine.gotoScene(End)); 
        }
    }

    handleChoice(choice) {

        if (choice.Action && choice.Action === "Obtain the key") {
            if (this.engine.storyData.HasKey == true) {
                this.engine.show("You have already picked up the key.");
            }
            else {
            this.engine.storyData.HasKey = true; // Set the key state to true
            this.engine.show("You have picked up a key from the bottom of the pool.");
            }
        }

        if (choice.Action && choice.Action === "Place Amulet") {
            if (this.engine.storyData.HasAmulet == true) {
                this.engine.show("You place the Amulet upon the Altar. A slight rumbling is heard.");
                this.engine.storyData.GoodEnding = true;
            }
            else {
            this.engine.show("You have nothing to place atop the Altar!");
            }
        }
        if (choice && choice.Target !== "NULL") {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');