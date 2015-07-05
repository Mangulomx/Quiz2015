
var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId

exports.load = function(req, res, next, quizId)
{
	models.Quiz.find(quizId).then(
		function(quiz)
		{
			if(quiz) 
			{
				req.quiz = quiz;
				next();
			}
			else
			{
				next(new Error('No existe quizId='+quizId));
			}
		}
	).catch(function(error){next(error);});
};

//GET /quizes

exports.index = function(req, res)
{
	//Defino un objeto vacio en caso de que el usuario no hago ninguna busqueda
	var query={};
	console.log("request"+req.query.search);
	//si el usuario realizo una busqueda compongo el query
	if(req.query.search===undefined)
	{
		query ={order: 'pregunta ASC'};
	}
	else
	{
		var search = '%'+req.query.search.replace(/\s+/g,'%')+'%';
		query = {where:["pregunta like?", search], order:'pregunta ASC'};
		console.log("hola"+query);
	}
	models.Quiz.findAll(query).then(function(quizes)
	{
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	}).catch(function(error){ next(error);})
};

//GET /quizes/:id

exports.show = function(req, res)
{
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer

exports.answer = function(req, res)
{
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta)
	{
		resultado = 'Correcto';
	}
	res.render('quizes/answer', 
	{	quiz: req.quiz, 
		respuesta: resultado,
		errors: []
	}
	);
};

//GET /quizes/new

exports.new = function(req, res)
{
	var quiz = models.Quiz.build(
		//Crea objeto
		{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create

exports.create = function(req, res)
{
	var quiz = models.Quiz.build( req.body.quiz );
	//Guardar en la DB los campos pregunta y respuesta de quiz
	quiz
	.validate()
	.then(
		function(err)
		{
			if(err)
			{
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}
			else
			{
				//save: guarda en DB campos preguntas y respuesta de quiz
				quiz.save({fields: ["pregunta","respuesta"]}).then(function()
				{
					res.redirect('/quizes') //Redirect http(url relativo) lista de preguntas.
				})
			}
		}
	)
};

