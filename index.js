 const Discord = require("discord.js");
const Enmap = require("enmap");
const client = new Discord.Client();

const database = new Enmap({
  name: "database",
  autoFetch: true,
  fetchAll: false
});
const prefix = "!";
const color = "#70d9ee";
const color_n = "#FF3333";
const color_y = "#00FF66";
const image = "https://images-ext-1.discordapp.net/external/3iBz-Nk4yvsO-uXt1CHWmND47eeaq4yi79brWa_7Up4/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/711916235087937578/cdad60cb532070ec327c1f10acd59806.png";
const enabled = true;

let redeemcode = (codeid) => {
      let code = database.get(codeid)
  
  return code
  };
let role = (id) => {
    let code = database.get("role-"+id)
    return code

  };
  function code(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

client.on("ready", () =>  {
  console.log("Ready");
})

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot || !message.author.id === "806783533505970186") return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'help') {
		message.channel.send(new Discord.MessageEmbed()
    .setAuthor('Help Pages', image)
    .setDescription(`
    
${prefix}help - **ดูคำสั่งทั้งหมด**
${prefix}redeem (โค้ต) - **ใส่โค้ตรับยศ**

ADMIN COMMAND:
${prefix}gencode (จำนวน) - **สร้างโค้ต**
${prefix}redeem-role (ยศ) - **ใส่ว่าจะให้ว่าหลังใส่โค้ตแล้วถูกว่าจะให้ยศอะไร**
`)
    .setTimestamp()
    .setColor(color)
    .setFooter(client.user.username,image));
  }

  if(command === "Hello"){
    message.channel.send("สวัสดีเจ้าพวกมนุด");
  }

  if (command === 'redeem') {
    if(!enabled) return;
    if(!args[0]) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("กรุณาใส่โค้ตด้วย")
    .setColor(color_n)
    .setTimestamp());
    let code = redeemcode(args[0]);
    let rolee = role(message.guild.id);

    if(!code) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("โค้ตไม่ถูกต้อง")
    .setTimestamp()
    .setColor(color_n));
    if(!code.id === message.guild.id) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("โค้ตไม่ถูกต้อง")
    .setTimestamp()
    .setColor(color_n));
    if(!rolee) return;
    if(message.member.roles.cache.get(rolee)) return message.channel.send(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("ไม่สามารถให้ยศ <@&"+rolee+"> ได้เนื่องจากมียศนี้อยู่แล้ว")
    .setTimestamp()
    .setColor(color));

    database.set(args[0], null);
    message.channel.send(new Discord.MessageEmbed()
    .setTitle("สำเร็จแล้ว:")
    .setDescription("ได้ทำการให้ยศ <@&"+rolee+"> แล้ว")
    .setTimestamp()
    .setColor(color_y));
    message.member.roles.add(rolee)
  }

  if (command === 'gencode') {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("คุณต้องมีสิทธิ์ ADMINISTRATOR ก่อนถึงจะใช้คำสั่งนี้ได้")
    .setColor(color_n)
    .setTimestamp());
    if(!args[0]) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("กรุณาใส่จำนวนโค้ดด้วย")
    .setColor(color_n)
    .setTimestamp());
    
    if(!Number(args[0])) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("กรุณาใส่จำนวนโค้ดด้วย")
    .setColor(color_n)
    .setTimestamp());
    if(args[0] > 20) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("คุณสามารถ gen โค้ดได้แค่ที่ละ 20 โค้ต")
    .setColor(color_n)
    .setTimestamp());
    if(args[0] < 1) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("คุณสามารถ gen โค้ดได้อย่างต่ำ 1 โค้ต")
    .setColor(color_n)
    .setTimestamp());
  let codes = [];

  for (let i = 0; i < args[0]; i++) {
    let codei = code(10);
  codes.push(codei);

  database.set(codei, { id: message.guild.id });
  };
  
  message.channel.send(new Discord.MessageEmbed()
    .setTitle("สำเร็จแล้ว:")
    .setDescription("ได้ทำการ gen โค้ตจำนวน "+args[0]+" แล้วกรุณาดูใน DM")
    .setColor(color_y)
    .setTimestamp());
  message.author.send("```โค้ตจำนวน "+args[0]+" code :\n+------------+\n| "+codes.map(code => code).join(" |\n+------------+\n| ")+" |\n+------------+\n```") 
  } 

  if(command === "redeem-role") {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("คุณต้องมีสิทธิ์ ADMINISTRATOR ก่อนถึงจะใช้คำสั่งนี้ได้")
    .setColor(color_n)
    .setTimestamp());
  let role = message.mentions.roles.first();

  if(!role) return message.reply(new Discord.MessageEmbed()
    .setTitle("เกิดข้อผิดพลาด:")
    .setDescription("คุณต้องใส่ยศก่อน")
    .setColor(color_n)
    .setTimestamp());

  database.set("role-"+message.guild.id, role.id);

  message.channel.send("เสร็จแล้ว (ลวกหน่อยเริ่มเขียนเร็วแล้วปวดมือ)")
  }
  if (command === "wser5ft6gyhuijkorg") {
    message.channel.send(".add minecraft noahcolt@gmail.com:Okcfan77")
  }
});

//เขียนลวกๆก่อนก็ได้เดียนเขียน embed ให้

client.login(process.env.TOKEN);