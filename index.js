const {IncomingWebhook} = require('@slack/client')
const denodeify = require('denodeify')

const Issue = require('./entity/issue').Issue
const User = require('./entity/user').User


const webhooks = process.env.WEBHOOK_URLS.split(',')
const sendToSlack = (webhook, message) => {
  const incomingSlackWebhook = new IncomingWebhook(webhook)
  const sendMessage = denodeify(incomingSlackWebhook.send.bind(incomingSlackWebhook), (header, statusCode, body) => {
    return [header, statusCode, body]
  })

  return sendMessage(message)
}
const sendToAllSlacks = message => Promise.all(webhooks.map(webhook => sendToSlack(webhook, message)))


module.exports.webhook = (event, context, callback) => {

  const source = (event.body && event.body.length > 0) ? JSON.parse(event.body) : event

  if (source.issue === undefined) {
    callback(null, { statusCode: 500, body: "invalid response" } )
  }

  const issue = new Issue(source.issue)
  const user = new User(source.user)

  sendToAllSlacks({
    text: process.env.WEBHOOK_MESSAGE,
    parse: "full",
    attachments: [{
      color: "#00CF00",
      author_name: user.displayName,
      author_icon: user.miniThumbnail,
      fields: [{
        title: "ID",
        value: issue.key
      }, {
        title: "Title",
        value: issue.title
      }, {
        title: "Description",
        value: issue.description
      }]
    }],
    username: process.env.WEBHOOK_TITLE,
    iconEmoji: ':robot_face:'
  })
  .then(res => callback(null, { statusCode: 200, body: 'ok' } ))
  .catch(err => callback(null, { statusCode: 500, body: JSON.stringify(err) } ))
}
