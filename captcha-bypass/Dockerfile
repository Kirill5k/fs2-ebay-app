FROM buildkite/puppeteer:latest

RUN npm i puppeteer-extra user-agents puppeteer-extra-plugin-stealth
COPY . .
ENV  PATH="${PATH}:/node_modules/.bin"

CMD [ "node", "index.js" ]