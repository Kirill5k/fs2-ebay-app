FROM buildkite/puppeteer:latest

RUN npm i puppeteer-extra user-agents
COPY . .
ENV  PATH="${PATH}:/node_modules/.bin"

CMD [ "node", "index.js" ]