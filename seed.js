let mongoose    = require("mongoose");
let comment     = require("./models/comment");  
let campground  = require("./models/campgound");  

let data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

let seedDb = () => {
    //Removed all campgrounds
    campground.remove({}, (err) => {
        if(err)
            console.log(`Error : ${err}`)
        else
        {
            console.log("Removed Campgounds");
            //Adding new campgrounds
            for(element of data) {
                campground.create(element, (err, newCampground) =>  {
                    if(err)
                        console.log(`Error : ${err}`)
                    else
                    {
                        console.log("Added a campground");
                        comment.create({text : "Nice place!!!!", author : "Anonymous"}, (err, newComment) => {
                            if(err)
                                console.log(`Error : ${err}`)
                            else
                            {
                                newCampground.comments.push(newComment);
                                newCampground.save((err, updatedCampgound) => {
                                    if(err)
                                        console.log(`Error : ${err}`)
                                    else 
                                        console.log("Added comment to post");
                                });
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            }
        }
    })
};

module.exports = seedDb;