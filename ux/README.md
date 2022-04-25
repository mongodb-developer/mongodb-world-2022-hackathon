# GDELT UX for the MongoDB World 2022 Hackathon

The UX will display news events with the reporting website information (CNN, etc.), as well as a heatmap of where the events are taking place.

Users will be able to search through news events as well as display them based on geographic region.

## Instructions

To get this project working, you'll have to have a few things ready to go both inside the code and outside the code. Follow these list of instructions to help get things working:

1. Copy the project's **.env.local.example** and rename it **.env.local** for all your project variables.
2. Replace the `NEXT_ATLAS_*` variables with those of your actual MongoDB Atlas information for the project.
3. Add your Mapbox information to the `MAPBOX_ACCESS_TOKEN` field to be used for the heatmap.
4. Run `npm install` to download any project dependencies.
5. Execute `npm run dev` to create a local deployment of the application.

The MongoDB Atlas information can be found after creating a new cluster within the [MongoDB Cloud](https://cloud.mongodb.com). The Mapbox information can be found after creating a new account for [Mapbox](https://www.mapbox.com).

## Credits

This UX is a forked variation of the [MongoDB eCommerce](https://github.com/mongodb-developer/mongodb-ecommerce) demo which was originally created by Jesse Hall.