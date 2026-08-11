# Ginzzzu's Camera Frames

![GitHub Release](https://img.shields.io/github/v/release/Ginzzzu/ginzzzu-camera-frames?label=Version)
![Total Downloads](https://img.shields.io/github/downloads/Ginzzzu/ginzzzu-camera-frames/ginzzzu-camera-frames.zip?label=Total%20Downloads)
![Latest Release Downloads](https://img.shields.io/github/downloads/Ginzzzu/ginzzzu-camera-frames/latest/ginzzzu-camera-frames.zip?label=Latest%20Release)

Version 0.6.2 synchronizes each player's permitted personal camera appearance for every connected participant.

Included:
- the original custom black-and-white image mask;
- the CSS circular camera mode;
- solid, double, dashed, segmented, and dotted frame styles;
- independent thickness, color, finish, glare, and inner-shadow settings;
- a visible Glow finish with both a bright line and an inward circular halo;
- shared world appearance settings for the GM;
- a separate GM-only ApplicationV2 menu for player permissions;
- a separate player-only ApplicationV2 menu for personal appearance;
- category-level permissions for shape, frame style, thickness, color, finish, glare, and inner shadow;
- value-level allowlists inside every permitted category;
- automatic hiding of blocked categories and values from players;
- automatic fallback to the GM value when a saved player choice becomes unavailable;
- hidden legacy user-scoped settings retained only as a migration source;
- each player's appearance stored in a serialized DataModel-backed flag on that player's User document;
- every client applying the owning user's saved appearance to that user's camera tile;
- immediate refresh after a User document update or Foundry camera-dock re-render;
- unchanged camera dimensions, Foundry layout, player-name placement, controls, and hover behavior.

The GM first enables personal customization in the shared Appearance Policy setting. The GM-only Player Permissions menu then controls which categories and exact values players may use. Players receive a separate Personal Appearance menu containing only those permitted choices. The inherited GM value remains available in every visible category.

A player's saved choice belongs to that player's camera rather than to the viewing browser. If a player selects a blue dotted frame, the same blue dotted frame is shown for that player's camera to the player, the GM, and every other connected participant.

The module uses Foundry VTT 14's CameraViews API to obtain each existing camera view by its owning User ID. It adds appearance classes only to those existing `.camera-view` elements and does not insert child elements or alter Foundry's camera layout.

Permission data is stored in a dedicated DataModel-backed world setting. Personal appearance is validated with a dedicated DataModel and serialized with `toObject()` before being saved to the User flag.

The frame remains on `.camera-view::after`, while glare, inner shadow, and the visible inward glow halo share `.camera-view::before`.
