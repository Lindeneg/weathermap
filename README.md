# Weather App

- Began: October 17th 21:55 CEST
- Ended: Y
- Total: N hours.

---

### Acknowledgements

- I've previously used mapbox, so I have some exposure to it.
- I've never used openweathermap API.

----

### Initial Thoughts

Immediately after reading the description, I had the following ideas in mind:

1) When a user searches for a city, we should provide auto-suggestions of cities we guarantee are supported.
2) We should also show all supported cities in mapbox as clusters with clickable markers.
3) While the latter will be requested once, the former will be requested for each query keystroke.
4) Thus, we also need to ensure appropriate use of caching. 
5) My inclination is that using Cache-Control with gzip compression is probably fine for this assignment.

Now, in order to do that, we need to know about the cities we support, else we will not be able to provide
auto-suggestions. We also want both the geojson and auto suggestions to be cacheable.

That means, I'm going to build a very simple server that can help us achieve that. Normally, of course that's
not my job as a frontender but since I'm the only dev working on this assignment, I'll do it in order to achieve
the functionality I desire. 

For that reason, the server is also in js, so I can save a build-step and focus on the frontend side of things.

I found this dataset that I'm going to use: https://simplemaps.com/data/world-cities

Once we have this, the admittedly very simple system will look as follows:

![system.png](assets/weathermap.png)

For the frontend, I'm going to use a 3rd party library for styling ([tailwindcss](https://tailwindcss.com/)) and components ([shadcn](https://ui.shadcn.com/)).
For this simple app, it's probably a bit too much, but it'll save some time, so I can finish all the features I want.

### Usage

Note: this doesn't work yet, it's just how I imagine it'll work when I'm finished..

##### Clone repo

- `git clone git@github.com:lindeneg/weathermap.git`

- `cd weathermap`

##### Ensure correct node version

- `nvm use`
*(nvm will pick up the version from .nvmrc in root folder)*

##### Install dependencies

- `npm i`

##### Set Environment

- `mv ./webapp/.example.env ./webapp/.env`

- Then fill out the required values.

##### Go back to the root project folder and run the below commands in two separate shells:

**Ensure you're running the correct node version in both shells.**


- `npm run start:server`

- `npm run start:webapp`

*(we could use a shell script, [concurrently](https://www.npmjs.com/package/concurrently) or docker to run the system in a single command but for now, I'm fine with this)*

### After Thoughts

Well, im not done yet, so nothing yet..
