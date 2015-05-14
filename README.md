# TecnoBot
twitter bot to new technology, SEO, CEO and CTO
```zsh
TecnoBot
├── config.json         #config file
├── gulpfile.js         #run bot in production
├── lib
│   └── bot.js          #TecnoBot
├── LICENSE
├── package.json
├── Procfile            #Ready to heroku
└── README.md
```
#########Require
+ nodejs
###Install
```zsh
$ git clone https://github.com/orggue/TecnoBot.git
$ cd TecnoBot
$ sudo npm install
```
##Config variables
Create a file in ./TecnoBot directory config.json
```json
{
    "env":{
        "consumer_key": "...",
        "consumer_secret": "...",
        "access_token": "...",
        "access_token_secret": "..."
    }
}
```
If you want to export the logs into https://papertrailapp.com add logConfig.json file into ./TecnoBot directory
```json
{
    "env":{
        "url_log": "...",
        "port_log": "..."
    }
}
```
###Run
```zsh
$ gulp
```
###Deploy
Remember add the variables into heroku
```zsh
$ git push heroku
```
