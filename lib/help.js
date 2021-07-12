const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))
const tele = require('./tele')
const chalk = require('chalk')

exports.start = async(lol, name, user) => {
    m = '`'
    text = `Hi [${user.username}](https://t.me/${user.username}), Im Chitanda Eru Bot

I'm a multi-functional bot

${m}Created By :${m} @rtwone

type /help to display a list of bot commands`
    await lol.replyWithPhoto({ url: 'https://tinyurl.com/yds9g9xh' }, {caption: text, parse_mode: "Markdown"})
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  NEW USER  ]"))
    console.log(tele.getUser(lol.message.from))
}

exports.help = async(lol, name, user_id) => {
    text = `Hello ${name}👋 Here are the available commands you can use :`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Islami ☪️', callback_data: 'islami-' + user_id },
                    { text: 'Download 📥', callback_data: 'downloader-' + user_id }
                ],
                [
                    { text: 'Random Image 📷', callback_data: 'randimage-' + user_id },
                    { text: 'Random Text 📑', callback_data: 'randtext-' + user_id },
                ],
                [
                    { text: 'Anime 🧸', callback_data: 'anime-' + user_id },
                    { text: 'Movie & Story 🎥', callback_data: 'movie-' + user_id },
                ],
                [
                    { text: 'Game 🎮', callback_data: 'game-' + user_id },
                    { text: 'Other 🛠️', callback_data: 'other-' + user_id }
                ],
                [
                    { text: 'Owner👨', callback_data: 'owner-' + user_id }
                ],
            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.game = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 GAME 」 ──

❏ ${prefix}suit
❏ ${prefix}tebakgambar
❏ ${prefix}slot`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.islami = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 ISLAMI 」 ──

❏ ${prefix}listsurah
❏ ${prefix}alquran no_surah
❏ ${prefix}alquran no_surah/no_ayat
❏ ${prefix}alquran no_surah/no_ayat1-no_ayat2
❏ ${prefix}alquranaudio no_surah
❏ ${prefix}alquranaudio no_surah/no_ayat
❏ ${prefix}asmaulhusna
❏ ${prefix}kisahnabi
❏ ${prefix}jadwalsholat daerah
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.other = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 OTHER 」 ──

❏ ${prefix}asupan
❏ ${prefix}randomaesthetic
❏ ${prefix}owner
❏ ${prefix}translate code|teks
❏ ${prefix}spamcall 62xxxx
❏ ${prefix}stickertoimg <reply sticker>
❏ ${prefix}tomp3 <reply vidio>
❏ ${prefix}brainly soal?
❏ ${prefix}memegenerator <reply image>
❏ ${prefix}shortlink link
❏ ${prefix}tourl <reply media>
❏ ${prefix}simi teks`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.owner = async(lol, user_id) => {                                                    prefix = config.prefix
    text = `── 「 OWNER 」 ──

❏ $ Exec
❏ > Eval
❏ ${prefix}runtime
❏ ${prefix}speed
❏ ${prefix}leave`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                     { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.downloader = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 DOWNLOADER 」 ──
    
❏ ${prefix}ytplay query
❏ ${prefix}ytsearch query
❏ ${prefix}ytmp3 link
❏ ${prefix}ytmp4 link
❏ ${prefix}igstalk username
❏ ${prefix}instagram link
❏ ${prefix}tiktoknowm link
❏ ${prefix}spotify link
❏ ${prefix}spotifyplay query
❏ ${prefix}jooxplay query
❏ ${prefix}pinterest query
❏ ${prefix}pinimage link
❏ ${prefix}pinvideo link
❏ ${prefix}pixiv query
❏ ${prefix}pixivdl pixiv_id
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.movie = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 MOVIE & STORY 」 ──

❏ ${prefix}drakorongoing
❏ ${prefix}lk21 query
❏ ${prefix}wattpad url_wattpad
❏ ${prefix}wattpadsearch query
❏ ${prefix}cerpen
❏ ${prefix}ceritahoror
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}


exports.anime = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 ANIME 」 ──

❏ ${prefix}wait
❏ ${prefix}manga query
❏ ${prefix}anime query
❏ ${prefix}character query
❏ ${prefix}kusonime url_kusonime
❏ ${prefix}kusonimesearch query
❏ ${prefix}otakudesu url_otakudesu
❏ ${prefix}otakudesusearch query
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.randtext = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 RANDOM TEXT 」 ──

❏ ${prefix}quotes
❏ ${prefix}quotesdilan
❏ ${prefix}quotesanime
❏ ${prefix}quotesimage
❏ ${prefix}faktaunik
❏ ${prefix}katabijak
❏ ${prefix}pantun
❏ ${prefix}bucin
❏ ${prefix}randomnama
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.randimage = async(lol, user_id) => {
    prefix = config.prefix
    text = `── 「 RANDOM IMAGE 」 ──

❏ ${prefix}ppcouple
❏ ${prefix}art
❏ ${prefix}bts
❏ ${prefix}exo
❏ ${prefix}elf
❏ ${prefix}loli
❏ ${prefix}neko
❏ ${prefix}waifu
❏ ${prefix}shota
❏ ${prefix}husbu
❏ ${prefix}sagiri
❏ ${prefix}shinobu
❏ ${prefix}megumin
❏ ${prefix}wallnime
❏ ${prefix}chiisaihentai
❏ ${prefix}trap
❏ ${prefix}blowjob
❏ ${prefix}yaoi
❏ ${prefix}ecchi
❏ ${prefix}hentai
❏ ${prefix}ahegao
❏ ${prefix}hololewd
❏ ${prefix}sideoppai
❏ ${prefix}animefeets
❏ ${prefix}animebooty
❏ ${prefix}animethighss
❏ ${prefix}hentaiparadise
❏ ${prefix}animearmpits
❏ ${prefix}hentaifemdom
❏ ${prefix}lewdanimegirls
❏ ${prefix}biganimetiddies
❏ ${prefix}animebellybutton
❏ ${prefix}hentai4everyone
❏ ${prefix}bj
❏ ${prefix}ero
❏ ${prefix}cum
❏ ${prefix}feet
❏ ${prefix}yuri
❏ ${prefix}trap
❏ ${prefix}lewd
❏ ${prefix}feed
❏ ${prefix}eron
❏ ${prefix}solo
❏ ${prefix}gasm
❏ ${prefix}poke
❏ ${prefix}anal
❏ ${prefix}holo
❏ ${prefix}tits
❏ ${prefix}kuni
❏ ${prefix}kiss
❏ ${prefix}erok
❏ ${prefix}smug
❏ ${prefix}baka
❏ ${prefix}solog
❏ ${prefix}feetg
❏ ${prefix}lewdk
❏ ${prefix}waifu
❏ ${prefix}pussy
❏ ${prefix}femdom
❏ ${prefix}cuddle
❏ ${prefix}hentai
❏ ${prefix}eroyuri
❏ ${prefix}cum_jpg
❏ ${prefix}blowjob
❏ ${prefix}erofeet
❏ ${prefix}holoero
❏ ${prefix}classic
❏ ${prefix}erokemo
❏ ${prefix}fox_girl
❏ ${prefix}futanari
❏ ${prefix}lewdkemo
❏ ${prefix}wallpaper
❏ ${prefix}pussy_jpg
❏ ${prefix}kemonomimi
❏ ${prefix}nsfw_avatar
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}
