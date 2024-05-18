# Использование платформы linux/amd64
FROM --platform=linux/amd64 node:18-bullseye

WORKDIR /app/tg_bot

RUN apt-get update && apt-get install -y wget gnupg2
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y google-chrome-stable

COPY package*.json ./
RUN npm install --production

COPY . .

VOLUME [ "/app/tg_bot/db" ]

ENV TELEGRAM_TOKEN_API=''
ENV ENABLE_STATS='false'
ENV DB_LOGGING='false'
ENV CHROME_PATH=/usr/bin/google-chrome-stable

ENTRYPOINT ["node", "index.js"]