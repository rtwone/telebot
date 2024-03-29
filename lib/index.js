
const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const { exec, spawn } = require("child_process")
const chalk = require('chalk')
const { getUser, getPost, searchUser } = require('./lib/Insta.js')
const { y2mateA, y2mateV } = require('./lib/ytdl.js')
const speed = require('performance-now')
const util = require('util')
const axios = require('axios')
const ytsr = require('ytsr')
const yts = require('yt-search')
const os = require('os')
const fs = require('fs')
const brainly = require('brainly-scraper-v2')
const ra_api = require('ra-api')

const {
    apikey,
    bot_token,
    owner,
    ownerLink,
    version,
    prefix
} = JSON.parse(fs.readFileSync(`./config.json`))

if (bot_token == "") {
    return console.log("=== BOT TOKEN CANNOT BE EMPTY ===")
}

const sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}

const bot = new Telegraf(bot_token)

function kyun(seconds) {
   function pad(s){
    return (s < 10 ? '0' : '') + s;
    }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
        //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
        return `${pad(hours)}Hours, ${pad(minutes)}Minutes, ${pad(seconds)}Seconds`
}

bot.on("new_chat_members", async(ryn) => {
    var message = ryn.message
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var groupname = message.chat.title
    var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
    for (x of message.new_chat_members) {
        var pp_user = await tele.getPhotoProfile(x.id)
        var full_name = tele.getUser(x).full_name
        var id_mem = tele.getUser(x).username
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  JOINS  ]"), chalk.whiteBright(full_name), chalk.greenBright("join in"), chalk.whiteBright(groupname))
        await ryn.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/base/welcome?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${full_name}&member=${groupmembers}&groupname=${groupname}` }, { caption: 'Welcome @'+id_mem+'' })
    }
})

bot.on("left_chat_member", async(ryn) => {
    var message = ryn.message
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var groupname = message.chat.title
    var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
    var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
    var full_name = tele.getUser(message.left_chat_member).full_name
    var id_mem = tele.getUser(message.left_chat_member).username
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  LEAVE  ]"), chalk.whiteBright(full_name), chalk.greenBright("leave from"), chalk.whiteBright(groupname))
    await ryn.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/base/leave?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${full_name}&member=${groupmembers}&groupname=${groupname}` }, { caption: 'Sayonara @'+id_mem+'' })
})

bot.command('start', async(ryn) => {
    user = tele.getUser(ryn.message.from)
    await help.start(ryn, user.full_name)
    await ryn.deleteMessage()
})

bot.command('help', async(ryn) => {
    user = tele.getUser(ryn.message.from)
    await help.help(ryn, user.full_name, ryn.message.from.id.toString())
})

bot.on("callback_query", async(ryn) => {
    cb_data = ryn.callbackQuery.data.split("-")
    user_id = Number(cb_data[1])
    if (ryn.callbackQuery.from.id != user_id) return ryn.answerCbQuery("Sorry, You do not have the right to access this button.", { show_alert: true })
    callback_data = cb_data[0]
    user = tele.getUser(ryn.callbackQuery.from)
    const isGroup = ryn.chat.type.includes("group")
    const groupName = isGroup ? ryn.chat.title : ""
    if (!isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    if (callback_data == "help") return await help[callback_data](ryn, user.full_name, user_id)
    await help[callback_data](ryn, user_id.toString())
})

bot.on("message", async(ryn) => {
        const body = ryn.message.text || ryn.message.caption || ""
        comm = body.trim().split(" ").shift().toLowerCase()
        cmd = false
        if (prefix != "" && body.startsWith(prefix)) {
            cmd = true
            comm = body.slice(1).trim().split(" ").shift().toLowerCase()
        }
        const command = comm
        const args = await tele.getArgs(ryn)
        const user = tele.getUser(ryn.message.from)
        const pushname = user.full_name
        const sender = user.first_name
        const ownerID = ["rtwone"]
        const isOwner = ownerID.includes(user.username)
        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                return await ryn.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
            }
        }

        const isCmd = cmd
        const isGroup = ryn.chat.type.includes("group")
        const groupName = isGroup ? ryn.chat.title : ""

        const isImage = ryn.message.hasOwnProperty("photo")
        const isVideo = ryn.message.hasOwnProperty("video")
        const isAudio = ryn.message.hasOwnProperty("audio")
        const isSticker = ryn.message.hasOwnProperty("sticker")
        const isContact = ryn.message.hasOwnProperty("contact")
        const isLocation = ryn.message.hasOwnProperty("location")
        const isDocument = ryn.message.hasOwnProperty("document")
        const isAnimation = ryn.message.hasOwnProperty("animation")
        const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

        const quotedMessage = ryn.message.reply_to_message || {}
        const isQuotedImage = quotedMessage.hasOwnProperty("photo")
        const isQuotedVideo = quotedMessage.hasOwnProperty("video")
        const isQuotedAudio = quotedMessage.hasOwnProperty("audio")
        const isQuotedSticker = quotedMessage.hasOwnProperty("sticker")
        const isQuotedContact = quotedMessage.hasOwnProperty("contact")
        const isQuotedLocation = quotedMessage.hasOwnProperty("location")
        const isQuotedDocument = quotedMessage.hasOwnProperty("document")
        const isQuotedAnimation = quotedMessage.hasOwnProperty("animation")
        const isQuoted = ryn.message.hasOwnProperty("reply_to_message")

        var typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"
        else if (isDocument) typeMessage = "Document"
        else if (isAnimation) typeMessage = "Animation"

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

        var file_id = ""
        if (isQuoted) {
            file_id = isQuotedImage ? ryn.message.reply_to_message.photo[ryn.message.reply_to_message.photo.length - 1].file_id :
                isQuotedVideo ? ryn.message.reply_to_message.video.file_id :
                isQuotedAudio ? ryn.message.reply_to_message.audio.file_id :
                isQuotedDocument ? ryn.message.reply_to_message.document.file_id :
                isQuotedSticker ? ryn.message.reply_to_message.sticker.file_id :
                isQuotedAnimation ? ryn.message.reply_to_message.animation.file_id : ""
        }
        var mediaLink = file_id != "" ? await tele.getLink(file_id) : ""
        
        function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
        }
        
        const guntingBatuKertas = async (suit) => {
        return new Promise((resolve, reject) => {
        setTimeout(async() => {
        let computer;
        if (Math.random() >= 2 / 3) {
        computer = "gunting";
        } else if (Math.random() >= 1 / 3) {
        computer = "batu";
        } else {
        computer = "kertas";
        }
        console.log(`Computer : ${computer}\nAnda: ${suit}\n`);
        suit = suit.toLowerCase();
        if (suit === "gunting" || "batu" || "kertas") {
        if (suit === computer) {
          resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nHasil seri`);
        } else {
          if (suit === "gunting") {
            switch (computer) {
              case "kertas":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda menang!`);
                break;
              case "batu":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda kalah`);
                break;
            }
          }
          if (suit === "batu") {
            switch (computer) {
              case "gunting":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda menang`);
                break;
              case "kertas":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda Kalah`);
                break;
            }
          }
          if (suit === "kertas") {
            switch (computer) {
              case "batu":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda menang`);
                break;
              case "gunting":
                resolve(`Bot memilih: ${computer}\nAnda memilih: ${suit}\n\nAnda kalah`);
                break;
            }
          }
        }
        } else {
        reject(new Error(`Error System!`));
        }
        }, 300);
        });
        };
        })

        bot.command('owner', async(ryn) => {
                 r = `'`
                 teks = 'Hello '+pushname+' Here'+r+'s info about the owner Chitanda Eru Bot'+r+'s ✨'
                 options = {
                     reply_markup: {
                        inline_keyboard: [
                          [
                            { text: 'Telegram 📲', url: 'https://t.me/rtwone' },
                            { text: 'Instagram 📸', url: 'https://instagram.com/yannnnn.zz_' }
                          ],
                          [
                            { text: 'WhatsApp 💌', url: 'https://wa.me/6285791458996' },
                            { text: 'About Me 📌', url: 'https://irfanhariyanto.tk/' }
                          ],
                       ]
                    }
                 }
                 try {
                     await ryn.editMessageText(teks, options)
                 } catch {
                     await ryn.reply(teks, options)
                 }})
          bot.command('ppcouple', async(ryn) => {
                 try {
                 reply('Tunggu sebentar, sedang di proses!')
                 hasil = await fetchJson('https://lindow-api.herokuapp.com/api/ppcouple?apikey=YannzAe')
                 ryn.replyWithPhoto({ url: hasil.result.male })
                 ryn.replyWithPhoto({ url: hasil.result.female })
                 } catch (e) {
                 console.log(e)
                 ryn.reply('Error Please Report To /owner')
                 }})
          bot.command('runtime', async(ryn) => {
                 if (!isOwner) return reply('Owner Bot Only!')
                 timex = process.uptime()
                 var r = '`'
                 teks = `*Bot Aktif Sejak :*\n`+r+`${kyun(timex)}`+r+``
                 reply(teks)
                 })
          bot.command('speed', async(ryn) => {
                 if (!isOwner) return reply('Owner Bot Only!')
                 var n = '`'
                 timestamp = speed();
                 latensi = speed() - timestamp
                 pingnya = `${n}Speed:${n}\n${n}◪ ${latensi.toFixed(4)} Second${n}`
                 reply(pingnya)
                 })
           bot.command('translate', async(ryn) => {
                 if (args.length < 1) return reply('Example : '+prefix + command+' id|what is your name')
                 var tr = body.slice(11)
                 var kode = tr.split("|")[0];
                 var query = tr.split("|")[1];
                 anu = await fetchJson(`http://api.lolhuman.xyz/api/translate/auto/${kode}?apikey=${apikey}&text=${query}`, {method: 'get'})
                 teks = `● *Teks :* ${anu.result.original} (${anu.result.from})\n● *Translated :* ${anu.result.translated} (${anu.result.to})`
                 reply(teks)
                 })
           bot.command('spamcall', async(ryn) => {
                 if (args.length < 1) return reply(`Contoh :\n${prefix}spamcall 62xxxx`)
                 call = `${body.slice(12)}`
                 anu = await fetchJson(`https://lindow-python-api.herokuapp.com/api/spamcall?no=${call}`, {method: 'get'})
                 ryn.reply(anu.logs)
                 })
          bot.command('igstalk', async(ryn) => {
                if (!args.length)  return reply(`Ketik ${prefix}igstalk username`)
                reply('Tunggu sebentar, sedang di proses!')
                try {
                var userr = await getUser(args.join(" ").replace('@',''))
                const { biography, subscribersCount, subscribtions, postsCount, fullName, username, profilePicHD, isPrivate, isVerified, posts } = userr
                const priv_ = isPrivate ? "✅" : "❌"
                const verif_ = isVerified ? "✅" : "❌"
                let isi_post = ``
                for (let i = 0; i < userr.posts.length; i++) {
                    const vid_post_ = userr.posts[i].isVideo ?  "✅" : "❌"
                    isi_post += `
================================

Capt : ${userr.posts[i].caption}
Url : ${userr.posts[i].url}
Timestamp : ${new Date(userr.posts[i].timestamp * 1000)}
Video : ${vid_post_}
                        `
                }
                const swtich_ = isPrivate ? "Mohon maaf akun ini private" : isi_post
                const captuserig = `❏ Nama : ${fullName}
❏ Username : ${username}
❏ Terverifikasi : ${verif_}
❏ Akun Private : ${priv_}
❏ Jumlah Followers : ${subscribersCount}
❏ Jumlah Following : ${subscribtions}
❏ Jumlah Postingan : ${postsCount}
❏ Biodata : ${biography}
❏ Jumlah Post : ${userr.posts.length}`
             await ryn.replyWithPhoto({ url: profilePicHD }, { caption: captuserig, parse_mode: "Markdown"}).catch(e => {
             ryn.replyWithPhoto({ url: profilePicHD })
             ryn.reply(captuserig)
             })
        } catch (e) {
            console.log(e)
           reply(`_Terdapat kesalahan saat stalk ${args[0]}_`)
        }
          })
         bot.command('menu', async(ryn) => {
                await help.help(ryn, user.full_name, ryn.message.from.id.toString())
                })
          bot.command('slot', async(ryn) => {
                const sotoy = [
                    '🍊 : 🍒 : 🍐',
                    '🍒 : 🔔 : 🍊',
                    '🍇 : 🍒 : 🍐',
                    '🍊 : 🍋 : 🔔',
                    '🔔 : 🍒 : 🍐',
                    '🔔 : 🍒 : 🍊',
                    '🍊 : 🍋 : 🔔',        
                    '🍐 : 🍒 : 🍋',
                    '🍐 : 🍐 : 🍐',
                    '🍊 : 🍒 : 🍒',
                    '🔔 : 🔔 : 🍇',
                    '🍌 : 🍒 : 🔔',
                    '🍐 : 🔔 : 🔔',
                    '🍊 : 🍋 : 🍒',
                    '🍋 : 🍋 : 🍌',
                    '🔔 : 🔔 : 🍇',
                    '🔔 : 🍐 : 🍇',
                    '🔔 : 🔔 : 🔔',
                    '🍒 : 🍒 : 🍒',
                    '🍌 : 🍌 : 🍌',
                    '🍇 : 🍇 : 🍇'
                    ]
                const somtoy = sotoy[Math.floor(Math.random() * (sotoy.length))]    
                const somtoyy = sotoy[Math.floor(Math.random() * (sotoy.length))]   
                const somtoyyy = sotoy[Math.floor(Math.random() * (sotoy.length))]  
                if (somtoyy  == '🍌 : 🍌 : 🍌') {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | YOU WIN ]`)
                } else if (somtoyy == '🍒 : 🍒 : 🍒') {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | YOU WIN ]`)
                } else if (somtoyy == '🔔 : 🔔 : 🔔') {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | YOU WIN ]`)
                } else if (somtoyy == '🍐 : 🍐 : 🍐') {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | YOU WIN ]`)
                } else if (somtoyy == '🍇 : 🍇 : 🍇') {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | YOU WIN ]`)
                } else {
                    reply(`[  🎰 | SLOTS ]\n-----------------\n${somtoy}\n${somtoyy}  <=====\n${somtoyyy}\n-----------------\n[  🎰 | LOST ]\n\n`)
                }
                })
    bot.command('tebakgambar', async(ryn) => {
                anu = await fetchJson(`https://lindow-api.herokuapp.com/api/kuis/tebakgambar?apikey=LindowApi`)
                setTimeout( () => {
                reply('*➸ Jawaban :* '+anu.result.jawaban)
                }, 30000) // 1000 = 1s,
                setTimeout( () => {
                reply('_10 Detik lagi…_')
                }, 20000) // 1000 = 1s,
                setTimeout( () => {
                reply('_20 Detik lagi…_')
                }, 10000) // 1000 = 1s,
                setTimeout( () => {
                reply('_30 Detik lagi…_')
                }, 2500) // 1000 = 1s,
                setTimeout( () => {
                ryn.replyWithPhoto({ url: anu.result.images }, {caption: `Jawablah pertanyaan diatas\n\nWaktu : 30 detik`})
                }, 0) // 1000 = 1s,
                })
        bot.command('brainly', async(ryn) => {
                brien = body.slice(9)
                brainly(`${brien}`).then(res => {
                teks = '\n────────────\n'
                for (let Y of res.data) {
                teks += `\n*「 BRAINLY 」*\n\n*➸ Pertanyaan:* ${Y.pertanyaan}\n\n*➸ Jawaban:* ${Y.jawaban[0].text}\n───────────\n`
                }
                reply(teks)
                console.log(res)
                })
                })
        bot.command('memegenerator', async(ryn) => {
                if (!isQuotedImage) return reply(`Reply image With Caption ${prefix + command} Top text|Bottom text`)
                if (!args.length) return reply(`Teksnya? Example: ${prefix + command} Hallo|Gan`)
                reply('Tunggu sebentar, sedang di proses!')
                nn = args.join(' ')
                atas = nn.split("|")[0];
                bawah = nn.split("|")[1];
                ryn.replyWithPhoto({ url: `http://api.lolhuman.xyz/api/memegen?apikey=${apikey}&texttop=${atas}&textbottom=${bawah}&img=${mediaLink}` })
                })
        bot.command('shortlink', async(ryn) => {
                if (!args.length) return reply(`Linknya? Example: ${prefix + command} https://irfanhariyanto.tk/`)
                link = args[0]
                anu = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`)
                reply(anu.data)
                })
        bot.command('simi', async(ryn) => {
                try {
                simi = await fetchJson(`https://lindow-api.herokuapp.com/api/simi?text=${args.join(' ')}&lang=id&apikey=YannzAe`)
                reply(simi.response.text)
                } catch (e) {
                reply(`.......`)
                }
                })
        bot.command('snk', async(ryn) => {
                reply('lagi buat')
                })

                // Islami //
        bot.command('listsurah', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/quran?apikey=${apikey}`)
                result = result.result
                text = 'List Surah:\n'
                for (var x in result) {
                    text += `${x}. ${result[x]}\n`
                }
                await reply(text)
                })
        bot.command('suit', async(ryn) => {
                if (args.length < 1) return await reply(`Example: ${prefix + command} batu`)
                guntingBatuKertas(args.join(" ")).then(a => {
                reply(a)
                })
                })
        bot.command('asupan', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                await ryn.replyWithVideo({ url:`https://lindow-api.herokuapp.com/api/asupan?apikey=LindowApi` })
                })
        bot.command('alquran', async(ryn) => {
                if (args.length < 1) return await reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10 or ${prefix + command} 18/1-10`)
                reply('Tunggu sebentar, sedang di proses!')
                urls = `https://api.lolhuman.xyz/api/quran/${args[0]}?apikey=${apikey}`
                quran = await fetchJson(urls)
                result = quran.result
                ayat = result.ayat
                text = `QS. ${result.surah} : 1-${ayat.length}\n\n`
                for (var x of ayat) {
                    arab = x.arab
                    nomor = x.ayat
                    latin = x.latin
                    indo = x.indonesia
                    text += `${arab}\n${nomor}. ${latin}\n${indo}\n\n`
                }
                await reply(text).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
        bot.command('alquranaudio', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} 18 or ${prefix + command} 18/10`)
                reply('Tunggu sebentar, sedang di proses!')
                surah = args[0]
                await ryn.replyWithAudio({ url: `https://api.lolhuman.xyz/api/quran/audio/${surah}?apikey=${apikey}` }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
        bot.command('asmaulhusna', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/asmaulhusna?apikey=${apikey}`)
                result = result.result
                text = `\`No        :\` *${result.index}*\n`
                text += `\`Latin     :\` *${result.latin}*\n`
                text += `\`Arab      :\` *${result.ar}*\n`
                text += `\`Indonesia :\` *${result.id}*\n`
                text += `\`English   :\` *${result.en}*`
                await reply(text).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
        bot.command('kisahnabi', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Muhammad`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/kisahnabi/${query}?apikey=${apikey}`)
                result = result.result
                text = `\`Name   :\` ${result.name}\n`
                text += `\`Lahir  :\` ${result.thn_kelahiran}\n`
                text += `\`Umur   :\` ${result.age}\n`
                text += `\`Tempat :\` ${result.place}\n`
                text += `\`Story  :\`\n${result.story}`
                await reply(text).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
        bot.command('jadwalsholat', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Yogyakarta`)
                reply('Tunggu sebentar, sedang di proses!')
                daerah = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/sholat/${daerah}?apikey=${apikey}`)
                result = result.result
                text = `\`Wilayah :\` *${result.wilayah}*\n`
                text += `\`Tanggal :\` *${result.tanggal}*\n`
                text += `\`Sahur   :\` *${result.sahur}*\n`
                text += `\`Imsak   :\` *${result.imsak}*\n`
                text += `\`Subuh   :\` *${result.subuh}*\n`
                text += `\`Terbit  :\` *${result.terbit}*\n`
                text += `\`Dhuha   :\` *${result.dhuha}*\n`
                text += `\`Dzuhur  :\` *${result.dzuhur}*\n`
                text += `\`Ashar   :\` *${result.ashar}*\n`
                text += `\`Maghrib :\` *${result.maghrib}*\n`
                text += `\`Isya    :\` *${result.isya}*`
                await reply(text).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })

                // Downloader //
      bot.command('ytplay', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} melukis senja`)
                reply('Tunggu sebentar, sedang di proses!')
                var resto = await yts(body.slice(8)).catch(e => {
                  reply('*[ ! ] Error query yang anda masukan tidak ada*')
                })
                let thumbInfo = `*── 「 PLAY MP3 」 ──*

➸ *Judul :* ${resto.all[0].title}
➸ *ID video :* ${resto.all[0].videoId}
➸ *Diupload pada :* ${resto.all[0].ago}
➸ *Views :* ${resto.all[0].views}
➸ *Durasi :* ${resto.all[0].timestamp}
➸ *Channel :* ${resto.all[0].author.name}
➸ *Link channel :* ${resto.all[0].author.url}

*Tunggu sebentar sedang mengirim audio*
`
await ryn.replyWithPhoto({ url: resto.all[0].image }, { caption: thumbInfo, parse_mode: "Markdown" })
var restoo = await y2mateA(resto.all[0].url).catch(e => {
reply('*[ ! ] Error saat memasuki web y2mate*')
})
await ryn.replyWithAudio({ url: restoo[0].link, filename: restoo[0].output }, { thumb: resto.all[0].image })
                })
      bot.command('ytsearch', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
                reply('Tunggu sebentar, sedang di proses!')
                try {
                var input = body.slice(10)
                var filter1 = await ytsr.getFilters(input)
                var filters1 = filter1.get('Type').get('Video')
                var { items } = await ytsr(filters1.url, { limit: 5 })
                var hitung = 1
                for (let i = 0; i < items.length; i++) {
                    hehe = `*── 「 YTSEARCH 」 ──*\n\n*Judul :* ${items[i].title}\n*ID :* ${items[i].id}\n*Ditonton :* ${items[i].views}\n*Durasi :* ${items[i].duration}\n*Link :* ${items[i].url}`
                await ryn.replyWithPhoto({ url: items[i].bestThumbnail.url }, { caption: hehe, parse_mode: "Markdown" })
                }
            } catch(e) {
                reply('Didn\'t find anything or there is any error!')
                reply(`Error: ${e.message}`)
            }
            })
       bot.command('ytmp3', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
            var querynya = body.slice(7)
            reply('Tunggu sebentar, sedang di proses!')
            var ress = await y2mateA(querynya).catch(e => {
            console.log(e)
            reply('Error gagal dalam memasuki web y2mate')
            })
            var resultnya = `*── 「 YTMP3 」 ──*

➸ *Judul :* ${ress[0].judul}
➸ *Ukuran :* ${ress[0].size}
➸ *Kualitas :* ${ress[0].quality}kbps
➸ *Nama File :* ${ress[0].output}
➸ *Output :* ${ress[0].tipe}

*Tunggu sebentar sedang mengirim audio*
`
                await ryn.replyWithPhoto({ url: ress[0].thumb }, { caption: resultnya, parse_mode: "Markdown" })
                await ryn.replyWithAudio({ url: ress[0].link, filename: ress[0].output }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('ytmp4', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
                var querynya = body.slice(7)
                reply('Tunggu sebentar, sedang di proses!')
            var ress = await y2mateV(querynya).catch(e => {
            console.log(e)
            reply('Error gagal dalam memasuki web y2mate')
            })
            var resultnya = `*── 「 YTMP4 」 ──*

➸ *Judul :* ${ress[0].judul}
➸ *Ukuran :* ${ress[0].size}
➸ *Kualitas :* ${ress[0].quality}
➸ *Nama File :* ${ress[0].output}
➸ *Output :* ${ress[0].tipe}

*Tunggu sebentar sedang mengirim video*
`
                await ryn.replyWithPhoto({ url: ress[0].thumb }, { caption: resultnya, parse_mode: "Markdown" })
                await ryn.replyWithVideo({ url: ress[0].link}).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('tiktoknowm', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
                reply('Tunggu sebentar, sedang di proses!')
                url = args[0]
                ra_api.TiktokDownloader(url).then(async r => {
                await ryn.replyWithVideo({ url: r.result.nowm }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })})
                })
       bot.command('instagram', async(ryn) => {
                 if (args.length < 1) return reply('Urlnya mana?')
                 reply('Tunggu sebentar, sedang di proses!')
                 url = args[0]
                 ini_url2 = await fetchJson(`https://lindow-api.herokuapp.com/api/igdl?link=${url}&apikey=YannzAe`)
                 ini_url = ini_url2.result.url
                 ini_caption = ini_url2.result.caption
                 if (ini_url.includes(".jpg")) {
                 ini_type = ryn.replyWithPhoto({ url: ini_url }, { caption: ini_caption })
                 } else if (ini_url.includes(".mp4")) {
                 ini_type = ryn.replyWithVideo({ url: ini_url }, { caption: ini_caption })
                 }
                 return ini_type
                 })
       bot.command('twittervideo', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://twitter.com/gofoodindonesia/status/1229369819511709697`)
                reply('Tunggu sebentar, sedang di proses!')
                urll = args[0]
                url = `https://api.lolhuman.xyz/api/twitter?apikey=${apikey}&url=${urll}`
                result = await fetchJson(url)
                await ryn.replyWithVideo({ url: result.result[2].link }, { caption: result.result.title }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('spotify', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA`)
                reply('Tunggu sebentar, sedang di proses!')
                var resut = await axios.get(`https://fazone-api.herokuapp.com/api/spotifydl?url=${args[0]}&apikey=bebas1minggu`)
                caption = `*── 「 SPOTIFY 」 ──*\n\n➸ *Judul :* ${resut.data.title}\n➸ *Artis :* ${resut.data.artists}\n➸ *ID :* ${resut.data.id}\n➸ *Original url :* ${resut.data.original_url}\n➸ *Popularity :* ${resut.data.popularity}\n➸ *Preview :* ${resut.data.preview_url}`
                await ryn.replyWithPhoto({ url: resut.data.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                await ryn.replyWithAudio({ url: resut.data.result }, { title: resut.data.title, thumb: resut.data.thumbnail }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('spotifyplay', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
                reply('Tunggu sebentar, sedang di proses!')
                var resut = await axios.get(`https://fazone-api.herokuapp.com/api/spotifyplay?judul=${body.slice(13)}&apikey=LindowApi`)
                caption = `*── 「 SPOTIFY 」 ──*\n\n➸ *Judul :* ${resut.data.title}\n➸ *Artis :* ${resut.data.artists}\n➸ *ID :* ${resut.data.id}\n➸ *Original url :* ${resut.data.original_url}\n➸ *Popularity :* ${resut.data.popularity}\n➸ *Preview :* ${resut.data.preview_url}`
                await ryn.replyWithPhoto({ url: resut.data.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                await ryn.replyWithAudio({ url: resut.data.result }, { title: resut.data.title, thumb: resut.data.thumbnail }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('randomaesthetic', async(ryn) => {
               reply('Tunggu sebentar, sedang di proses!')
               await ryn.replyWithVideo({ url: 'https://lindow-api.herokuapp.com/api/randomaesthetic?apikey=LindowApi' })
               })
       bot.command('jooxplay', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Melukis Senja`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/jooxplay?apikey=${apikey}&query=${query}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.info.song}*\n`
                caption += `\`❖ Artists  :\` *${result.info.singer}*\n`
                caption += `\`❖ Duration :\` *${result.info.duration}*\n`
                caption += `\`❖ Album    :\` *${result.info.album}*\n`
                caption += `\`❖ Uploaded :\` *${result.info.date}*\n`
                caption += `\`❖ Lirik    :\`\n`
                if ((caption + result.lirik).length >= 1024) {
                    await ryn.replyWithPhoto({ url: result.image }, { caption: caption, parse_mode: "Markdown" })
                    await ryn.replyWithMarkdown(result.lirik)
                } else {
                    await ryn.replyWithPhoto({ url: result.image }, { caption: caption + result.lirik, parse_mode: "Markdown" })
                }
                await ryn.replyWithAudio({ url: result.audio[0].link, filename: result.info.song }, { thumb: result.image })
                })
       bot.command('pinterest', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} loli kawaii`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                var r = await ra_api.pinterest(query)
                urll = pickRandom(r.result)
                await ryn.replyWithPhoto({ url: urll }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('pinvideo', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://id.pinterest.com/pin/696580267364426905/`)
                reply('Tunggu sebentar, sedang di proses!')
                var url = await axios.get(`https://fazone-api.herokuapp.com/api/pindl?url=${args[0]}&apikey=LindowApi`)
                await ryn.replyWithVideo({ url: url.data.result1 }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('pinimage', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://id.pinterest.com/pin/696580267364426905/`)
                reply('Tunggu sebentar, sedang di proses!')
                var url = await axios.get(`https://fazone-api.herokuapp.com/api/pindl?url=${args[0]}&apikey=LindowApi`)
                await ryn.replyWithPhoto({ url: url.data.result2 }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
       bot.command('pixiv', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} loli kawaii`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                await ryn.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/pixiv?apikey=${apikey}&query=${query}` }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
      bot.command('pixivdl', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} 63456028`)
                reply('Tunggu sebentar, sedang di proses!')
                pixivid = args[0]
                await ryn.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/pixivdl/${pixivid}?apikey=${apikey}` }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })

                // Searching
        bot.command('reverse', async(ryn) => {
                if (!isQuotedImage) return await reply(`Please reply a image use this command.`)
                reply('Tunggu sebentar, sedang di proses!')
                google = await fetchJson(`https://api.lolhuman.xyz/api/googlereverse?apikey=${apikey}&img=${mediaLink}`)
                yandex = await fetchJson(`https://api.lolhuman.xyz/api/reverseyandex?apikey=${apikey}&img=${mediaLink}`)
                options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Google', url: google.result },
                                { text: 'Yandex', url: yandex.result }
                            ]
                        ]
                    }
                }
                await ryn.reply(`Found result`, options)
                })

                // AniManga //
        bot.command('character', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Miku Nakano`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/character?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Name : ${result.name.full}\n`
                text += `Native : ${result.name.native}\n`
                text += `Favorites : ${result.favourites}\n`
                text += `Media : \n`
                ini_media = result.media.nodes
                for (var x of ini_media) {
                    text += `- ${x.title.romaji} (${x.title.native})\n`
                }
                text += `\nDescription : \n${result.description.replace(/__/g, "_")}`
                await ryn.replyWithPhoto({ url: result.image.large }, { caption: text }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
         bot.command('manga', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/manga?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Id MAL : ${result.idMal}\n`
                text += `Title : ${result.title.romaji}\n`
                text += `English : ${result.title.english}\n`
                text += `Native : ${result.title.native}\n`
                text += `Format : ${result.format}\n`
                text += `Chapters : ${result.chapters}\n`
                text += `Volume : ${result.volumes}\n`
                text += `Status : ${result.status}\n`
                text += `Source : ${result.source}\n`
                text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
                text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
                text += `Genre : ${result.genres.join(", ")}\n`
                text += `Synonyms : ${result.synonyms.join(", ")}\n`
                text += `Score : ${result.averageScore}%\n`
                text += `Characters : \n`
                ini_character = result.characters.nodes
                for (var x of ini_character) {
                    text += `- ${x.name.full} (${x.name.native})\n`
                }
                text += `\nDescription : ${result.description}`
                await ryn.replyWithPhoto({ url: result.coverImage.large }, { caption: text }).catch(e => {
                console.log(e)
                reply(`Error, please report owner`)
                })
                })
        bot.command('anime', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/anime?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Id : ${result.id}\n`
                text += `Id MAL : ${result.idMal}\n`
                text += `Title : ${result.title.romaji}\n`
                text += `English : ${result.title.english}\n`
                text += `Native : ${result.title.native}\n`
                text += `Format : ${result.format}\n`
                text += `Episodes : ${result.episodes}\n`
                text += `Duration : ${result.duration} mins.\n`
                text += `Status : ${result.status}\n`
                text += `Season : ${result.season}\n`
                text += `Season Year : ${result.seasonYear}\n`
                text += `Source : ${result.source}\n`
                text += `Start Date : ${result.startDate.day} - ${result.startDate.month} - ${result.startDate.year}\n`
                text += `End Date : ${result.endDate.day} - ${result.endDate.month} - ${result.endDate.year}\n`
                text += `Genre : ${result.genres.join(", ")}\n`
                text += `Synonyms : ${result.synonyms.join(", ")}\n`
                text += `Score : ${result.averageScore}%\n`
                text += `Characters : \n`
                ini_character = result.characters.nodes
                for (var x of ini_character) {
                    text += `- ${x.name.full} (${x.name.native})\n`
                }
                text += `\nDescription : ${result.description}`
                await ryn.replyWithPhoto({ url: result.coverImage.large }, { caption: text })
                })
        bot.command('stickertoimg', async(ryn) => {
                 if (!isQuotedSticker) return ryn.reply('reply stickernya!')
                 reply('Tunggu sebentar, sedang di proses!')
                 if (isQuotedSticker) {
                 url_file = await tele.getLink(file_id)
                 ryn.replyWithPhoto({ url: url_file })
                 }
                 })
        bot.command('tourl', async(ryn) => {
                 if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedDocument || isQuotedSticker || isQuotedAnimation) {
                 reply('Tunggu sebentar, sedang di proses!')
                 anu = await axios.get(`https://tinyurl.com/api-create.php?url=${mediaLink}`)
                 reply(anu.data)
                 }
                 })
         bot.command('tomp3', async(ryn) => {
                 if (!isQuotedVideo) return ryn.reply('reply vidionya!')
                 reply('Tunggu sebentar, sedang di proses!')
                 if (isQuotedVideo) {
                 urll = mediaLink
                 ryn.replyWithAudio({ url: urll, filename: sender+'.mp3' }).catch(e => {                                console.log(e)
                 reply(`Error, please report owner`)
                 })
                 }
                 })
          bot.command('wait', async(ryn) => {
                if (isQuotedImage || isQuotedAnimation || isQuotedVideo || isQuotedDocument) {
                    reply('Tunggu sebentar, sedang di proses!')
                    url_file = await tele.getLink(file_id)
                    result = await fetchJson(`https://api.lolhuman.xyz/api/wait?apikey=${apikey}&img=${url_file}`)
                    result = result.result
                    text = `Anilist id : ${result.anilist_id}\n`
                    text += `MAL id : ${result.mal_id}\n`
                    text += `Title Romaji : ${result.title_romaji}\n`
                    text += `Title Native : ${result.title_native}\n`
                    text += `Title English : ${result.title_english}\n`
                    text += `At : ${result.at}\n`
                    text += `Episode : ${result.episode}\n`
                    text += `Similarity : ${result.similarity}`
                    await ryn.replyWithVideo({ url: result.video }, { caption: text })
                } else {
                    reply(`Tag gambar yang sudah dikirim`)
                }
                })
        bot.command('kusonime', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://kusonime.com/nanatsu-no-taizai-bd-batch-subtitle-indonesia/`)
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/kusonime?apikey=${apikey}&url=${args[0]}`)
                result = result.result
                text = `*Title :* ${result.title}\n`
                text += `*Japanese :* ${result.japanese}\n`
                text += `*Genre :* ${result.genre}\n`
                text += `*Seasons :* ${result.seasons}\n`
                text += `*Producers :* ${result.producers}\n`
                text += `*Type :* ${result.type}\n`
                text += `*Status :* ${result.status}\n`
                text += `*Total Episode :* ${result.total_episode}\n`
                text += `*Score :* ${result.score}\n`
                text += `*Duration :* ${result.duration}\n`
                text += `*Released On :* ${result.released_on}*\n`
                link_dl = result.link_dl
                for (var x in link_dl) {
                    text += `\n\n*${x}*\n`
                    for (var y in link_dl[x]) {
                        text += `[${y}](${link_dl[x][y]}) | `
                    }
                }
                if (text.length <= 1024) {
                    return await ryn.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                }
                await ryn.replyWithPhoto({ url: result.thumbnail })
                await reply(text)
                })
        bot.command('kusonimesearch', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/kusonimesearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `*Title : ${result.title}\n`
                text += `**Japanese : ${result.japanese}\n`
                text += `**Genre : ${result.genre}\n`
                text += `**Seasons : ${result.seasons}\n`
                text += `**Producers : ${result.producers}\n`
                text += `**Type : ${result.type}\n`
                text += `**Status : ${result.status}\n`
                text += `**Total Episode : ${result.total_episode}\n`
                text += `**Score : ${result.score}\n`
                text += `**Duration : ${result.duration}\n`
                text += `**Released On : ${result.released_on}*\n`
                link_dl = result.link_dl
                for (var x in link_dl) {
                    text += `\n\n*${x}*\n`
                    for (var y in link_dl[x]) {
                        text += `[${y}](${link_dl[x][y]}) | `
                    }
                }
                if (text.length <= 1024) {
                    return await ryn.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                }
                await ryn.replyWithPhoto({ url: result.thumbnail })
                await reply(text)
                })
        bot.command('otakudesu', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://otakudesu.tv/lengkap/pslcns-sub-indo/`)
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/otakudesu?apikey=${apikey}&url=${args[0]}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Judul : ${result.judul}\n`
                text += `Type : ${result.type}\n`
                text += `Episode : ${result.episodes}\n`
                text += `Aired : ${result.aired}\n`
                text += `Producers : ${result.producers}\n`
                text += `Genre : ${result.genres}\n`
                text += `Duration : ${result.duration}\n`
                text += `Studios : ${result.status}\n`
                text += `Rating : ${result.rating}\n`
                text += `Credit : ${result.credit}\n\n`
                get_link = result.link_dl
                for (var x in get_link) {
                    text += `*${get_link[x].title}*\n`
                    for (var y in get_link[x].link_dl) {
                        ini_info = get_link[x].link_dl[y]
                        text += `\`Reso : \`${ini_info.reso}\n`
                        text += `\`Size : \`${ini_info.size}\n`
                        text += `\`Link : \``
                        down_link = ini_info.link_dl
                        for (var z in down_link) {
                            text += `[${z}](${down_link[z]}) | `
                        }
                        text += "\n\n"
                    }
                }
                await reply(text)
                })
        bot.command('otakudesusearch', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Gotoubun No Hanayome`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/otakudesusearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Japanese : ${result.japanese}\n`
                text += `Judul : ${result.judul}\n`
                text += `Type : ${result.type}\n`
                text += `Episode : ${result.episodes}\n`
                text += `Aired : ${result.aired}\n`
                text += `Producers : ${result.producers}\n`
                text += `Genre : ${result.genres}\n`
                text += `Duration : ${result.duration}\n`
                text += `Studios : ${result.status}\n`
                text += `Rating : ${result.rating}\n`
                text += `Credit : ${result.credit}\n`
                get_link = result.link_dl
                for (var x in get_link) {
                    text += `\n\n*${get_link[x].title}*\n`
                    for (var y in get_link[x].link_dl) {
                        ini_info = get_link[x].link_dl[y]
                        text += `\n\`\`\`Reso : \`\`\`${ini_info.reso}\n`
                        text += `\`\`\`Size : \`\`\`${ini_info.size}\n`
                        text += `\`\`\`Link : \`\`\`\n`
                        down_link = ini_info.link_dl
                        for (var z in down_link) {
                            text += `[${z}](${down_link[z]}) | `
                        }
                    }
                }
                await reply(text)
                })

                // Movie & Story
       bot.command('lk21', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Transformer`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/lk21?apikey=${apikey}&query=${query}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Link : ${result.link}\n`
                text += `Genre : ${result.genre}\n`
                text += `Views : ${result.views}\n`
                text += `Duration : ${result.duration}\n`
                text += `Tahun : ${result.tahun}\n`
                text += `Rating : ${result.rating}\n`
                text += `Desc : ${result.desc}\n`
                text += `Actors : ${result.actors.join(", ")}\n`
                text += `Location : ${result.location}\n`
                text += `Date Release : ${result.date_release}\n`
                text += `Language : ${result.language}\n`
                text += `Link Download : ${result.link_dl}`
                await ryn.replyWithPhoto({ url: result.thumbnail }, { caption: text })
                })
        bot.command('drakorongoing', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/drakorongoing?apikey=${apikey}`)
                result = result.result
                text = "Ongoing Drakor\n\n"
                for (var x of result) {
                    text += `Title : ${x.title}\n`
                    text += `Link : ${x.link}\n`
                    text += `Thumbnail : ${x.thumbnail}\n`
                    text += `Year : ${x.category}\n`
                    text += `Total Episode : ${x.total_episode}\n`
                    text += `Genre : ${x.genre.join(", ")}\n\n`
                }
                await reply(text)
                })
        bot.command('wattpad', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} https://www.wattpad.com/707367860-kumpulan-quote-tere-liye-tere-liye-quote-quote`)
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/wattpad?apikey=${apikey}&url=${args[0]}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Rating : ${result.rating}\n`
                text += `Motify date : ${result.modifyDate}\n`
                text += `Create date: ${result.createDate}\n`
                text += `Word : ${result.word}\n`
                text += `Comment : ${result.comment}\n`
                text += `Vote : ${result.vote}\n`
                text += `Reader : ${result.reader}\n`
                text += `Pages : ${result.pages}\n`
                text += `Description : ${result.desc}\n\n`
                text += `Story : \n${result.story}`
                await ryn.replyWithPhoto({ url: result.photo }, { caption: text })
                })
        bot.command('wattpadsearch', async(ryn) => {
                if (args.length == 0) return await reply(`Example: ${prefix + command} Tere Liye`)
                reply('Tunggu sebentar, sedang di proses!')
                query = args.join(" ")
                result = await fetchJson(`https://api.lolhuman.xyz/api/wattpadsearch?apikey=${apikey}&query=${query}`)
                result = result.result
                text = "Wattpad Seach : \n"
                for (var x of result) {
                    text += `Title : ${x.title}\n`
                    text += `Url : ${x.url}\n`
                    text += `Part : ${x.parts}\n`
                    text += `Motify date : ${x.modifyDate}\n`
                    text += `Create date: ${x.createDate}\n`
                    text += `Coment count: ${x.commentCount}\n\n`
                }
                await reply(text)
                })
        bot.command('cerpen', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/cerpen?apikey=${apikey}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Creator : ${result.creator}\n`
                text += `Story :\n${result.cerpen}`
                await reply(text)
                })
        bot.command('ceritahoror', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/ceritahoror?apikey=${apikey}`)
                result = result.result
                text = `Title : ${result.title}\n`
                text += `Desc : ${result.desc}\n`
                text += `Story :\n${result.story}\n`
                await ryn.replyWithPhoto({ url: result.thumbnail })
                ryn.reply(text)
                })

                // Random Text //
      bot.command('quotes', async(ryn) => {
              reply('Tunggu sebentar, sedang di proses!')
              urls = 'https://lindow-api.herokuapp.com/api/randomquote?apikey=LindowApi'
              quote = await fetchJson(urls)
              quotes = quote.result.quotes
              author = quote.result.author
              teks = `${quotes}\n\n_by ${author}_`
              await reply(teks).catch(e => {
              console.log(e)
              reply('Error, please report owner')
              })
              })
      bot.command('quotesanime', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                quotes = await fetchJson(`https://api.lolhuman.xyz/api/random/quotesnime?apikey=${apikey}`)
                quotes = quotes.result
                await reply(`_${quotes.quote}_\n\n*― ${quotes.character}*\n*― ${quotes.anime} ${quotes.episode}*`)
                })
      bot.command('quotesdilan', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                quotedilan = await fetchJson(`https://api.lolhuman.xyz/api/quotes/dilan?apikey=${apikey}`)
                await reply(quotedilan.result)
                })
       bot.command('quotesimage', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                await ryn.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/random/${command}?apikey=${apikey}` })
                })
       bot.command('faktaunik', async(ryn) => {
            reply('Tunggu sebentar, sedang di proses!')
            result = await fetchJson(`https://api.lolhuman.xyz/api/random/faktaunik?apikey=${apikey}`)
            await reply(result.result)
            })
       bot.command('katabijak', async(ryn) => {
           reply('Tunggu sebentar, sedang di proses!')
            result = await fetchJson(`https://api.lolhuman.xyz/api/random/katabijak?apikey=${apikey}`)
            await reply(result.result)
            })
       bot.command('pantun', async(ryn) => {
            reply('Tunggu sebentar, sedang di proses!')
            result = await fetchJson(`https://api.lolhuman.xyz/api/random/pantun?apikey=${apikey}`)
            await reply(result.result)
            })
       bot.command('bucin', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/random/bucin?apikey=${apikey}`)
                await reply(result.result)
                })
        bot.command('randomnama', async(ryn) => {
                reply('Tunggu sebentar, sedang di proses!')
                result = await fetchJson(`https://api.lolhuman.xyz/api/random/nama?apikey=${apikey}`)
                await reply(result.result)
                })

        bot.command('test', async(ryn) => {
                test = await bot.telegram.getChatMembersCount(ryn.message.chat.id)
                console.log(test)
                })
        bot.command('leave', async(ryn) => {
            if (!isOwner) return reply('Owner Bot Only!')
            if (!isGroup) return reply('Group Only!')
            ryn.reply('Byee...')
            await sleep(2000)
            ryn.leaveChat(ryn.message.chat.title)
            })
bot.on("message", async(ryn) => {
    try {
if (body.startsWith('$')){
if (!isOwner) return reply('Owner Bot Only!')
var konsol = body.slice(2)
exec(konsol, async (err, stdout) => {
if(err) return reply(`${err}`)
if (stdout) {
await ryn.reply(`${stdout}`)
}
})
}
if (body.startsWith('>')){
if (!isOwner) return reply('Owner Bot Only!')
var konsol = body.slice(2)
ev = async(sul) => {
var sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined){
bang = util.format(sul)
}
return await ryn.reply(bang)
}
try {
reply(util.format(eval(`;(async () => { ${konsol} })()`).catch(e => {
err = String(e)
js = JSON.stringify(e, null, 2)
if (js == '{}') js = err
th = '```'
js = `${th}${js}${th}`
reply(`_${err}_\n\n` + js) 
})))
} catch(e) {
err = String(e)
js = JSON.stringify(e, null, 2)
if (js == '{}') js = { err }
th = '```'
js = JSON.stringify(js, null, 2)
js = `${th}${js}${th}`
await ryn.reply(`_${err}_\n\n` + js) 
}
}
   switch (command) {
   case 'tes':
        console.log('oke')
        break
   default:
   }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
    }
})


bot.launch()
bot.telegram.getMe().then((getme) => {
    itsPrefix = (prefix != "") ? prefix : "No Prefix"
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.greenBright(" │ + Owner    : " + owner || ""))
    console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""))
    console.log(chalk.greenBright(" │ + Version  : " + version || ""))
    console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""))
    console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""))
    console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
