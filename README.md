# Deprecated

This project has been superceded by the easier-to-use and more flexible chatops-webhook-proxy.  You can find that repository here: https://github.com/Bluetel-Solutions/chatops-webhook-proxy

---

# JIRA to Slack Webhook

A simple Lambda picoservice for forwarding misc. webhooks from JIRA (e.g. those from Service Desk automation workflows)
to any given Slack/Discord incoming webhook endpoint.

Caveats:

- Webhooks cannot be used to communicate with multiple channels. This is unlikely to change.
- Message formatting is currently limited.


#### Requirements

- Yarn
- Serverless


#### Installation

1. git clone https://github.com/bluetel-solutions/jira-slack-webhook.git && cd jira-slack-webhook
2. cp .config.yml.dist .config.yml
3. yarn install
4. `serverless deploy --aws-profile <aws-profile-here> --stage prod`


#### Configuration

All configuration lives within `.config.yml`.
It may also be overridden by environemnt variable (for CI workflows, etc.)

```
webhookUrls: A comma separated list of URLs of Slack/Discord webhooks to post to
webhookTitle: The name and message used by the webhook user.  e.g. "JIRA".
```
