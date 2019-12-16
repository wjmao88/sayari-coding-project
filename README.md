# Sayari Project

## How to run

Run `npm install` or `yarn [install]` to install packages. Run `npm run start` or `yarn [run] start` to run. The app should be available at `localhost:12345`

## Features

### Nav and alerts

The nav bar, well, navs to pages. There is only one real page, the People page. All the other pages are mostly blank. The Violations page is there to show alerts.

Alerts start out at 100/200. It will tick up as the pretend alert backend increment alerts if you are not looking. When you visit a page and the pages loads its data, then alerts for that page is cleared. It can still tick up from 0. On the People page, getting a new set of data (by clicking on either "Use Set Data" or "Use Random Data" buttons) will also reset the alerts.

### The graph

The main content of the page is a fairly basic graph of people and companies. Each circle represent a Person or a Company, with the initial letter of their name inside the circle. Hovering over the circle shows a popup with more details about them. 

The circles can be dragged around. When you drag one, that node will become "pinned" and won't be moved my the force layout engine. You can click on the "UNPIN" button-ish thing to unpin them and they will probably snap back to join the rest of the graph.

There are a few buttons that controls the sizing of the graph. Zooming in/out will make the nodes and the svg bigger/smaller. The Bigger/Smaller svg buttons will make svg bigger/smaller without affecting the size of nodes, for if the graph is too big/too small and you need more/less space.

### Tables and focus

Below the graph is a table of all the nodes data. I didn't do a relationships table because I don't have anything fancy in mind for them. You can do some filtering and searching of names of persons or companies. There is a expand/collapse toggle at the beginning of each row that toggles a panel showing additional information.

The (I think) cool thing I made is the focus button. When you click on it, it will "focus" on a node and only show direct neighbours of it. A new panel will appeare above the graph (and you should be scrolled to it) that shows you what you are focusing on and to unfocus it. There are also two depth control buttons that lets you expand or shrink the depth to show more or less neighbours, until the whole graph becomes visible.

## Techs

### D3
Well, this is focus of this project. I actually haven't used it for anything serious in a long time and spent a looooot of time debugging simple and stupid errors. 

### Typescript
I've become to really like typescript for how much easier it make things if you are willing to invest a bit of time for some type defintions. It takes off a lot of burden of having to keep things in mind and infers enough to get out of your way. Particularly here for d3, it actually was yelling hard at me for some of the simple/stupid errors because the types was off but stupid me didn't believe their types were that good.

### React
I'm using react for the general construction and state management of the app. I actually didn't spend a lot of time for everything that was in react (well, I should say for everything that's not d3).

### Styled Components
This is my first time trying it out. I've been mostly just using sass, but the more I work on styling stuff the more I favor a css-in-js solution. So I'm taking this chance to try out something new.

### Fast-Check
A property based testing library that is really for property based testing by generating random data and shrinking down error data to find the simplest form of data that can break the app, though I'm just using it for the generating data part. I said this is the file itself but again, this has become my favorite part a lot of times.