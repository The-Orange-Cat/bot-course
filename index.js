const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "6361102430:AAHG1v0uLo3Em6gc9cFwn7Bew5DMKVoDW6E"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start',  description: 'Начальное приветсвие'},
        {command: '/info',  description: 'Информация о пользователе'},
        {command: '/game',  description: 'Игра угадай цифру'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/ea6/cea/ea6cea5f-1f18-3e16-8f54-26eb0e2cf939/13.webp`)
            return bot.sendMessage(chatId, `Добро пожаловать!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
        //await bot.sendMessage(chatId, `Ты мне написал ${text}`)
    }) 
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал. Бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}
start ()