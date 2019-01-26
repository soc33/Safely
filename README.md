# Safely

> *"For safety is not a gadget, but a state of mind." - Eleanor Everet*

---

In the last millennium this may have been the case. Today in 2019, the information accessible by the internet is endless and all in the palm of your hand.

Approximately every 26.3 seconds a violent crime is committed. The thought of living in a utopia without crime or living in a world with a super-hero that saves the day is far-feteched.

With Safely, it will solve four problems that people have every day when traveling or exploring the Orlando area.

1. Lack of information
2. Knowing where the user currently is.
3. Knowing the user is in an area they're in/about to visit is safe.
4. Is the crime data used in our app accurate compared to peoples opinions who actually live in these areas?

\\ How to use the website \\
Safely is designed for an easy way for the user to check if they are in a safe area or if the area they are traveling to is safe. Our website also displays helpful resources such as hurricane preparedness, links to local law enforcement and the number for the suicide prevention hotline which are all listed on the apps carosel.

If the user doesn't know where they are or traveling to an area they are unfamiliar with, Safely will pull (with permission) the users geolocation or be able to take a zipcode and display the users location on a map or highlight the area of the zipcode a user inputs.

Safely makes an API call to the Orlando City Crime API to pull the crime stats for the users current location or zipcode input. It first makes a call to find all dangerous crime in the area. If there is dangerous crime it will display a red or yellow container depending on the amount of dangerous crime. If there isn't any dangerous crime, the app then makes a second API call to check for volume of non dangerous crime such as, petty theft, domestic issues, etc. If it hits 5% of Orlando's crime it will bring back red, 2% yellow and 1% or less Green, with the disclaimer to always be aware of your surroundings in new areas but there is currently little to no crime documented in the area. When you ask for a future location via zipcode Safely will bring back more comprehensive view of the crime compared to geolocation. It displays the type of crime into a graph that is easy for the user to view and understand.

Firebase allowed us to create a way for the user to leave a comment about a zipcode between app users. If the user lives in an area where they feel it isn't truly representative of the data (more safe/dangerous) you can let fellow app users know. Comments are only displayed for the zipcode they pertain to.

  In later revisions we plan to...
  * Make our app more user friendly with customization abilities so that the carosel can represent more safety things that are important/relevent.
  * Add the points of the most recent crime so the user can see in real time how close or far away they are from crime locations.
  * Pull from a ntaional database to extend our capabilities beyond the orlando area.
  * Have a user authentication system to where comments can be up-voted or down-voted people more honest as well as keep people from deleting comments that are not theirs.

---

  The original idea for this website came from the thought of having an app where the user is able to report bad/drunk drivers in an area to advise drivers of an area to avoid in real-time and be able to leave comments when and where an incident happened and flag it as an area to avoid. We as a group thought why not make the topic broader that would effect a larger audience by all crime and not just driving.

  Problems we ran into.
  + Finding an API that was both free and would spit out the data we needed
  + Finding a free version of google maps to use on our project
  + Spelling variables correctly to make the javascript functional -.-