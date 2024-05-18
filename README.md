About the application
--------------

This application is necessary in order to relay sent memes from Instagram to a chat with a bot for everyone who is subscribed to it

Quick start
-------------

```
docker run -e TELEGRAM_TOKEN_API=<your-tg-token> -e CHROME_PATH='/usr/bin/google-chrome-stable' -v solt_sqlite_data:/app/tg_bot/db --name solt-mem-bot_tg --rm -d -t so1tan0v/solt-meme-tg_bot_64-image
```