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
###Run
```zsh
$ gulp
```
###Deploy
```zsh
$ git push heroku
```
