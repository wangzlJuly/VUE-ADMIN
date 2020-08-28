const express=require('express')
const app=new express()
const mongoose = require('mongoose')
const Cors = require('cors')

const City = require('./model/city')
const Movie = require('./model/movie')
var multer  = require('multer')
const User = require('./model/uesr')
app.use(Cors())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+file.originalname)
  }
})
 
var upload = multer({ storage: storage })
// var bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({ extended: false }))
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 登录
app.post('/user/login',function(req,res){
	// req.session.token='加密算法生成随机token'
	// const data={"code":20000,"data":{"roles":["editor"],"token":req.session.token,"introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}}
	const data={"code":20000,"data":{"token":"asasasasas","introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}}
	res.json(data)
})
// 拉去用户信息
app.get('/user/info',function(req,res){
	const data={"code":20000,"data":{"roles":["admin"],"introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}}
	res.json(data)
})

// const { roles, name, avatar, introduction } = data
// 退出登录
app.post('/user/logout',function(req,res){
	res.json({"code":20000,"message":"success"})
})

// 添加城市
app.post('/city/create', (req, res)=>{
	console.log(req.body)
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		console.log('数据库连接成功')
		const city = new City({
			name: req.body.name,
			index: req.body.index
		})
		city.save().then(result => {
			console.log(result)
			if(result){
				res.json({
					code: 20000,
					msg: '城市添加成功'
				})
			}
		})

	})
})
// 获取城市列表
app.get('/citys', (req, res)=>{
	const start = Number(req.query.start ? req.query.start : 0 )
	const end = Number(req.query.end ? req.query.end : 0)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		console.log('数据库连接成功')
		// City.find().then(result=>{
		const num = await City.find()
		const result = await City.find().skip(start).limit(end)
			res.json({
				code: 20000,
				msg: '获取城市数据成功',
				list: result,
				total: num.length
			})
		
	})
})
// 获取城市
app.get('/city/:id', (req, res)=>{
	const id = req.params.id
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		City.findById(id).then(result=>{
			res.json({
				code: 20000,
				msg: '获取单个城市成功',
				city: result
			})
		})
	})
})
// 修改城市
app.post('/city/edit',(req,res)=>{
	const id = req.body.id
	const name = req.body.name
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		City.findByIdAndUpdate(id,{name: name}).then(result => {
			console.log(result)
			res.json({
				code: 20000,
				msg: '城市修改成功'
			})
		})
	})
})

// 删除城市
app.post('/city/delete/:id',(req,res)=>{
	const id = req.params.id
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		City.findByIdAndDelete(id).then(result => {
			console.log(result)
			res.json({
				code: 20000,
				msg: '删除城市成功'
			})
		})
	})
})


// 图片上传
app.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.json({
		code: 20000,
		msg:'图片上传成功',
		path:req.file.path
	})
})


// 获取城市列表
app.get('/getcitys',(req, res)=>{
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		City.find().sort({_id: -1}).then(result => {
			res.json({
				code: 20000,
				msg: '获取城市成功',
				list: result
			})
		})
	})
})
// 添加电影
app.post('/movie/create',(req, res)=>{
	console.log(req.body)
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon=>{
		const movie = new Movie(req.body)
		movie.save().then(result=>{
			res.json({
				code: 20000,
				msg:'电影添加成功'
			})
		})
	})
})


// 修改电影
app.post('/movie/edit',(req, res)=>{
	console.log(req.body)
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon=>{
		Movie.findByIdAndUpdate(req.body.id,req.body).then(result=>{
			res.json({
				code: 20000,
				msg:'电影修改成功'
			})
		})
	})
})
// 根据id获取电影
app.get('/movie/:id', (req, res)=>{
	const id = req.params.id
	console.log(111111,id)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		Movie.findById(id).then(result=>{
			console.log(result)
			if(result){
				res.json({
					code: 20000,
					msg: '获取电影数据成功',
					movie: result
				})
			}
		})
	})
})


// 获取电影列表
app.get('/movies', (req, res)=>{
	const start = Number(req.query.start ? req.query.start : 0 )
	const end = Number(req.query.end ? req.query.end : 0)
	console.log(111111111111111,start)
	console.log(end)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		console.log('数据库连接成功')
		const num = await Movie.find()
		const result = await Movie.find({}).skip(start).limit(end).populate('p')
    console.log(result)
    if(result){
			res.json({
				code: 20000,
				msg: '获取电影数据成功',
				list: result,
				total: num.length
			})
		}
	})
})
// 删除电影信息
app.post('/movie/delete/:id',(req, res)=>{
	const id = req.params.id
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		Movie.findByIdAndDelete(id).then(result=>{
			if(result){
				res.json({
					code: 20000,
					msg: '删除电影成功'
				})
			}
		})
    
	})
})


// 获取电影列表
app.get('/mmovies', (req, res)=>{
	const start = Number(req.query.start ? req.query.start : 0 )
	const end = Number(req.query.end ? req.query.end : 5)
	console.log(111111111111111,start)
	console.log(end)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		console.log('数据库连接成功')
		const num = await Movie.find()
		const result = await Movie.find({}).skip(start).limit(end).populate('p')
    console.log(result)
    if(result){
			res.json({
				code: 20000,
				msg: '获取电影数据成功',
				list: result,
				total: num.length
			})
		}
	})
})



// 移动端登录接口
app.post('/login',(req,res)=>{
	res.json({
		code: 200,
		msg: '登陆成功',
		token: 'asdasdqweq113213asasa'
	})
})



// 测试轮播图
app.get('/lunbo', (req, res) => {
	const list=[
		{
			imgurl:'http://localhost:8123/uploads/1.jpg'
		},
		{
			imgurl:'http://localhost:8123/uploads/2.jpg'
		},
		{
			imgurl:'http://localhost:8123/uploads/3.jpg'
		}
	]
	res.json({
		code: 200,
		msg: 'success',
		list: list
	})
})

// 添加用户
app.post('/user/create', (req,res) => {
	console.log (req.body)
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon => {
		const user = new User(req.body)
		user.save().then(resule => {
			res.json({
				code:20000,
				msg:'用户添加成功'
			})
		})
	})
})
// 获取用户列表
app.get('/users', (req, res)=>{
	const start = Number(req.query.start ? req.query.start : 0 )
	const end = Number(req.query.end ? req.query.end : 0)
	console.log(111111111111111,start)
	console.log(end)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		console.log('数据库连接成功')
		const num = await User.find()
		const result = await User.find({}).skip(start).limit(end)
    console.log(result)
    if(result){
			res.json({
				code: 20000,
				msg: '获取用户数据成功',
				list: result,
				total: num.length
			})
		}
	})
})
// 修改用户
app.post('/user/edit',(req, res)=>{
	console.log(req.body)
	mongoose.connect('mongodb://localhost:27017/movie1').then(mon=>{
		User.findByIdAndUpdate(req.body.id,req.body).then(result=>{
			res.json({
				code: 20000,
				msg:'用户修改成功'
			})
		})
	})
})
// 根据id获取用户
app.get('/user/:id', (req, res)=>{
	const id = req.params.id
	console.log(111111,id)
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		User.findById(id).then(result=>{
			console.log(result)
			if(result){
				res.json({
					code: 20000,
					msg: '获取用户数据成功',
					user: result
				})
			}
		})
	})
})
// 删除用户信息
app.post('/user/delete/:id',(req, res)=>{
	const id = req.params.id
	mongoose.connect('mongodb://localhost:27017/movie1').then(async (mon) => {
		User.findByIdAndDelete(id).then(result=>{
			if(result){
				res.json({
					code: 20000,
					msg: '删除用户成功'
				})
			}
		})
    
	})
})
//用户模糊查询
app.post('/userarch', (req, res) => {
	var { search } = req.body
	var val = new RegExp(search)
	mongoose.connect('mongodb://localhost:27017/movie1', { useNewUrlParser: true, useUnifiedTopology: true }).then(mon => {
		User.find({ name: { $regex: val } }).then(result => {
			res.json({
				code: 20000,
				msg: '查询成功',
				list: result
			})
		})
	})

})






app.listen(8123,'127.0.0.1')