const core = require('@actions/core')
const superagent = require('superagent')
const dayjs = require('dayjs')
const { format } = require('util')

async function run() {
  try {
    const userId = core.getInput('user_id')
    core.info(`user_id: ${userId}`)
    const res = await superagent
      .post('https://api.juejin.cn/content_api/v1/article/query_list')
      .send({
        user_id: userId,
        sort_type: 2,
        cursor: '0',
      })
    const articleList = res.body.data.map((item) => item.article_info)
    if (articleList.length === 0) {
      core.warning(`${userId} 此 id 没发表文章`)
      return
    }
    const itemMd = articleList
      .map(
        (article) =>
          `* <a href='https://juejin.cn/post/${
            article.article_id
          }' target='_blank'>${article.title}</a> - ${dayjs
            .unix(article.ctime)
            .format('YYYY/MM/DD HH:mm')}`
      )
      .join('\n')
    const md = format(
      `#### 🤾‍ <a href="https://juejin.cn/user/${userId}" target="_blank">最近更新</a>
  %s`,
      itemMd
    )
    core.setOutput('md', md)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
