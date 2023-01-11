FROM python:3
WORKDIR /app
ARG POETRY_VERSION=1.2.2
RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/cache/apk/* && \
    pip3 install --no-cache-dir poetry && \
    rm -rf ~/.cache/ &&\
    apt-get install -y wget \
        && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
        && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
        && apt-get update && apt-get -y install google-chrome-stable chromium  xvfb\
        && rm -rf /var/lib/apt/lists/* \
        && echo "Chrome: " && google-chrome --version \
#WORKDIR /app
COPY package*.json ./
RUN #npm install
COPY . .
ENV WECHATY_PUPPET_WECHAT_ENDPOINT=/usr/bin/google-chrome


#COPY package*.json ./
COPY pyproject.toml ./
COPY poetry.lock ./
# Install dependencies
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

RUN poetry install && npm install && rm -rf ~/.npm/
COPY . .
CMD ["npm", "run", "dev"]

#FROM node:19 AS app
#
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#ENV WECHATY_PUPPET_WECHAT_ENDPOINT=/usr/bin/google-chrome
#CMD xvfb-run --server-args="-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" npm run dev