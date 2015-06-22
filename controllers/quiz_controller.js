
var models = require('../models/models.js');

//GET /quizes/question

exports.question = function(req, res)
{
	models.Quiz.findAll().success(function(quiz)
	{
		res.render('quizes/question', quiz[0].pregunta);
	})
};

//GET /quizes/answer

exports.answer = function(req, res)
{
	models.Quiz.findAll().success(function(quiz)
	{
		if(req.query.respuesta === quiz[0].respuesta)
		{
			res.render('quizes/answer', {respuesta: 'Correcta'});
		}
		else
		{
			res.render('quizes/answer', {respuesta: 'Incorrecta'});
		}
	})
};

//GET /author

exports.author = function(req, res)
{
	res.render('author', {name: 'Miguel Angulo Martinez', images: 'foto.jpeg'});
};