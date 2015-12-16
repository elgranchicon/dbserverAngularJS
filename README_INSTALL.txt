
//inside app's root folder:

//if you don't have already installedi, do it:
sudo brew install nodejs
sudo npm install bower
sudo npm install grunt-cli


//after, to update the required dependencies 
//the folders 'bower_components, node_modules' will be created
npm install
bower install
grunt clean
grunt build --force
grunt serve --force


//the address to access the app
//http://localhost:9000/#/sistema
