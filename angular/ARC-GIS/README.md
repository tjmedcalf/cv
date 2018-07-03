ReadMe – ARC-GIS + Angular (2018)
=================================

Overview
--------

This was a project where NV partnered with Eagle to develop an interactive map using the ESRI(ARC-GIS) JS API.

Much of the ESRI work was completed by Eagle in vanilla JS but a non-js developer which was then provided to me to re-factor and integrate within an Angular framework.

It might be worth noting that this project was a Proof of Concept and had a very tight timeframe which as deliverd upon - but there are obvious inefficiencies in the controllers.

###MAP


###MAP DETAIL
Map detail (mapDetailController) has to crudely traverse the DOM to extract input values from the ARC-GIS control, it can then update those values programatically via API requests.