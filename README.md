PProject 4:

In this project, a website with a number of optimization-  and performance-related issues  is provided and
after optimization, a target that PageSpeed score is above 90/100 for mobile and desktop and it runns
60 frames per second should be achieved by using critical rendering path learned and Google DevTools.

This project is hosted at: http://qqttss.github.io/project_4/

Part 1: Optimize PageSpeed Insights score for index.html

1. Optimize the following images to reduce the download bytes: views/images/Pizzeria.jpg file size
   reduced from 2.3MB to 31.KB, and imag/profilepic file size reduced to 5KB.
2. Remove Parsing-Blocking Javascripts:  Make Javascript file Asynchonous
   (http://www.google-analytics.com/analytics.js).

3. Rendering Blocking CSS Optimization:
  a) Media query is added to css/print.css.
  b) Inline and minify css/style.css.
  c) Remove web font stylesheet.

4. Further optimization can be realized by applying HTTP caching at the web server side.

   After optimization, the PageSpeed Insights improves from 28/100 and 30/100 to 92/100 and 93/100
   for Mobile and Desktop scores, respectively.

Part 2: Optimize Frames per Second in pizza.html

1. Timeline analysis shows that less than 60 FPS performance is due to FLS. The problem is with the
function updatePositions(). In the updatePositioins(), every pizza style.left is calculated and
updated when the browser window is scrolled. scrollTop remains the same for each scoll action.
There is no need to calculate the phase value for each pizza in the loop as modulus operation only
generates fixed number of values. Another optimization  is to precalculate the phase value and only
update each pizza element phase in the loop to reduce the javascript run time overhead.

2. When generating the sliding pizzas upon the page loads, 200 pizzas are not necessary. For regular
viewport, only a small amount of pizzas are really needed. So the optimization effort is to only
generate enough pizzas fitting current viewport dimension.

3. To slide the slider to choose recipe for pizzas and Time to resize pizzas takes too long time.
TimeLine trace indicates that FLS is caused by the function determineDx(elem, size) at Line 425 which
is repeated called by changePizzaSizes(size) at Line 452. Refactor changePizzaSize(size) to simplify
the pizza size style change by following the instructor directions in the course.



